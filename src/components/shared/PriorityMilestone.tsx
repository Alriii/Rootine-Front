import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DashboardIcon } from "@/components/shared/DashboardIcon";
import { formatDate } from "@/utils/calendarUtils";
import type { Task } from "@/components/shared/types";

interface PriorityMilestoneProps {
	task?: Task;
	onComplete: () => void;
	badgeLabel?: string;
}

export function PriorityMilestone({ task, onComplete, badgeLabel = "Upcoming Focus" }: PriorityMilestoneProps) {
	return (
		<Card className="rounded-2xl border-[#E2E8F0] bg-white p-5 shadow-none sm:p-6">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div className="flex items-center gap-2.5">
					<span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF3E8] text-[#E58A32]">
						<DashboardIcon name="alert" className="h-[18px] w-[18px]" />
					</span>
					<h2 className="text-base font-semibold text-[#0F172A]">Priority Milestone</h2>
				</div>
				<span className="rounded-full bg-[#FFF3E8] px-2.5 py-1 text-[10px] font-semibold text-[#C66B1D]">
					{badgeLabel}
				</span>
			</div>
			<div className="mt-5 rounded-xl border border-[#E9EDF0] bg-[#FCFDFC] p-4">
				<div className="flex items-start gap-3">
					<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2E7D52] text-white">
						<DashboardIcon name="bolt" className="h-[17px] w-[17px]" />
					</span>
					<div className="min-w-0 flex-1">
						<h3 className="text-sm font-semibold leading-5 text-[#1E293B]">
							{task?.title ?? "Quarterly Team Planning Call"}
						</h3>
						<p className="mt-1 text-xs text-[#94A3B8]">
							Due Date: {task ? `${formatDate(task.date)} at ${task.time}` : "Oct 26, 2026 at 10:30 AM"}
						</p>
						<span className="mt-3 inline-flex rounded-md bg-[#F1F5F9] px-2 py-0.5 text-[10px] font-medium text-[#64748B]">
							Work
						</span>
					</div>
				</div>
				<Button
					variant="tertiary"
					disabled={!task || task.completed}
					onClick={onComplete}
					className="mt-3 px-0 py-1 text-xs font-semibold text-[#2E7D52] hover:text-[#15803D]"
				>
					{task?.completed ? "Completed" : "Mark Complete"}
				</Button>
			</div>
		</Card>
	);
}
