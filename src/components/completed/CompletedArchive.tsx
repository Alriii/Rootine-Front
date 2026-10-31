import { Card } from "@/components/ui/card";
import { CompletedFilters } from "@/components/completed/CompletedFilters";
import { CompletedTaskList } from "@/components/completed/CompletedTaskList";
import type { Task, Category } from "@/components/shared/types";
import { formatDate } from "@/utils/calendarUtils";

interface CompletedArchiveProps {
	tasks: Task[];
	totalCompleted: number;
	selectedDate: string | null;
	categoryFilter: "All" | Category;
	openMenuId: string | null;
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
	onCategoryChange,
	onToggleTask,
	onToggleMenu,
	onDeleteTask,
	onUpdateTask,
	onClearFilters,
}: CompletedArchiveProps) {
	return (
		<Card className="overflow-visible rounded-2xl border-[#E2E8F0] bg-white p-4 shadow-none sm:p-5 lg:p-6">
			<div className="flex flex-col gap-4 border-b border-[#EEF1F4] pb-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h2 className="text-lg font-semibold tracking-tight text-[#0F172A]">Archive of Finished Tasks</h2>
					<p className="mt-1 text-xs text-[#94A3B8]">
						{selectedDate ? `Completed ${formatDate(selectedDate)}` : `${tasks.length} completed tasks`}
					</p>
				</div>
				<CompletedFilters value={categoryFilter} onChange={onCategoryChange} />
			</div>
			<div className="mt-4 flex min-h-[340px] flex-col gap-2.5 sm:min-h-[376px]">
				<CompletedTaskList
					tasks={tasks}
					openMenuId={openMenuId}
					onToggleTask={onToggleTask}
					onToggleMenu={onToggleMenu}
					onDeleteTask={onDeleteTask}
					onUpdateTask={onUpdateTask}
				/>
			</div>
			<div className="mt-4 flex items-center justify-between border-t border-[#EEF1F4] pt-4 text-xs text-[#94A3B8]">
				<span>Showing {tasks.length} of {totalCompleted} finished tasks</span>
				<button type="button" onClick={onClearFilters} className="font-medium text-[#2E7D52] hover:text-[#15803D]">
					Clear filters
				</button>
			</div>
		</Card>
	);
}
