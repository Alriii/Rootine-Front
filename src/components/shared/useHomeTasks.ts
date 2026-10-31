import { useMemo, useState, useSyncExternalStore } from "react";
import { initialTasks } from "@/data/initialTasks";
import type { Task, TaskView } from "@/components/shared/types";
import { formatDateKey, getCompletionDate } from "@/utils/calendarUtils";

const storageKey = "rootine.tasks";
const taskListeners = new Set<() => void>();
let taskSnapshot: Task[] | undefined;

function isTask(value: unknown): value is Task {
	if (typeof value !== "object" || value === null) return false;
	const task = value as Partial<Task>;
	return typeof task.id === "string"
		&& typeof task.title === "string"
		&& (task.category === "Work" || task.category === "Personal" || task.category === "Health")
		&& typeof task.time === "string"
		&& typeof task.date === "string"
		&& typeof task.completed === "boolean"
		&& (typeof task.priority === "boolean" || task.priority === "Low" || task.priority === "Medium" || task.priority === "High")
		&& (task.detail === undefined || typeof task.detail === "string")
		&& (task.notes === undefined || typeof task.notes === "string")
		&& (task.completedAt === undefined || typeof task.completedAt === "string");
}

function getTaskSnapshot() {
	if (taskSnapshot) return taskSnapshot;
	if (typeof window === "undefined") {
		taskSnapshot = initialTasks;
		return taskSnapshot;
	}

	try {
		const savedTasks = window.localStorage.getItem(storageKey);
		if (savedTasks === null) {
			taskSnapshot = initialTasks;
		} else {
			const parsed: unknown = JSON.parse(savedTasks);
			if (!Array.isArray(parsed) || !parsed.every(isTask)) {
				console.error("Saved Rootine tasks are invalid; using the initial task data.");
				taskSnapshot = initialTasks;
			} else {
				taskSnapshot = parsed;
			}
		}
	} catch (error) {
		console.error("Could not load saved Rootine tasks; using the initial task data.", error);
		taskSnapshot = initialTasks;
	}
	return taskSnapshot;
}

function subscribeToTasks(listener: () => void) {
	taskListeners.add(listener);
	return () => taskListeners.delete(listener);
}

function updateTasks(update: (tasks: Task[]) => Task[]) {
	taskSnapshot = update(getTaskSnapshot());
	if (typeof window !== "undefined") {
		try {
			window.localStorage.setItem(storageKey, JSON.stringify(taskSnapshot));
		} catch (error) {
			console.error("Could not save Rootine tasks to browser storage.", error);
		}
	}
	taskListeners.forEach((listener) => listener());
}

export function useHomeTasks(taskView: TaskView = "all", initialSelectedDate: string | null = formatDateKey(new Date())) {
	const tasks = useSyncExternalStore(subscribeToTasks, getTaskSnapshot, () => initialTasks);
	const [categoryFilter, setCategoryFilter] = useState("All");
	const [search, setSearch] = useState("");
	const [selectedDate, setSelectedDate] = useState<string | null>(initialSelectedDate);
	const [openMenuId, setOpenMenuId] = useState<string | null>(null);

	const visibleTasks = useMemo(() => tasks.filter((task) => {
		const matchesView = taskView === "all" || (taskView === "completed" ? task.completed : !task.completed);
		const matchesCategory = categoryFilter === "All" || task.category === categoryFilter;
		const taskDate = taskView === "completed" ? getCompletionDate(task) : task.date;
		const matchesDate = selectedDate === null || taskDate === selectedDate;
		const query = search.trim().toLowerCase();
		const matchesSearch = !query || `${task.title} ${task.category} ${task.detail ?? ""}`.toLowerCase().includes(query);
		return matchesView && matchesCategory && matchesDate && matchesSearch;
	}), [categoryFilter, search, selectedDate, taskView, tasks]);

	const milestone = tasks.find((task) => task.id === "team-planning");

	function toggleTask(id: string) {
		updateTasks((currentTasks) => currentTasks.map((task) =>
			task.id === id
				? task.completed
					? { ...task, completed: false, completedAt: undefined }
					: { ...task, completed: true, completedAt: new Date().toISOString() }
				: task,
		));
		setOpenMenuId(null);
	}

	function createTask(task: Task) {
		updateTasks((currentTasks) => [...currentTasks, task]);
		setSelectedDate(task.date);
	}

	function deleteTask(id: string) {
		updateTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
		setOpenMenuId(null);
	}

	function updateTask(updatedTask: Task) {
		updateTasks((currentTasks) => currentTasks.map((task) =>
			task.id === updatedTask.id ? updatedTask : task,
		));
		setOpenMenuId(null);
	}

	return {
		tasks,
		visibleTasks,
		milestone,
		categoryFilter,
		setCategoryFilter,
		search,
		setSearch,
		selectedDate,
		setSelectedDate,
		openMenuId,
		setOpenMenuId,
		toggleTask,
		createTask,
		deleteTask,
		updateTask,
	};
}
