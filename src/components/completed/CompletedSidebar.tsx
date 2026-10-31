import { Calendar } from "@/components/shared/Calendar";
import { PriorityMilestone } from "@/components/shared/PriorityMilestone";
import type { Task } from "@/components/shared/types";
import { getCompletionDate } from "@/utils/calendarUtils";

interface CompletedSidebarProps {
	completedTasks: Task[];
	selectedDate: string | null;
	milestone?: Task;
	onSelectDate: (date: string) => void;
	onClearDate: () => void;
	onCompleteMilestone: () => void;
}

export function CompletedSidebar({
	completedTasks,
	selectedDate,
	milestone,
	onSelectDate,
	onClearDate,
	onCompleteMilestone,
}: CompletedSidebarProps) {
	return (
		<aside className="flex min-w-0 flex-col gap-5">
			<Calendar
				tasks={completedTasks}
				selectedDate={selectedDate}
				onSelectDate={onSelectDate}
				onClearDate={onClearDate}
				getTaskDate={getCompletionDate}
			/>
			<PriorityMilestone
				task={milestone}
				badgeLabel="Upcoming Focus"
				onComplete={onCompleteMilestone}
			/>
		</aside>
	);
}
