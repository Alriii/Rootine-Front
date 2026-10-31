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
}

export function UpcomingSidebar({
	tasks,
	selectedDate,
	milestone,
	onSelectDate,
	onClearDate,
	onCompleteMilestone,
}: UpcomingSidebarProps) {
	return (
		<aside className="flex min-w-0 flex-col gap-5">
			<Calendar tasks={tasks} selectedDate={selectedDate} onSelectDate={onSelectDate} onClearDate={onClearDate} />
			{milestone ? (
				<PriorityMilestone task={milestone} onComplete={onCompleteMilestone} />
			) : (
				<Card className="rounded-2xl border-[#E2E8F0] bg-white p-5 shadow-none sm:p-6">
					<h2 className="text-base font-semibold text-[#0F172A]">Priority Milestone</h2>
					<p className="mt-4 text-sm text-[#64748B]">No upcoming tasks to highlight.</p>
				</Card>
			)}
		</aside>
	);
}
