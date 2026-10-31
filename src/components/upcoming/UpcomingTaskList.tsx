import { TaskRow } from "@/components/shared/TaskRow";
import type { Task } from "@/components/shared/types";
import { formatDate } from "@/utils/calendarUtils";

interface UpcomingTaskListProps {
	groups: [string, Task[]][];
	openMenuId: string | null;
	busyTaskIds?: Set<string>;
	onToggleTask: (id: string) => void;
	onToggleMenu: (id: string) => void;
	onDeleteTask: (id: string) => void;
	onUpdateTask: (task: Task) => void;
}

export function UpcomingTaskList({
	groups,
	openMenuId,
	busyTaskIds,
	onToggleTask,
	onToggleMenu,
	onDeleteTask,
	onUpdateTask,
}: UpcomingTaskListProps) {
	if (groups.length === 0) {
		return (
			<div className="flex min-h-[320px] flex-col items-center justify-center text-center">
				<span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#e8f5ee] to-[#d1ead9] text-2xl shadow-sm">
					🗓️
				</span>
				<p className="mt-4 text-sm font-semibold text-[#0d1f18]">No upcoming tasks</p>
				<p className="mt-1 text-xs text-[#8aab97]">Try another filter or schedule a new task.</p>
			</div>
		);
	}

	return (
		<>
			{groups.map(([label, tasks]) => (
				<section key={label} aria-label={label} className="space-y-3">
					<div className="flex items-center gap-2.5">
						<span className="rounded-lg bg-[#e8f5ee] px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-[#1a6b40]">
							{label}
						</span>
						<div className="h-px flex-1 bg-[#d8e8df]" />
					</div>
					<div className="space-y-2 border-l-2 border-[#b8d9c6] pl-3 sm:ml-1 sm:pl-4">
						{tasks.map((task) => (
							<TaskRow
								key={task.id}
								task={task}
								timeLabel={`${formatDate(task.date)} · ${task.time}`}
								showTimeOnMobile
								menuOpen={openMenuId === task.id}
								isBusy={busyTaskIds?.has(task.id)}
								onToggle={() => onToggleTask(task.id)}
								onToggleMenu={() => onToggleMenu(task.id)}
								onDelete={() => onDeleteTask(task.id)}
								onUpdate={onUpdateTask}
							/>
						))}
					</div>
				</section>
			))}
		</>
	);
}
