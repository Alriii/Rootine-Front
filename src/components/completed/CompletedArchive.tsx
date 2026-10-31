import { Card } from "@/components/ui/card";
import { DashboardIcon } from "@/components/shared/DashboardIcon";
import { CompletedFilters } from "@/components/completed/CompletedFilters";
import { CompletedTaskList } from "@/components/completed/CompletedTaskList";
import { Spinner } from "@/components/ui/spinner";
import type { Task, Category } from "@/components/shared/types";
import { formatDate } from "@/utils/calendarUtils";

interface CompletedArchiveProps {
	tasks: Task[];
	totalCompleted: number;
	selectedDate: string | null;
	categoryFilter: "All" | Category;
	openMenuId: string | null;
	busyTaskIds?: Set<string>;
	isLoading?: boolean;
	onCategoryChange: (category: "All" | Category) => void;
	onToggleTask: (id: string) => void;
	onToggleMenu: (id: string) => void;
	onDeleteTask: (id: string) => void;
	onUpdateTask: (task: Task) => void;
	onClearFilters: () => void;
}

export function CompletedArchive({
	tasks,
	totalCompleted,
	selectedDate,
	categoryFilter,
	openMenuId,
	busyTaskIds,
	isLoading = false,
	onCategoryChange,
	onToggleTask,
	onToggleMenu,
	onDeleteTask,
	onUpdateTask,
	onClearFilters,
}: CompletedArchiveProps) {
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
								Archive of Finished Tasks
							</h2>
						</div>
						<p className="mt-1.5 text-xs text-[#4d6658]">
							{selectedDate ? `Completed on ${formatDate(selectedDate)}` : `${tasks.length} total completed tasks`}
						</p>
					</div>
					<CompletedFilters value={categoryFilter} onChange={onCategoryChange} />
				</div>
			</div>
			<div className="flex min-h-[340px] flex-col gap-2 px-4 py-4 sm:min-h-[376px] sm:px-5 lg:px-6">
				{isLoading ? (
					<div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
						<Spinner className="h-8 w-8 text-[#194d33]" />
						<p className="mt-3 text-xs font-semibold text-[#5a7365]">Loading finished tasks...</p>
					</div>
				) : (
					<CompletedTaskList
						tasks={tasks}
						openMenuId={openMenuId}
						busyTaskIds={busyTaskIds}
						onToggleTask={onToggleTask}
						onToggleMenu={onToggleMenu}
						onDeleteTask={onDeleteTask}
						onUpdateTask={onUpdateTask}
					/>
				)}
			</div>
			<div className="flex items-center justify-between border-t border-[#d8e8df] px-4 py-3 text-xs text-[#8aab97] sm:px-5 lg:px-6">
				<span>
					Showing <span className="font-semibold text-[#4d6658]">{tasks.length}</span> of{" "}
					<span className="font-semibold text-[#4d6658]">{totalCompleted}</span> finished tasks
				</span>
				<button
					type="button"
					onClick={onClearFilters}
					className="font-semibold text-[#1e7a4a] transition hover:text-[#15803d]"
				>
					Clear filters
				</button>
			</div>
		</Card>
	);
}
