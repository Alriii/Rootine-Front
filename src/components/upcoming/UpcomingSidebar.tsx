import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/shared/Calendar";
import { PriorityMilestone } from "@/components/shared/PriorityMilestone";
import type { Task } from "@/components/shared/types";

interface UpcomingSidebarProps {
	tasks: Task[];
	selectedDate: string | null;
	milestone?: Task;
	onSelectDate: (date: string) => void;
	onClearDate: () => void;
	onCompleteMilestone: () => void;
	onOpenAddTask?: () => void;
}

export function UpcomingSidebar({
	tasks,
	selectedDate,
	milestone,
	onSelectDate,
	onClearDate,
	onCompleteMilestone,
	onOpenAddTask,
}: UpcomingSidebarProps) {
	return (
		<aside className="flex min-w-0 flex-col gap-5">
			<Calendar tasks={tasks} selectedDate={selectedDate} onSelectDate={onSelectDate} onClearDate={onClearDate} />
			<PriorityMilestone
				task={milestone}
				onComplete={onCompleteMilestone}
				onOpenAddTask={onOpenAddTask}
			/>
		</aside>
	);
}
