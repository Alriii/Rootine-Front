import { useState } from "react";
import { TaskRow } from "@/components/shared/TaskRow";
import type { Category, Task } from "@/components/shared/types";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

interface TodaysTasksProps {
	tasks: Task[];
	todayDateKey: string;
	search: string;
	openMenuId: string | null;
	busyTaskIds?: Set<string>;
	isLoading?: boolean;
	onToggleTask: (id: string) => void;
	onToggleMenu: (id: string) => void;
	onDeleteTask: (id: string) => void;
	onUpdateTask: (task: Task) => void;
	onOpenAddTask?: () => void;
}

const categories: Array<"All" | Category> = ["All", "Work", "Personal", "Health"];

export function TodaysTasks({
	tasks,
	todayDateKey,
	search,
	openMenuId,
	busyTaskIds,
	isLoading = false,
	onToggleTask,
	onToggleMenu,
	onDeleteTask,
	onUpdateTask,
	onOpenAddTask,
}: TodaysTasksProps) {
	const [categoryFilter, setCategoryFilter] = useState<"All" | Category>("All");
	const todaysTasks = tasks.filter((task) => !task.completed && task.date === todayDateKey);
	const query = search.trim().toLowerCase();
	const filteredTasks = todaysTasks.filter((task) => {
		const matchesCategory = categoryFilter === "All" || task.category === categoryFilter;
		const matchesSearch =
			!query || `${task.title} ${task.category} ${task.detail ?? ""}`.toLowerCase().includes(query);
		return matchesCategory && matchesSearch;
	});

	const completedToday = tasks.filter((t) => t.completed && t.date === todayDateKey).length;
	const totalToday = tasks.filter((t) => t.date === todayDateKey).length;
	const progressPct = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

	return (
		<Card className="overflow-visible rounded-2xl border border-[#e4ece6] bg-white p-5 shadow-xs sm:p-6">
			{/* Card Header: Icon + Today's Tasks + Filter Pills */}
			<div className="flex flex-col gap-3 pb-5 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-center gap-2.5">
					<span className="text-[#194d33]">
						<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<line x1="8" y1="6" x2="21" y2="6" />
							<line x1="8" y1="12" x2="21" y2="12" />
							<line x1="8" y1="18" x2="21" y2="18" />
							<line x1="3" y1="6" x2="3.01" y2="6" />
							<line x1="3" y1="12" x2="3.01" y2="12" />
							<line x1="3" y1="18" x2="3.01" y2="18" />
						</svg>
					</span>
					<div>
						<h2 className="text-base font-bold text-[#173826]">
							Today&apos;s Tasks
						</h2>
					</div>
					{totalToday > 0 && (
						<span className="ml-1 rounded-md bg-[#eaf3eb] px-2 py-0.5 text-xs font-bold text-[#194d33]">
							{completedToday}/{totalToday} ({progressPct}%)
						</span>
					)}
				</div>

				{/* Category Filter Pills */}
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

			{/* Task List or Empty State */}
			{isLoading ? (
				<div className="flex flex-col items-center justify-center py-16 text-center">
					<Spinner className="h-8 w-8 text-[#194d33]" />
					<p className="mt-3 text-xs font-semibold text-[#5a7365]">Loading your tasks...</p>
				</div>
			) : filteredTasks.length > 0 ? (
				<div className="space-y-2.5 pt-1">
					{filteredTasks.map((task) => (
						<TaskRow
							key={task.id}
							task={task}
							menuOpen={openMenuId === task.id}
							timeLabel={task.time}
							showTimeOnMobile
							isBusy={busyTaskIds?.has(task.id)}
							onToggle={() => onToggleTask(task.id)}
							onToggleMenu={() => onToggleMenu(task.id)}
							onDelete={() => onDeleteTask(task.id)}
							onUpdate={onUpdateTask}
						/>
					))}
				</div>
			) : (
				<div className="flex flex-col items-center justify-center py-12 text-center sm:py-16">
					{/* Calendar illustration */}
					<div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-[#f0f6f1]">
						<svg className="absolute -right-1 -top-1 h-14 w-14 text-[#2e7d52] opacity-80" viewBox="0 0 24 24" fill="currentColor">
							<path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66l.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.75C6.2 7.6 4.7 9.5 4 12c2.5-2 6.5-2.5 10-2.5l3-1.5z" />
						</svg>
						<svg className="absolute -bottom-1 -right-2 h-16 w-16 text-[#34d399] opacity-75" viewBox="0 0 24 24" fill="currentColor">
							<path d="M20 4c-8.5 0-14 3.8-14 10a6 6 0 0 0 6 6c6.2 0 10-5.5 10-14V4h-2Z" />
						</svg>

						<div className="relative z-10 flex h-20 w-22 flex-col overflow-hidden rounded-xl border-2 border-[#b8d9c6] bg-white shadow-xs">
							<div className="flex h-5 items-center justify-around border-b border-[#d8e8df] bg-[#ebf4ed] px-1 text-[8px] font-extrabold text-[#194d33]">
								<span>C</span><span>C</span><span>C</span><span>C</span>
							</div>
							<div className="grid grid-cols-4 gap-1 p-2">
								{Array.from({ length: 8 }).map((_, i) => (
									<span key={i} className="h-1.5 w-1.5 rounded-full bg-[#d8e8df]" />
								))}
							</div>
						</div>
					</div>

					<h3 className="mt-5 text-base font-bold text-[#173826]">
						{todaysTasks.length === 0 ? "All clear for today!" : "No tasks found"}
					</h3>
					<p className="mt-1 max-w-sm text-xs leading-relaxed text-[#5a7365]">
						{todaysTasks.length === 0
							? "You're all caught up! Enjoy your focus time or schedule a new task."
							: "Try a different search or category filter."}
					</p>

					<button
						type="button"
						onClick={onOpenAddTask}
						className="mt-5 inline-flex items-center gap-1.5 rounded-xl border border-[#d2e2d6] bg-white px-4 py-2 text-xs font-semibold text-[#194d33] shadow-2xs transition hover:bg-[#ebf4ed]"
					>
						+ Add Your First Task
					</button>
				</div>
			)}
		</Card>
	);
}
