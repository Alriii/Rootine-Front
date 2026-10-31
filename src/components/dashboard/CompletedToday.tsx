import { useMemo } from "react";
import { CompletedTaskList } from "@/components/completed/CompletedTaskList";
import type { Task } from "@/components/shared/types";
import { Card } from "@/components/ui/card";
import { formatDate, getCompletionDate } from "@/utils/calendarUtils";

interface CompletedTodayProps {
	tasks: Task[];
	todayDateKey: string;
	search: string;
	openMenuId: string | null;
	onToggleTask: (id: string) => void;
	onToggleMenu: (id: string) => void;
	onDeleteTask: (id: string) => void;
	onUpdateTask: (task: Task) => void;
}

export function CompletedToday({
	tasks,
	todayDateKey,
	search,
	openMenuId,
	onToggleTask,
	onToggleMenu,
	onDeleteTask,
	onUpdateTask,
}: CompletedTodayProps) {
	const completedToday = useMemo(
		() => tasks.filter((task) =>
			task.completed && task.completedAt !== undefined && getCompletionDate(task) === todayDateKey,
		),
		[tasks, todayDateKey],
	);
	const query = search.trim().toLowerCase();
	const filteredTasks = completedToday.filter((task) =>
		!query || `${task.title} ${task.category} ${task.detail ?? ""}`.toLowerCase().includes(query),
	);

	return (
		<Card className="overflow-visible rounded-2xl border-[#E2E8F0] bg-white p-4 shadow-none sm:p-5 lg:p-6">
			<div className="flex flex-col gap-4 border-b border-[#EEF1F4] pb-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h2 className="text-lg font-semibold tracking-tight text-[#0F172A]">Tasks Completed Today</h2>
					<p aria-live="polite" className="mt-1 text-xs text-[#94A3B8]">
						{completedToday.length} {completedToday.length === 1 ? "task" : "tasks"} completed · {formatDate(todayDateKey)}
					</p>
				</div>
			</div>
			<div className="mt-4 flex min-h-[340px] flex-col gap-2.5 sm:min-h-[376px]">
				<CompletedTaskList
					tasks={filteredTasks}
					openMenuId={openMenuId}
					onToggleTask={onToggleTask}
					onToggleMenu={onToggleMenu}
					onDeleteTask={onDeleteTask}
					onUpdateTask={onUpdateTask}
				/>
			</div>
			<div className="mt-4 flex items-center justify-between border-t border-[#EEF1F4] pt-4 text-xs text-[#94A3B8]">
				<span>Showing {filteredTasks.length} of {completedToday.length} completed today</span>
				<span>{formatDate(todayDateKey)}</span>
			</div>
		</Card>
	);
}
