import { useMemo } from "react";
import { CompletedTaskList } from "@/components/completed/CompletedTaskList";
import type { Task } from "@/components/shared/types";
import { Card } from "@/components/ui/card";
import { DashboardIcon } from "@/components/shared/DashboardIcon";
import { formatDate, getCompletionDate } from "@/utils/calendarUtils";

interface CompletedTodayProps {
	tasks: Task[];
	todayDateKey: string;
	search: string;
	openMenuId: string | null;
	busyTaskIds?: Set<string>;
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
	busyTaskIds,
	onToggleTask,
	onToggleMenu,
	onDeleteTask,
	onUpdateTask,
}: CompletedTodayProps) {
	const completedToday = useMemo(
		() =>
			tasks.filter(
				(task) =>
					task.completed && task.completedAt !== undefined && getCompletionDate(task) === todayDateKey,
			),
		[tasks, todayDateKey],
	);
	const query = search.trim().toLowerCase();
	const filteredTasks = completedToday.filter(
		(task) =>
			!query || `${task.title} ${task.category} ${task.detail ?? ""}`.toLowerCase().includes(query),
	);

	return (
		<Card className="overflow-visible rounded-2xl border-[#d8e8df] bg-white shadow-sm">
			<div className="border-b border-[#d8e8df] px-4 pb-4 pt-4 sm:px-5 sm:pt-5 lg:px-6 lg:pt-6">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
					<div>
						<div className="flex items-center gap-2">
							<span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#16a34a] to-[#22c55e] text-white shadow-sm">
								<DashboardIcon name="check" className="h-4 w-4" />
							</span>
							<h2 className="text-base font-bold tracking-tight text-[#0d1f18] sm:text-lg">
								Tasks Completed Today
							</h2>
						</div>
						<p aria-live="polite" className="mt-1.5 text-xs text-[#4d6658]">
							{completedToday.length} {completedToday.length === 1 ? "task" : "tasks"} completed &middot; {formatDate(todayDateKey)}
						</p>
					</div>
				</div>
			</div>

			<div className="flex min-h-[340px] flex-col gap-2 px-4 py-4 sm:min-h-[376px] sm:px-5 lg:px-6">
				<CompletedTaskList
					tasks={filteredTasks}
					openMenuId={openMenuId}
					busyTaskIds={busyTaskIds}
					onToggleTask={onToggleTask}
					onToggleMenu={onToggleMenu}
					onDeleteTask={onDeleteTask}
					onUpdateTask={onUpdateTask}
				/>
			</div>

			<div className="flex items-center justify-between border-t border-[#d8e8df] px-4 py-3 text-xs text-[#8aab97] sm:px-5 lg:px-6">
				<span>
					Showing <span className="font-semibold text-[#4d6658]">{filteredTasks.length}</span> of{" "}
					<span className="font-semibold text-[#4d6658]">{completedToday.length}</span> completed today
				</span>
				<span className="font-medium text-[#4d6658]">{formatDate(todayDateKey)}</span>
			</div>
		</Card>
	);
}
