import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { DashboardIcon } from "@/components/shared/DashboardIcon";
import type { Category, Task } from "@/components/shared/types";

type Priority = "Low" | "Medium" | "High";

interface AddTaskDialogProps {
	open: boolean;
	onClose: () => void;
	onCreate?: (task: Task) => void;
	task?: Task;
	onUpdate?: (task: Task) => void;
}

function currentDate() {
	const now = new Date();
	return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function toInputTime(time: string) {
	const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
	if (!match) return "09:00";
	let hour = Number(match[1]) % 12;
	if (match[3].toUpperCase() === "PM") hour += 12;
	return `${String(hour).padStart(2, "0")}:${match[2]}`;
}

function formatTaskTime(time: string) {
	const [hour, minute] = time.split(":").map(Number);
	return `${String(hour % 12 || 12).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${hour < 12 ? "AM" : "PM"}`;
}

function taskPriority(task?: Task): Priority {
	if (!task) return "Medium";
	if (task.priority === true) return "High";
	if (task.priority === false) return "Medium";
	return task.priority;
}

export function AddTaskDialog({ open, onClose, onCreate, task, onUpdate }: AddTaskDialogProps) {
	const [title, setTitle] = useState(() => task?.title ?? "");
	const [category, setCategory] = useState<Category>(() => task?.category ?? "Work");
	const [date, setDate] = useState(() => task?.date ?? currentDate());
	const [time, setTime] = useState(() => task ? toInputTime(task.time) : "09:00");
	const [priority, setPriority] = useState<Priority>(() => taskPriority(task));
	const [notes, setNotes] = useState(() => task?.notes ?? "");

	if (!open) return null;

	function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const cleanTitle = title.trim();
		if (!cleanTitle) return;
		const updatedTask: Task = {
			...(task ?? {
			id: `task-${Date.now()}`,
			completed: false,
			}),
			title: cleanTitle,
			category,
			time: formatTaskTime(time),
			date,
			priority,
			notes: notes.trim(),
		};
		if (task) {
			if (!onUpdate) return;
			onUpdate(updatedTask);
		} else {
			if (!onCreate) return;
			onCreate(updatedTask);
		}
		setTitle("");
		setDate(currentDate());
		setTime("09:00");
		setPriority("Medium");
		setNotes("");
		onClose();
	}

	return (
		<div
			className="fixed inset-0 z-30 flex items-center justify-center overflow-y-auto bg-[#0F172A]/35 p-4 backdrop-blur-[2px]"
			onMouseDown={(event) => {
				if (event.target === event.currentTarget) onClose();
			}}
		>
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby="add-task-title"
				className="my-auto w-full max-w-[640px] overflow-hidden rounded-[14px] border border-[#E2E8F0] bg-white shadow-[0_24px_70px_-24px_rgba(15,23,42,0.28)]"
			>
				<div className="flex items-start justify-between border-b border-[#EEF1F4] px-5 py-5 sm:px-7">
					<div>
						<span className="inline-flex items-center gap-1.5 rounded-full bg-[#EDF6EE] px-2.5 py-1 text-[10px] font-bold tracking-[0.12em] text-[#2E7D52]">
							<span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
							{task ? "EDIT TASK" : "NEW TASK"}
						</span>
						<div className="mt-3 flex items-center gap-2">
							<h2 id="add-task-title" className="text-xl font-bold tracking-tight text-[#0F172A] sm:text-[22px]">
								{task ? "Edit Task" : "Add New Task"}
							</h2>
							<span aria-hidden="true" className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#64748B]">
								<DashboardIcon name="calendar" className="h-4 w-4" />
							</span>
						</div>
						<p className="mt-1 text-sm text-[#64748B]">
							{task ? "Update the task details below." : "Create a task and keep your day organized."}
						</p>
					</div>
					<button
						type="button"
						onClick={onClose}
						aria-label="Close dialog"
						className="rounded-lg p-2 text-[#94A3B8] transition hover:bg-[#F1F5F9] hover:text-[#475569]"
					>
						<DashboardIcon name="close" className="h-4 w-4" />
					</button>
				</div>

				<form onSubmit={submit}>
					<div className="space-y-5 px-5 py-5 sm:px-7 sm:py-6">
						<label className="block text-sm font-semibold text-[#334155]">
							Task Title <span className="text-[#2E7D52]">*</span>
							<input
								autoFocus
								required
								value={title}
								onChange={(event) => setTitle(event.target.value)}
								placeholder="e.g., Morning workout, Team meeting..."
								aria-label="Task Title"
								className="mt-2 h-11 w-full rounded-lg border border-[#E2E8F0] bg-white px-3.5 text-sm font-normal text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#2E7D52] focus:ring-2 focus:ring-[#2E7D52]/10"
							/>
						</label>

						<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
							<label className="block text-sm font-semibold text-[#334155]">
								Category
								<select
									value={category}
									onChange={(event) => setCategory(event.target.value as Category)}
									className="mt-2 h-11 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm font-normal text-[#334155] outline-none transition focus:border-[#2E7D52] focus:ring-2 focus:ring-[#2E7D52]/10"
								>
									<option>Work</option>
									<option>Personal</option>
									<option>Health</option>
								</select>
							</label>
							<label className="block text-sm font-semibold text-[#334155]">
								Due Date
								<input
									type="date"
									required
									value={date}
									onChange={(event) => setDate(event.target.value)}
									className="mt-2 h-11 w-full min-w-0 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm font-normal text-[#334155] outline-none transition focus:border-[#2E7D52] focus:ring-2 focus:ring-[#2E7D52]/10"
								/>
							</label>
							<label className="block text-sm font-semibold text-[#334155]">
								Time
								<input
									type="time"
									required
									value={time}
									onChange={(event) => setTime(event.target.value)}
									className="mt-2 h-11 w-full min-w-0 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm font-normal text-[#334155] outline-none transition focus:border-[#2E7D52] focus:ring-2 focus:ring-[#2E7D52]/10"
								/>
							</label>
						</div>

						<fieldset>
							<legend className="text-sm font-semibold text-[#334155]">Priority</legend>
							<div className="mt-2 flex flex-wrap gap-2">
								{(["Low", "Medium", "High"] as const).map((level) => {
									const selected = priority === level;
									const indicator = level === "Low"
										? "bg-[#22C55E]"
										: level === "Medium"
											? "bg-[#E8A23A]"
											: "bg-[#E47763]";
									return (
										<button
											key={level}
											type="button"
											onClick={() => setPriority(level)}
											aria-pressed={selected}
											className={`inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-xs font-medium transition ${
												selected
													? "border-[#B8D9C1] bg-[#EDF6EE] text-[#2E7D52]"
													: "border-[#E2E8F0] bg-white text-[#64748B] hover:bg-[#F8FAFC]"
											}`}
										>
											<span className={`h-2 w-2 rounded-full ${indicator}`} />
											{level}
										</button>
									);
								})}
							</div>
						</fieldset>

						<label className="block text-sm font-semibold text-[#334155]">
							Notes <span className="font-normal text-[#94A3B8]">(Optional)</span>
							<textarea
								value={notes}
								onChange={(event) => setNotes(event.target.value.slice(0, 500))}
								maxLength={500}
								rows={3}
								placeholder="Add additional notes..."
								className="mt-2 w-full resize-y rounded-lg border border-[#E2E8F0] bg-white px-3.5 py-3 text-sm font-normal text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#2E7D52] focus:ring-2 focus:ring-[#2E7D52]/10"
							/>
							<span className="mt-1 block text-right text-xs font-normal text-[#94A3B8]">
								{notes.length} / 500
							</span>
						</label>
					</div>

					<div className="flex flex-col-reverse gap-3 border-t border-[#EEF1F4] bg-[#FCFDFC] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
						<p className="text-xs text-[#94A3B8]">You can update task details anytime.</p>
						<div className="flex justify-end gap-2">
							<Button
								variant="secondary"
								onClick={onClose}
								className="rounded-lg border-[#E2E8F0] bg-white px-4 py-2 text-[#475569] hover:bg-[#F8FAFC]"
							>
								Cancel
							</Button>
							<Button
								type="submit"
								className="rounded-lg bg-[#2E7D52] px-4 py-2 text-white hover:bg-[#246742]"
							>
								{task ? "Save Changes" : "Add Task"}
							</Button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
