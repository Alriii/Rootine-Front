import { TaskRow } from "@/components/shared/TaskRow";
import type { Task } from "@/components/shared/types";
import { formatDate } from "@/utils/calendarUtils";

interface UpcomingTaskListProps {
	groups: [string, Task[]][];
	openMenuId: string | null;
	onToggleTask: (id: string) => void;
	onToggleMenu: (id: string) => void;
	onDeleteTask: (id: string) => void;
	onUpdateTask: (task: Task) => void;
}

export function UpcomingTaskList({
	groups,
	openMenuId,
	onToggleTask,
	onToggleMenu,
	onDeleteTask,
	onUpdateTask,
}: UpcomingTaskListProps) {
	if (groups.length === 0) {
		return (
			<div className="flex min-h-[320px] flex-col items-center justify-center text-center">
				<p className="text-sm font-medium text-[#334155]">No upcoming tasks</p>
				<p className="mt-1 text-xs text-[#94A3B8]">Try another filter or date.</p>
			</div>
		);
	}

	return (
		<>
			{groups.map(([label, tasks]) => (
				<section key={label} aria-label={label}>
					<h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#64748B]">
						<span className="h-2 w-2 rounded-full bg-[#22C55E]" />
						{label}
					</h3>
					<div className="mt-2.5 space-y-2 border-l border-[#D1E7D6] pl-3 sm:ml-[3px] sm:pl-4">
						{tasks.map((task) => (
							<TaskRow
								key={task.id}
								task={task}
								timeLabel={`${formatDate(task.date)} · ${task.time}`}
								showTimeOnMobile
								menuOpen={openMenuId === task.id}
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
