import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DashboardIcon } from "@/components/shared/DashboardIcon";
import { TaskRow } from "@/components/shared/TaskRow";
import { formatDate } from "@/utils/calendarUtils";
import type { Task } from "@/components/shared/types";

interface TodaysScheduleProps {
	tasks: Task[];
	totalTasks: number;
	selectedDate: string | null;
	categoryFilter: string;
	openMenuId: string | null;
	onCategoryChange: (category: string) => void;
	onToggleTask: (id: string) => void;
	onToggleMenu: (id: string) => void;
	onDeleteTask: (id: string) => void;
	onUpdateTask: (task: Task) => void;
	onClearDate: () => void;
}

export function TodaysSchedule({
	tasks,
	totalTasks,
	selectedDate,
	categoryFilter,
	openMenuId,
	onCategoryChange,
	onToggleTask,
	onToggleMenu,
	onDeleteTask,
	onUpdateTask,
	onClearDate,
}: TodaysScheduleProps) {
	return (
		<Card className="overflow-visible rounded-2xl border-[#E2E8F0] bg-white p-4 shadow-none sm:p-5 lg:p-6">
			<div className="flex flex-col gap-4 border-b border-[#EEF1F4] pb-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h2 className="text-lg font-semibold tracking-tight text-[#0F172A]">Today&apos;s Schedule</h2>
					<p className="mt-1 text-xs text-[#94A3B8]">
						{selectedDate ? formatDate(selectedDate) : "All scheduled dates"}
					</p>
				</div>
				<div className="flex flex-wrap gap-1.5">
					{["All", "Work", "Personal", "Health"].map((category) => (
						<Button
							key={category}
							variant="tertiary"
							onClick={() => onCategoryChange(category)}
							aria-pressed={categoryFilter === category}
							className={`rounded-lg px-3 py-1.5 text-xs ${
								categoryFilter === category
									? "bg-[#EDF6EE] font-semibold text-[#2E7D52] hover:bg-[#EDF6EE] hover:text-[#2E7D52]"
									: "text-[#64748B] hover:bg-[#F1F5F9]"
							}`}
						>
							{category}
						</Button>
					))}
				</div>
			</div>
			<div className="mt-4 flex min-h-[340px] flex-col gap-2.5 sm:min-h-[376px]">
				{tasks.length > 0 ? tasks.map((task) => (
					<TaskRow
						key={task.id}
						task={task}
						menuOpen={openMenuId === task.id}
						onToggle={() => onToggleTask(task.id)}
						onToggleMenu={() => onToggleMenu(task.id)}
						onDelete={() => onDeleteTask(task.id)}
						onUpdate={onUpdateTask}
					/>
				)) : (
					<div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
						<span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EDF6EE] text-[#2E7D52]">
							<DashboardIcon name="check" className="h-5 w-5" />
						</span>
						<p className="mt-3 text-sm font-medium text-[#334155]">No tasks found</p>
						<p className="mt-1 text-xs text-[#94A3B8]">Try another date or filter.</p>
					</div>
				)}
			</div>
			<div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#EEF1F4] pt-4 text-xs text-[#94A3B8]">
				<span>Showing {tasks.length} of {totalTasks} tasks</span>
				<button type="button" onClick={onClearDate} className="font-medium text-[#2E7D52] hover:text-[#15803D]">
					View all dates
				</button>
			</div>
		</Card>
	);
}
