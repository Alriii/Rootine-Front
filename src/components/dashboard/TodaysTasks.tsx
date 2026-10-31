import { useState } from "react";
import { DashboardIcon } from "@/components/shared/DashboardIcon";
import { TaskRow } from "@/components/shared/TaskRow";
import type { Category, Task } from "@/components/shared/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/utils/calendarUtils";

interface TodaysTasksProps {
	tasks: Task[];
	todayDateKey: string;
	search: string;
	openMenuId: string | null;
	onToggleTask: (id: string) => void;
	onToggleMenu: (id: string) => void;
	onDeleteTask: (id: string) => void;
	onUpdateTask: (task: Task) => void;
}

const categories: Array<"All" | Category> = ["All", "Work", "Personal", "Health"];

export function TodaysTasks({
	tasks,
	todayDateKey,
	search,
	openMenuId,
	onToggleTask,
	onToggleMenu,
	onDeleteTask,
	onUpdateTask,
}: TodaysTasksProps) {
	const [categoryFilter, setCategoryFilter] = useState<"All" | Category>("All");
	const todaysTasks = tasks.filter((task) => !task.completed && task.date === todayDateKey);
	const query = search.trim().toLowerCase();
	const filteredTasks = todaysTasks.filter((task) => {
		const matchesCategory = categoryFilter === "All" || task.category === categoryFilter;
		const matchesSearch = !query || `${task.title} ${task.category} ${task.detail ?? ""}`.toLowerCase().includes(query);
		return matchesCategory && matchesSearch;
	});

	return (
		<Card className="overflow-visible rounded-2xl border-[#E2E8F0] bg-white p-4 shadow-none sm:p-5 lg:p-6">
			<div className="flex flex-col gap-4 border-b border-[#EEF1F4] pb-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h2 className="text-lg font-semibold tracking-tight text-[#0F172A]">Today&apos;s Tasks</h2>
					<p className="mt-1 text-xs text-[#94A3B8]">
						{formatDate(todayDateKey)} · {todaysTasks.length} {todaysTasks.length === 1 ? "task" : "tasks"}
					</p>
				</div>
				<div role="group" aria-label="Filter by category" className="flex flex-wrap gap-1.5">
					{categories.map((category) => (
						<Button
							key={category}
							variant="tertiary"
							onClick={() => setCategoryFilter(category)}
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
				{filteredTasks.length > 0 ? filteredTasks.map((task) => (
					<TaskRow
						key={task.id}
						task={task}
						menuOpen={openMenuId === task.id}
						timeLabel={task.time}
						showTimeOnMobile
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
						<p className="mt-3 text-sm font-medium text-[#334155]">
							{todaysTasks.length === 0 ? "No tasks scheduled for today" : "No tasks found"}
						</p>
						<p className="mt-1 text-xs text-[#94A3B8]">
							{todaysTasks.length === 0 ? "Enjoy the space in your schedule." : "Try another search or category."}
						</p>
					</div>
				)}
			</div>
			<div className="mt-4 flex items-center justify-between border-t border-[#EEF1F4] pt-4 text-xs text-[#94A3B8]">
				<span>Showing {filteredTasks.length} of {todaysTasks.length} today&apos;s tasks</span>
				<span>{formatDate(todayDateKey)}</span>
			</div>
		</Card>
	);
}
