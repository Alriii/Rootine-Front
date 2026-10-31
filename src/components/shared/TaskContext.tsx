import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Task, TaskView } from "@/components/shared/types";
import { formatDateKey, getCompletionDate } from "@/utils/calendarUtils";
import { apiRequest } from "@/lib/api";

// ─── Backend shapes ───────────────────────────────────────────────────────────

type BackendTask = {
	id: string;
	title: string;
	description?: string | null;
	frequency: "DAILY" | "SPECIFIC_DAYS" | "TIMES_PER_WEEK";
	preferredTimeWindow?: string | null;
	color?: string | null;
	icon?: string | null;
	position: number;
	reminderEnabled: boolean;
	reminderTime?: string | null;
	reminderIntervalHours: number;
	maxDailyReminders: number;
	createdAt: string;
};

type BackendTodayTask = {
	id: string;
	title: string;
	description?: string | null;
	frequency: "DAILY" | "SPECIFIC_DAYS" | "TIMES_PER_WEEK";
	preferredTimeWindow?: string | null;
	color?: string | null;
	icon?: string | null;
	position: number;
	targetCount: number;
	completedCount: number;
	isCompleted: boolean;
	currentStreak: number;
	reminderEnabled: boolean;
	reminderTime?: string | null;
	reminderIntervalHours?: number;
	maxDailyReminders?: number;
};

function mapBackendTaskToFrontend(bTask: BackendTask | BackendTodayTask): Task {
	return {
		id: bTask.id,
		title: bTask.title,
		category: "Work",
		time: bTask.reminderTime || "09:00 AM",
		date: formatDateKey(new Date()),
		completed: "isCompleted" in bTask ? bTask.isCompleted : false,
		priority: "Medium",
		detail: bTask.description || undefined,
		notes: bTask.description || undefined,
		frequency: bTask.frequency,
		reminderEnabled: bTask.reminderEnabled,
		reminderTime: bTask.reminderTime,
		reminderIntervalHours: bTask.reminderIntervalHours ?? 1,
		maxDailyReminders: bTask.maxDailyReminders ?? 1,
	};
}

// ─── Context type ─────────────────────────────────────────────────────────────

export type TaskContextValue = {
	tasks: Task[];
	isLoading: boolean;
	busyTaskIds: Set<string>;
	openMenuId: string | null;
	setOpenMenuId: React.Dispatch<React.SetStateAction<string | null>>;
	toggleTask: (id: string) => Promise<void>;
	createTask: (task: Task) => Promise<void>;
	deleteTask: (id: string) => Promise<void>;
	updateTask: (task: Task) => Promise<void>;
	refetch: () => void;
};

// ─── Context ──────────────────────────────────────────────────────────────────

export const TaskContext = createContext<TaskContextValue | null>(null);

