import { DashboardIcon } from "@/components/shared/DashboardIcon";
import { TaskRow } from "@/components/shared/TaskRow";
import type { Task } from "@/components/shared/types";
import { getCompletedTime } from "@/components/completed/completedUtils";

interface CompletedTaskListProps {
	tasks: Task[];
	openMenuId: string | null;
	onToggleTask: (id: string) => void;
	onToggleMenu: (id: string) => void;
	onDeleteTask: (id: string) => void;
	onUpdateTask: (task: Task) => void;
}

export function CompletedTaskList({
	tasks,
	openMenuId,
	onToggleTask,
	onToggleMenu,
	onDeleteTask,
	onUpdateTask,
}: CompletedTaskListProps) {
	if (tasks.length === 0) {
		return (
			<div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
				<span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EDF6EE] text-[#2E7D52]">
					<DashboardIcon name="check" className="h-5 w-5" />
				</span>
				<p className="mt-3 text-sm font-medium text-[#334155]">No finished tasks found</p>
				<p className="mt-1 text-xs text-[#94A3B8]">Try clearing the date or category filter.</p>
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
					onToggle={() => onToggleTask(task.id)}
					onToggleMenu={() => onToggleMenu(task.id)}
					onDelete={() => onDeleteTask(task.id)}
					onUpdate={onUpdateTask}
				/>
			))}
		</>
	);
}
