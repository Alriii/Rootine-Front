import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { UpcomingFilters } from "@/components/upcoming/UpcomingFilters";
import { UpcomingTaskList } from "@/components/upcoming/UpcomingTaskList";
import type { TimelineFilter } from "@/components/upcoming/upcomingUtils";
import type { Task } from "@/components/shared/types";

interface UpcomingTimelineProps {
	groups: [string, Task[]][];
	filter: TimelineFilter;
	taskCount: number;
	openMenuId: string | null;
	busyTaskIds?: Set<string>;
	isLoading?: boolean;
	onFilterChange: (filter: TimelineFilter) => void;
	onToggleTask: (id: string) => void;
	onToggleMenu: (id: string) => void;
	onDeleteTask: (id: string) => void;
	onUpdateTask: (task: Task) => void;
	onOpenAddTask?: () => void;
}

export function UpcomingTimeline({
	groups,
	filter,
	taskCount,
	openMenuId,
	busyTaskIds,
	isLoading = false,
	onFilterChange,
	onToggleTask,
	onToggleMenu,
	onDeleteTask,
	onUpdateTask,
	onOpenAddTask,
}: UpcomingTimelineProps) {
	const isEmpty = groups.length === 0;

	return (
		<Card className="overflow-visible rounded-2xl border border-[#e4ece6] bg-white p-5 shadow-xs sm:p-6">
			{/* Header: Branch icon + Chronological Timeline + Filter pills */}
			<div className="flex flex-col gap-3 pb-5 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-center gap-2.5">
					<span className="text-[#194d33]">
						<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<circle cx="6" cy="6" r="3" />
							<circle cx="6" cy="18" r="3" />
							<circle cx="18" cy="12" r="3" />
							<line x1="9" y1="6" x2="15" y2="10" />
							<line x1="9" y1="18" x2="15" y2="14" />
						</svg>
					</span>
					<h2 className="text-base font-bold text-[#173826]">
						Chronological Timeline
					</h2>
					{taskCount > 0 && (
						<span className="ml-1 rounded-md bg-[#eaf3eb] px-2 py-0.5 text-xs font-bold text-[#194d33]">
							{taskCount}
						</span>
					)}
				</div>

				<UpcomingFilters value={filter} onChange={onFilterChange} />
			</div>

			{/* Content */}
			{isLoading ? (
				<div className="flex flex-col items-center justify-center py-16 text-center">
					<Spinner className="h-8 w-8 text-[#194d33]" />
					<p className="mt-3 text-xs font-semibold text-[#5a7365]">Loading your upcoming tasks...</p>
				</div>
			) : isEmpty ? (
				<div className="flex flex-col items-center justify-center py-12 text-center sm:py-16">
					{/* Calendar with leaves illustration matching mockup */}
					<div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-[#f0f6f1]">
						{/* Background leaves */}
						<svg className="absolute -right-1 -top-1 h-14 w-14 text-[#2e7d52] opacity-80" viewBox="0 0 24 24" fill="currentColor">
							<path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66l.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.75C6.2 7.6 4.7 9.5 4 12c2.5-2 6.5-2.5 10-2.5l3-1.5z" />
						</svg>
						<svg className="absolute -bottom-1 -right-2 h-16 w-16 text-[#34d399] opacity-75" viewBox="0 0 24 24" fill="currentColor">
							<path d="M20 4c-8.5 0-14 3.8-14 10a6 6 0 0 0 6 6c6.2 0 10-5.5 10-14V4h-2Z" />
						</svg>

						{/* Desk Calendar */}
						<div className="relative z-10 flex h-20 w-22 flex-col overflow-hidden rounded-xl border-2 border-[#b8d9c6] bg-white shadow-xs">
							{/* Spiral hooks */}
							<div className="flex h-5 items-center justify-around border-b border-[#d8e8df] bg-[#ebf4ed] px-1 text-[8px] font-extrabold text-[#194d33]">
								<span>C</span><span>C</span><span>C</span><span>C</span>
							</div>
							{/* Mini grid dots */}
							<div className="grid grid-cols-4 gap-1 p-2">
								{Array.from({ length: 8 }).map((_, i) => (
									<span key={i} className="h-1.5 w-1.5 rounded-full bg-[#d8e8df]" />
								))}
							</div>
						</div>
					</div>

					<h3 className="mt-5 text-base font-bold text-[#173826]">
						No upcoming tasks
					</h3>
					<p className="mt-1 max-w-sm text-xs leading-relaxed text-[#5a7365]">
						You&apos;re all set! Enjoy your focus time or add a new task to get started.
					</p>

					<button
						type="button"
						onClick={onOpenAddTask}
						className="mt-5 inline-flex items-center gap-1.5 rounded-xl border border-[#d2e2d6] bg-white px-4 py-2 text-xs font-semibold text-[#194d33] shadow-2xs transition hover:bg-[#ebf4ed]"
					>
						+ Add Your First Task
					</button>
				</div>
			) : (
				<div className="space-y-5 pt-2">
					<UpcomingTaskList
						groups={groups}
						openMenuId={openMenuId}
						busyTaskIds={busyTaskIds}
						onToggleTask={onToggleTask}
						onToggleMenu={onToggleMenu}
						onDeleteTask={onDeleteTask}
						onUpdateTask={onUpdateTask}
					/>
				</div>
			)}
		</Card>
	);
}