export function useTaskContext(): TaskContextValue {
	const ctx = useContext(TaskContext);
	if (!ctx) throw new Error("useTaskContext must be used inside <TaskProvider>");
	return ctx;
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function TaskProvider({ children }: { children: ReactNode }) {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [busyTaskIds, setBusyTaskIds] = useState<Set<string>>(new Set());
	const [openMenuId, setOpenMenuId] = useState<string | null>(null);
	const fetchCountRef = useRef(0);

	function markBusy(id: string, busy: boolean) {
		setBusyTaskIds((prev) => {
			const next = new Set(prev);
			if (busy) next.add(id);
			else next.delete(id);
			return next;
		});
	}

	function fetchTasks() {
		const token = localStorage.getItem("rootine_access_token");
		if (!token) {
			setIsLoading(false);
			return;
		}
		setIsLoading(true);
		const currentFetch = ++fetchCountRef.current;

		apiRequest<{ status: string; data: { tasks: BackendTodayTask[] } }>("/tasks/today")
			.then((res) => {
				if (fetchCountRef.current !== currentFetch) return;
				if (res.data?.tasks) {
					setTasks(res.data.tasks.map(mapBackendTaskToFrontend));
				}
			})
			.catch(() => {
				// Fallback: fetch all tasks
				apiRequest<{ status: string; data: { tasks: BackendTask[] } }>("/tasks")
					.then((listRes) => {
						if (fetchCountRef.current !== currentFetch) return;
						if (listRes.data?.tasks) {
							setTasks(listRes.data.tasks.map(mapBackendTaskToFrontend));
						}
					})
					.catch(() => {})
					.finally(() => {
						if (fetchCountRef.current === currentFetch) setIsLoading(false);
					});
				return;
			})
			.finally(() => {
				if (fetchCountRef.current === currentFetch) setIsLoading(false);
			});
	}

	// Fetch once on mount
	useEffect(() => {
		fetchTasks();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	async function toggleTask(id: string) {
		// Prevent spam clicks while request is in flight
		if (busyTaskIds.has(id)) return;

		const target = tasks.find((t) => t.id === id);
		if (!target) return;
		const nextCompleted = !target.completed;

		markBusy(id, true);
		// Optimistic update
		setTasks((curr) =>
			curr.map((t) =>
				t.id === id
					? { ...t, completed: nextCompleted, completedAt: nextCompleted ? new Date().toISOString() : undefined }
					: t,
			),
		);
		setOpenMenuId(null);

		try {
			if (nextCompleted) {
				await apiRequest(`/tasks/${id}/complete`, { method: "POST", body: JSON.stringify({}) });
			} else {
				await apiRequest(`/tasks/${id}/complete`, { method: "DELETE", body: JSON.stringify({}) });
			}
		} catch (err) {
			console.error("Failed to sync task completion:", err);
			// Roll back
			setTasks((curr) =>
				curr.map((t) => (t.id === id ? { ...t, completed: target.completed } : t)),
			);
		} finally {
			markBusy(id, false);
		}
	}

	async function createTask(task: Task) {
		// Optimistic update
		setTasks((curr) => [...curr, task]);

		const res = await apiRequest<{ status: string; data: { task: BackendTask } }>("/tasks", {
			method: "POST",
			body: JSON.stringify({
				title: task.title,
				description: task.notes || task.detail || undefined,
				frequency: task.frequency || "DAILY",
				reminderEnabled: Boolean(task.reminderEnabled),
				reminderTime: task.reminderEnabled ? task.reminderTime : null,
				reminderIntervalHours: task.reminderEnabled ? (task.reminderIntervalHours ?? 1) : 1,
				maxDailyReminders: task.reminderEnabled ? (task.maxDailyReminders ?? 1) : 1,
			}),
		}).catch((err) => {
			// Roll back optimistic update
			setTasks((curr) => curr.filter((t) => t.id !== task.id));
			throw err;
		});

		if (res?.data?.task?.id) {
			// Replace temp ID with real backend UUID
			setTasks((curr) =>
				curr.map((t) => (t.id === task.id ? { ...t, id: res.data.task.id } : t)),
			);
		}
	}

	async function deleteTask(id: string) {
		// Prevent spam clicks while request is in flight
		if (busyTaskIds.has(id)) return;

		markBusy(id, true);
		setTasks((curr) => curr.filter((t) => t.id !== id));
		setOpenMenuId(null);

		try {
			await apiRequest(`/tasks/${id}`, { method: "DELETE" });
		} catch (err) {
			console.error("Failed to delete task:", err);
		} finally {
			markBusy(id, false);
		}
	}

	async function updateTask(updatedTask: Task) {
		// Prevent spam clicks while request is in flight
		if (busyTaskIds.has(updatedTask.id)) return;

		markBusy(updatedTask.id, true);
		setTasks((curr) => curr.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
		setOpenMenuId(null);

		try {
			await apiRequest(`/tasks/${updatedTask.id}`, {
				method: "PATCH",
				body: JSON.stringify({
					title: updatedTask.title,
					description: updatedTask.notes || updatedTask.detail || undefined,
					frequency: updatedTask.frequency,
					reminderEnabled: updatedTask.reminderEnabled,
					reminderTime: updatedTask.reminderEnabled ? updatedTask.reminderTime : null,
					reminderIntervalHours: updatedTask.reminderEnabled ? (updatedTask.reminderIntervalHours ?? 1) : 1,
					maxDailyReminders: updatedTask.reminderEnabled ? (updatedTask.maxDailyReminders ?? 1) : 1,
				}),
			});
		} catch (err) {
			console.error("Failed to update task:", err);
			throw err;
		} finally {
			markBusy(updatedTask.id, false);
		}
	}

	const value = useMemo<TaskContextValue>(
		() => ({ tasks, isLoading, busyTaskIds, openMenuId, setOpenMenuId, toggleTask, createTask, deleteTask, updateTask, refetch: fetchTasks }),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[tasks, isLoading, busyTaskIds, openMenuId],
	);

	return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

// ─── Per-page helper ──────────────────────────────────────────────────────────

export function usePageTasks(taskView: TaskView = "all", initialDate: string | null = formatDateKey(new Date())) {
	const ctx = useTaskContext();
	const [categoryFilter, setCategoryFilter] = useState("All");
	const [search, setSearch] = useState("");
	const [selectedDate, setSelectedDate] = useState<string | null>(initialDate);

	const visibleTasks = useMemo(() => {
		return ctx.tasks.filter((task) => {
			const matchesView =
				taskView === "all" ||
				(taskView === "completed" ? task.completed : !task.completed);
			const matchesCategory = categoryFilter === "All" || task.category === categoryFilter;
			const taskDate = taskView === "completed" ? getCompletionDate(task) : task.date;
			const matchesDate = selectedDate === null || taskDate === selectedDate;
			const query = search.trim().toLowerCase();
			const matchesSearch =
				!query ||
				`${task.title} ${task.category} ${task.detail ?? ""}`.toLowerCase().includes(query);
			return matchesView && matchesCategory && matchesDate && matchesSearch;
		});
	}, [ctx.tasks, taskView, categoryFilter, selectedDate, search]);

	const milestone = useMemo(() => {
		const pending = ctx.tasks.filter((t) => !t.completed);
		const highPriority = pending.find((t) => t.priority === "High" || t.priority === true);
		if (highPriority) return highPriority;
		if (pending.length > 0) return pending[0];
		return ctx.tasks[0];
	}, [ctx.tasks]);

	return {
		tasks: ctx.tasks,
		visibleTasks,
		milestone,
		isLoading: ctx.isLoading,
		busyTaskIds: ctx.busyTaskIds,
		openMenuId: ctx.openMenuId,
		setOpenMenuId: ctx.setOpenMenuId,
		categoryFilter,
		setCategoryFilter,
		search,
		setSearch,
		selectedDate,
		setSelectedDate,
		toggleTask: ctx.toggleTask,
		createTask: ctx.createTask,
		deleteTask: ctx.deleteTask,
		updateTask: ctx.updateTask,
	};
}
