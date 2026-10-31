import { TaskRow } from "@/components/shared/TaskRow";
import type { Task } from "@/components/shared/types";
import { getCompletedTime } from "@/components/completed/completedUtils";

interface CompletedTaskListProps {
	tasks: Task[];
	openMenuId: string | null;
	busyTaskIds?: Set<string>;
	onToggleTask: (id: string) => void;
	onToggleMenu: (id: string) => void;
	onDeleteTask: (id: string) => void;
	onUpdateTask: (task: Task) => void;
}

export function CompletedTaskList({
	tasks,
	openMenuId,
	busyTaskIds,
	onToggleTask,
	onToggleMenu,
	onDeleteTask,
	onUpdateTask,
}: CompletedTaskListProps) {
	if (tasks.length === 0) {
		return (
			<div className="flex flex-1 flex-col items-center justify-center py-14 text-center">
				<span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#e8f5ee] to-[#d1ead9] text-2xl shadow-sm">
					🌱
				</span>
				<p className="mt-4 text-sm font-semibold text-[#0d1f18]">No completed tasks found</p>
				<p className="mt-1 text-xs text-[#8aab97]">Finish a task today or adjust your date filter.</p>
			</div>
		);
	}

	return (
		<>
			{tasks.map((task) => (
				<TaskRow
					key={task.id}
					task={task}
					timeLabel={getCompletedTime(task)}
					menuOpen={openMenuId === task.id}
					isBusy={busyTaskIds?.has(task.id)}
					onToggle={() => onToggleTask(task.id)}
					onToggleMenu={() => onToggleMenu(task.id)}
					onDelete={() => onDeleteTask(task.id)}
					onUpdate={onUpdateTask}
				/>
			))}
		</>
	);
}
