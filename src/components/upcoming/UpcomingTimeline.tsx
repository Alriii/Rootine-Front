import { Card } from "@/components/ui/card";
import { UpcomingFilters } from "@/components/upcoming/UpcomingFilters";
import { UpcomingTaskList } from "@/components/upcoming/UpcomingTaskList";
import type { TimelineFilter } from "@/components/upcoming/upcomingUtils";
import type { Task } from "@/components/shared/types";

interface UpcomingTimelineProps {
	groups: [string, Task[]][];
	filter: TimelineFilter;
	taskCount: number;
	openMenuId: string | null;
	onFilterChange: (filter: TimelineFilter) => void;
	onToggleTask: (id: string) => void;
	onToggleMenu: (id: string) => void;
	onDeleteTask: (id: string) => void;
	onUpdateTask: (task: Task) => void;
}

export function UpcomingTimeline({
	groups,
	filter,
	taskCount,
	openMenuId,
	onFilterChange,
	onToggleTask,
	onToggleMenu,
	onDeleteTask,
	onUpdateTask,
}: UpcomingTimelineProps) {
	return (
		<Card className="overflow-visible rounded-2xl border-[#E2E8F0] bg-white p-4 shadow-none sm:p-5 lg:p-6">
			<div className="flex flex-col gap-4 border-b border-[#EEF1F4] pb-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h2 className="text-lg font-semibold tracking-tight text-[#0F172A]">Chronological Timeline</h2>
					<p className="mt-1 text-xs text-[#94A3B8]">
						{taskCount} {taskCount === 1 ? "task" : "tasks"}
						{filter === "This Week"
							? " due this week"
							: filter === "Next Week"
								? " next week"
								: filter === "High Priority"
									? " high priority"
									: " scheduled"}
					</p>
				</div>
				<UpcomingFilters value={filter} onChange={onFilterChange} />
			</div>
			<div className="mt-5 min-h-[360px] space-y-5">
				<UpcomingTaskList
					groups={groups}
					openMenuId={openMenuId}
					onToggleTask={onToggleTask}
					onToggleMenu={onToggleMenu}
					onDeleteTask={onDeleteTask}
					onUpdateTask={onUpdateTask}
				/>
			</div>
		</Card>
	);
}
