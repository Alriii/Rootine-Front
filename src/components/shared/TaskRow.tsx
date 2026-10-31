import { useState } from "react";
import { AddTaskDialog } from "@/components/shared/AddTaskDialog";
import { DeleteTaskConfirmation } from "@/components/shared/DeleteTaskConfirmation";
import { DashboardIcon } from "@/components/shared/DashboardIcon";
import type { Task } from "@/components/shared/types";

interface TaskRowProps {
	task: Task;
	menuOpen: boolean;
	timeLabel?: string;
	showTimeOnMobile?: boolean;
	onToggle: () => void;
	onToggleMenu: () => void;
	onDelete: () => void;
	onUpdate: (task: Task) => void;
}

export function TaskRow({
	task,
	menuOpen,
	timeLabel,
	showTimeOnMobile = false,
	onToggle,
	onToggleMenu,
	onDelete,
	onUpdate,
}: TaskRowProps) {
	const [editing, setEditing] = useState(false);
	const [confirmingDelete, setConfirmingDelete] = useState(false);
	const isHighPriority = task.priority === true || task.priority === "High";
	const priorityLabel = typeof task.priority === "string"
		? `${task.priority} Priority`
		: isHighPriority ? "High Priority" : "Priority";
	const badge = task.completed
		? "Completed"
		: task.priority
			? priorityLabel
			: task.detail ?? "Upcoming";
	const priorityBadgeTone = task.priority === "Low"
		? "bg-[#EDF6EE] text-[#2E7D52]"
		: task.priority === "Medium"
			? "bg-[#FFF7E8] text-[#A66B13]"
			: "bg-[#FFF3E8] text-[#C66B1D]";

	return (
		<div className="flex min-h-[76px] items-center gap-3 rounded-xl border border-[#E7EBEF] bg-white px-3.5 py-3 transition hover:border-[#D1E7D6] hover:bg-[#FEFFFE] sm:gap-4 sm:px-4">
			<input
				type="checkbox"
				checked={task.completed}
				onChange={onToggle}
				aria-label={`Mark ${task.title} ${task.completed ? "incomplete" : "complete"}`}
				className="h-[18px] w-[18px] shrink-0 cursor-pointer accent-[#2E7D52]"
			/>
			<div className="min-w-0 flex-1">
				<p className={`truncate text-sm font-medium ${task.completed ? "text-[#94A3B8] line-through" : "text-[#1E293B]"}`}>
					{task.title}
				</p>
				<div className="mt-2 flex flex-wrap items-center gap-1.5">
					<span
						className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${
							task.completed
								? "bg-[#EDF6EE] text-[#2E7D52]"
								: task.priority
									? priorityBadgeTone
									: "bg-[#F1F5F9] text-[#64748B]"
						}`}
					>
						{badge}
					</span>
					<span className="rounded-md bg-[#F1F5F9] px-2 py-0.5 text-[10px] font-medium text-[#64748B]">
						{task.category}
					</span>
				</div>
			</div>
			<span className={`${showTimeOnMobile ? "" : "hidden sm:block"} shrink-0 text-[10px] text-[#64748B] sm:text-xs`}>
				{timeLabel ?? task.time}
			</span>
			<div className="relative shrink-0">
				<button
					type="button"
					onClick={onToggleMenu}
					aria-label={`Actions for ${task.title}`}
					aria-expanded={menuOpen}
					className="rounded-lg p-2 text-[#94A3B8] transition hover:bg-[#F1F5F9] hover:text-[#475569]"
				>
					<DashboardIcon name="more" className="h-[18px] w-[18px]" />
				</button>
				{menuOpen && (
					<div className="absolute right-0 top-full z-10 mt-1 w-40 rounded-xl border border-[#E2E8F0] bg-white p-1.5 shadow-lg">
						<button
							type="button"
							onClick={onToggle}
							className="w-full rounded-lg px-3 py-2 text-left text-xs text-[#334155] hover:bg-[#F1F5F2]"
						>
							Mark {task.completed ? "incomplete" : "complete"}
						</button>
						<button
							type="button"
							onClick={() => {
								onToggleMenu();
								setEditing(true);
							}}
							className="w-full rounded-lg px-3 py-2 text-left text-xs text-[#334155] hover:bg-[#F1F5F2]"
						>
							Edit Task
						</button>
						<button
							type="button"
							onClick={() => {
								onToggleMenu();
								setConfirmingDelete(true);
							}}
							className="w-full rounded-lg px-3 py-2 text-left text-xs text-[#B42318] hover:bg-[#FEF3F2]"
						>
							Delete task
						</button>
					</div>
				)}
			</div>
			{editing && (
				<AddTaskDialog
					open
					task={task}
					onClose={() => setEditing(false)}
					onUpdate={onUpdate}
				/>
			)}
			{confirmingDelete && (
				<DeleteTaskConfirmation
					taskTitle={task.title}
					onCancel={() => setConfirmingDelete(false)}
					onConfirm={() => {
						setConfirmingDelete(false);
						onDelete();
					}}
				/>
			)}
		</div>
	);
}
