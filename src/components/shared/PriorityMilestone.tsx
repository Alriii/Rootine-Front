import { useState } from "react";
import { Card } from "@/components/ui/card";
import { DashboardIcon } from "@/components/shared/DashboardIcon";
import { Spinner } from "@/components/ui/spinner";
import { formatDate } from "@/utils/calendarUtils";
import type { Task } from "@/components/shared/types";

interface PriorityMilestoneProps {
	task?: Task;
	onComplete: () => Promise<void> | void;
	badgeLabel?: string;
	onOpenAddTask?: () => void;
}

export function PriorityMilestone({ task, onComplete, onOpenAddTask }: PriorityMilestoneProps) {
	const [isCompleting, setIsCompleting] = useState(false);
	const isPending = task && !task.completed;

	async function handleComplete() {
		setIsCompleting(true);
		try {
			await onComplete();
		} finally {
			setIsCompleting(false);
		}
	}

	return (
		<Card className="rounded-2xl border border-[#e4ece6] bg-white p-5 shadow-xs sm:p-5.5">
			{/* Header: Flag icon + Priority Milestone */}
			<div className="flex items-center gap-2">
				<span className="text-[#194d33]">
					<svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
						<line x1="4" y1="22" x2="4" y2="15" />
					</svg>
				</span>
				<h2 className="text-sm font-bold text-[#173826]">Priority Milestone</h2>
			</div>

			{isPending ? (
				<div className="mt-4 flex items-start gap-3.5">
					<span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#ebf4ed] text-xl">
						🌱
					</span>
					<div className="min-w-0 flex-1">
						<h3 className="truncate text-sm font-bold text-[#173826]">
							{task.title}
						</h3>
						<p className="mt-0.5 text-xs text-[#70897b]">
							Due: {formatDate(task.date)} at {task.time}
						</p>
						<button
							type="button"
							onClick={handleComplete}
							disabled={isCompleting}
							className="mt-2.5 inline-flex items-center gap-1.5 rounded-xl bg-[#194d33] px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#143e29] disabled:opacity-80 disabled:cursor-wait"
						>
							{isCompleting ? (
								<>
									<Spinner className="h-3.5 w-3.5 text-white" />
									<span>Completing...</span>
								</>
							) : (
								<>
									<DashboardIcon name="check" className="h-3.5 w-3.5" />
									<span>Mark Complete</span>
								</>
							)}
						</button>
					</div>
				</div>
			) : (
				<div className="mt-4 flex items-start gap-3.5">
					<span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#ebf4ed] text-xl">
						🌱
					</span>
					<div className="min-w-0 flex-1">
						<h3 className="text-sm font-bold text-[#173826]">
							No priority milestones yet
						</h3>
						<p className="mt-1 text-xs leading-relaxed text-[#5a7365]">
							Milestones help you focus on what matters most. Set one when you're ready.
						</p>
						<button
							type="button"
							onClick={onOpenAddTask}
							className="mt-2.5 inline-flex items-center gap-1 text-xs font-bold text-[#194d33] transition hover:underline"
						>
							+ Set Milestone
						</button>
					</div>
				</div>
			)}
		</Card>
	);
}
