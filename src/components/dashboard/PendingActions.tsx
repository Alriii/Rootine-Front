import { Card } from "@/components/ui/card";
import { DashboardIcon } from "@/components/shared/DashboardIcon";
import { TaskRow } from "@/components/shared/TaskRow";
import { Spinner } from "@/components/ui/spinner";
import type { Category, Task } from "@/components/shared/types";
import { formatDate } from "@/utils/calendarUtils";
import { useState } from "react";

interface PendingActionsProps {
	tasks: Task[];
	search: string;
	openMenuId: string | null;
	busyTaskIds?: Set<string>;
	isLoading?: boolean;
	onToggleTask: (id: string) => void;
	onToggleMenu: (id: string) => void;
	onDeleteTask: (id: string) => void;
	onUpdateTask: (task: Task) => void;
}

const categories: Array<"All" | Category> = ["All", "Work", "Personal", "Health"];

export function PendingActions({
	tasks,
	search,
	openMenuId,
	busyTaskIds,
	isLoading = false,
	onToggleTask,
	onToggleMenu,
	onDeleteTask,
	onUpdateTask,
}: PendingActionsProps) {
	const [categoryFilter, setCategoryFilter] = useState<"All" | Category>("All");
	const pendingTasks = tasks.filter((task) => !task.completed);
	const query = search.trim().toLowerCase();
	const filteredTasks = pendingTasks.filter((task) => {
		const matchesCategory = categoryFilter === "All" || task.category === categoryFilter;
		const matchesSearch = !query || `${task.title} ${task.category} ${task.detail ?? ""}`.toLowerCase().includes(query);
		return matchesCategory && matchesSearch;
	});

	return (
		<Card className="overflow-visible rounded-2xl border-[#d8e8df] bg-white shadow-sm">
			<div className="border-b border-[#d8e8df] px-4 pb-4 pt-4 sm:px-5 sm:pt-5 lg:px-6 lg:pt-6">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
					<div>
						<div className="flex items-center gap-2">
							<span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#c2570d] to-[#ea580c] text-white shadow-sm">
								<DashboardIcon name="alert" className="h-4 w-4" />
							</span>
							<h2 className="text-base font-bold tracking-tight text-[#0d1f18] sm:text-lg">
								Pending Actions
							</h2>
						</div>
						<p aria-live="polite" className="mt-1.5 text-xs text-[#4d6658]">
							{pendingTasks.length} pending {pendingTasks.length === 1 ? "action" : "actions"} requiring attention
						</p>
					</div>
					<div role="group" aria-label="Filter by category" className="flex flex-wrap gap-1.5">
						{categories.map((category) => {
							const isSelected = categoryFilter === category;
							return (
								<button
									key={category}
									type="button"
									onClick={() => setCategoryFilter(category)}
									aria-pressed={isSelected}
									className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-150 active:scale-95 cursor-pointer ${
										isSelected
											? "bg-[#194d33] text-white shadow-2xs"
											: "border border-[#e2ece5] bg-white text-[#4a6354] hover:bg-[#f2f6f2] hover:text-[#173826]"
									}`}
								>
									{category}
								</button>
							);
						})}
					</div>
				</div>
			</div>

			<div className="flex min-h-[340px] flex-col gap-2 px-4 py-4 sm:min-h-[376px] sm:px-5 lg:px-6">
				{isLoading ? (
					<div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
						<Spinner className="h-8 w-8 text-[#194d33]" />
						<p className="mt-3 text-xs font-semibold text-[#5a7365]">Loading pending tasks...</p>
					</div>
				) : filteredTasks.length > 0 ? (
					filteredTasks.map((task) => (
						<TaskRow
							key={task.id}
							task={task}
							menuOpen={openMenuId === task.id}
							timeLabel={`${formatDate(task.date)} · ${task.time}`}
							showTimeOnMobile
							isBusy={busyTaskIds?.has(task.id)}
							onToggle={() => onToggleTask(task.id)}
							onToggleMenu={() => onToggleMenu(task.id)}
							onDelete={() => onDeleteTask(task.id)}
							onUpdate={onUpdateTask}
						/>
					))
				) : (
					<div className="flex flex-1 flex-col items-center justify-center py-14 text-center">
						<span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#e8f5ee] to-[#d1ead9] text-2xl shadow-sm">
							{pendingTasks.length === 0 ? "✨" : "🔍"}
						</span>
						<p className="mt-4 text-sm font-semibold text-[#0d1f18]">
							{pendingTasks.length === 0 ? "You’re all caught up!" : "No tasks found"}
						</p>
						<p className="mt-1 text-xs text-[#8aab97]">
							{pendingTasks.length === 0
								? "There are no pending actions right now."
								: "Try another search or category filter."}
						</p>
					</div>
				)}
			</div>

			<div className="flex items-center justify-between border-t border-[#d8e8df] px-4 py-3 text-xs text-[#8aab97] sm:px-5 lg:px-6">
				<span>
					Showing <span className="font-semibold text-[#4d6658]">{filteredTasks.length}</span> of{" "}
					<span className="font-semibold text-[#4d6658]">{pendingTasks.length}</span> pending actions
				</span>
				<span className="font-medium text-[#4d6658]">All dates</span>
			</div>
		</Card>
	);
}
