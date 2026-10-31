import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { DashboardIcon } from "@/components/shared/DashboardIcon";
import { Spinner } from "@/components/ui/spinner";
import type { Category, Task, TaskFrequency } from "@/components/shared/types";
import {
	formatDate,
	formatDateKey,
	getCalendarDays,
	getMonthLabel,
	parseLocalDate,
} from "@/utils/calendarUtils";

type Priority = "Low" | "Medium" | "High";

interface AddTaskDialogProps {
	open: boolean;
	onClose: () => void;
	onCreate?: (task: Task) => Promise<void> | void;
	task?: Task;
	onUpdate?: (task: Task) => Promise<void> | void;
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

	// Routine Frequency & Reminder options (Backend integration)
	const [frequency, setFrequency] = useState<TaskFrequency>(() => task?.frequency ?? "DAILY");
	const [reminderEnabled, setReminderEnabled] = useState(() => task?.reminderEnabled ?? false);
	const [reminderTime, setReminderTime] = useState(() => task?.reminderTime ?? "08:30");
	const [reminderIntervalHours, setReminderIntervalHours] = useState(() => {
		if (task?.maxDailyReminders === 1) return 0;
		return task?.reminderIntervalHours ?? 0;
	});

	// Calendar state for direct number clicking
	const [shownMonth, setShownMonth] = useState(() => {
		const initial = task?.date ? parseLocalDate(task.date) : new Date();
		return { year: initial.getFullYear(), month: initial.getMonth() };
	});

	// Loading / error state
	const [isSaving, setIsSaving] = useState(false);
	const [saveError, setSaveError] = useState("");
	const [saved, setSaved] = useState(false);

	if (!open) return null;

	const calendarDays = getCalendarDays(shownMonth.year, shownMonth.month);
	const todayDateKey = formatDateKey(new Date());

	function changeMonth(offset: number) {
		const nextMonth = new Date(shownMonth.year, shownMonth.month + offset, 1);
		setShownMonth({ year: nextMonth.getFullYear(), month: nextMonth.getMonth() });
	}

	function selectDay(day: number) {
		const dateStr = `${shownMonth.year}-${String(shownMonth.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
		setDate(dateStr);
	}

	function selectToday() {
		const n = new Date();
		const dateStr = formatDateKey(n);
		setDate(dateStr);
		setShownMonth({ year: n.getFullYear(), month: n.getMonth() });
	}

	function selectTomorrow() {
		const t = new Date();
		t.setDate(t.getDate() + 1);
		const dateStr = formatDateKey(t);
		setDate(dateStr);
		setShownMonth({ year: t.getFullYear(), month: t.getMonth() });
	}

	async function submit(event: FormEvent<HTMLFormElement>) {
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
			frequency,
			reminderEnabled,
			reminderTime: reminderEnabled ? reminderTime : null,
			reminderIntervalHours: reminderEnabled ? (reminderIntervalHours === 0 ? 1 : reminderIntervalHours) : 1,
			maxDailyReminders: reminderEnabled ? (reminderIntervalHours === 0 ? 1 : reminderIntervalHours <= 1 ? 4 : reminderIntervalHours <= 3 ? 3 : 2) : 1,
		};

		setIsSaving(true);
		setSaveError("");

		try {
			if (task) {
				if (!onUpdate) return;
				await onUpdate(updatedTask);
			} else {
				if (!onCreate) return;
				await onCreate(updatedTask);
			}

			setSaved(true);
			setTimeout(() => {
				setTitle("");
				setDate(currentDate());
				setTime("09:00");
				setPriority("Medium");
				setNotes("");
				setReminderEnabled(false);
				setReminderIntervalHours(0);
				setSaved(false);
				onClose();
			}, 600);
		} catch (err) {
			setSaveError(err instanceof Error ? err.message : "Failed to save task. Please try again.");
		} finally {
			setIsSaving(false);
		}
	}

	return (
		<div
			className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-[#0d1f18]/45 p-4 backdrop-blur-[3px]"
			onMouseDown={(event) => {
				if (!isSaving && event.target === event.currentTarget) onClose();
			}}
		>
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby="add-task-title"
				className="my-auto w-full max-w-[620px] max-h-[92vh] overflow-y-auto rounded-2xl border border-[#d8e8df] bg-white shadow-[0_24px_64px_-16px_rgba(13,31,24,0.28)]"
			>
				{/* Top Accent Stripe */}
				<div className="h-1.5 w-full bg-gradient-to-r from-[#1e7a4a] via-[#34d399] to-[#15803d]" />

				{/* Header */}
				<div className="flex items-start justify-between border-b border-[#d8e8df] px-6 py-4 sm:py-5">
					<div>
						<span className="inline-flex items-center rounded-lg bg-[#e8f5ee] px-2.5 py-1 text-[11px] font-bold tracking-wider text-[#1a6b40]">
							{isSaving ? "SAVING..." : saved ? "SAVED!" : task ? "EDIT ROUTINE" : "NEW ROUTINE"}
						</span>
						<h2 id="add-task-title" className="mt-1.5 text-xl font-bold tracking-tight text-[#0d1f18]">
							{task ? "Edit Task" : "Create Routine Task"}
						</h2>
						<p className="mt-0.5 text-xs text-[#4d6658]">
							{task ? "Update routine details and schedule." : "Schedule tasks easily and build your daily routine."}
						</p>
					</div>
					<button
						type="button"
						onClick={onClose}
						disabled={isSaving}
						aria-label="Close dialog"
						className="rounded-lg p-1.5 text-[#8aab97] transition hover:bg-[#e8f5ee] hover:text-[#1a6b40] disabled:opacity-40"
					>
						<DashboardIcon name="close" className="h-4 w-4" />
					</button>
				</div>

				<form onSubmit={submit}>
					<div className="space-y-4 px-6 py-5">
						{/* Title */}
						<label className="block text-xs font-semibold uppercase tracking-wider text-[#4d6658]">
							Task Title <span className="text-[#1e7a4a]">*</span>
							<input
								autoFocus
								required
								disabled={isSaving}
								value={title}
								onChange={(event) => setTitle(event.target.value)}
								placeholder="e.g., Morning workout, Team sync..."
								aria-label="Task Title"
								className="mt-1.5 h-10 w-full rounded-xl border border-[#d8e8df] bg-white px-3.5 text-sm font-medium text-[#0d1f18] outline-none transition placeholder:text-[#8aab97] focus:border-[#1e7a4a] focus:ring-2 focus:ring-[#1e7a4a]/10 disabled:opacity-60"
							/>
						</label>

						{/* 2 columns: Category & Time */}
						<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
							<label className="block text-xs font-semibold uppercase tracking-wider text-[#4d6658]">
								Category
								<select
									value={category}
									disabled={isSaving}
									onChange={(event) => setCategory(event.target.value as Category)}
									className="mt-1.5 h-10 w-full rounded-xl border border-[#d8e8df] bg-white px-3 text-sm font-medium text-[#0d1f18] outline-none transition focus:border-[#1e7a4a] focus:ring-2 focus:ring-[#1e7a4a]/10 disabled:opacity-60"
								>
									<option>Work</option>
									<option>Personal</option>
									<option>Health</option>
								</select>
							</label>

							<label className="block text-xs font-semibold uppercase tracking-wider text-[#4d6658]">
								Target Time
								<input
									type="time"
									required
									disabled={isSaving}
									value={time}
									onChange={(event) => setTime(event.target.value)}
									className="mt-1.5 h-10 w-full min-w-0 rounded-xl border border-[#d8e8df] bg-white px-3 text-sm font-medium text-[#0d1f18] outline-none transition focus:border-[#1e7a4a] focus:ring-2 focus:ring-[#1e7a4a]/10 disabled:opacity-60"
								/>
							</label>
						</div>

						{/* Interactive Calendar Date Picker (Click a number directly!) */}
						<div className="rounded-xl border border-[#d8e8df] bg-[#fbfdfc] p-3.5">
							<div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e8ede9] pb-2.5">
								<div>
									<span className="block text-xs font-bold uppercase tracking-wider text-[#4d6658]">
										Due Date: <span className="font-extrabold normal-case text-[#0d1f18]">{formatDate(date)}</span>
									</span>
									<span className="text-[11px] text-[#8aab97]">Click any number in the calendar to pick a date</span>
								</div>

								<div className="flex items-center gap-1.5">
									<button
										type="button"
										onClick={selectToday}
										className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
											date === todayDateKey
												? "bg-[#1e7a4a] text-white shadow-2xs"
												: "border border-[#d8e8df] bg-white text-[#4d6658] hover:bg-[#e8f5ee] hover:text-[#1a6b40]"
										}`}
									>
										Today
									</button>
									<button
										type="button"
										onClick={selectTomorrow}
										className="rounded-lg border border-[#d8e8df] bg-white px-2.5 py-1 text-xs font-semibold text-[#4d6658] transition hover:bg-[#e8f5ee] hover:text-[#1a6b40]"
									>
										Tomorrow
									</button>
									<div className="ml-1 flex items-center gap-0.5">
										<button
											type="button"
											onClick={() => changeMonth(-1)}
											aria-label="Previous month"
											className="rounded-lg p-1 text-[#4d6658] transition hover:bg-[#e8f5ee] hover:text-[#1a6b40]"
										>
											<DashboardIcon name="chevron-left" className="h-3.5 w-3.5" />
										</button>
										<span className="min-w-[84px] text-center text-xs font-bold text-[#0d1f18]">
											{getMonthLabel(shownMonth.year, shownMonth.month)}
										</span>
										<button
											type="button"
											onClick={() => changeMonth(1)}
											aria-label="Next month"
											className="rounded-lg p-1 text-[#4d6658] transition hover:bg-[#e8f5ee] hover:text-[#1a6b40]"
										>
											<DashboardIcon name="chevron-right" className="h-3.5 w-3.5" />
										</button>
									</div>
								</div>
							</div>

							{/* Numbers Grid */}
							<div className="mt-2.5 grid grid-cols-7 text-center">
								{["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((weekday) => (
									<span key={weekday} className="py-1 text-[10px] font-bold uppercase tracking-wider text-[#8aab97]">
										{weekday}
									</span>
								))}

								{calendarDays.map((day, index) => {
									if (day === null) return <span key={`empty-${index}`} className="h-8" />;
									const currentLoopDate = `${shownMonth.year}-${String(shownMonth.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
									const isSelected = date === currentLoopDate;
									const isToday = currentLoopDate === todayDateKey;

									return (
										<button
											key={currentLoopDate}
											type="button"
											disabled={isSaving}
											onClick={() => selectDay(day)}
											className={`relative mx-auto my-0.5 flex h-7 w-7 items-center justify-center rounded-lg text-xs font-semibold transition-all ${
												isSelected
													? "scale-105 bg-[#1e7a4a] font-extrabold text-white shadow-xs"
													: isToday
														? "border border-[#b8d9c6] bg-[#e8f5ee] font-bold text-[#1a6b40]"
														: "text-[#0d1f18] hover:bg-[#e8f5ee] hover:text-[#1a6b40]"
											} disabled:opacity-50`}
										>
											{day}
										</button>
									);
								})}
							</div>
						</div>

						{/* Frequency & Priority */}
						<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
							<label className="block text-xs font-semibold uppercase tracking-wider text-[#4d6658]">
								Habit Frequency
								<select
									value={frequency}
									disabled={isSaving}
									onChange={(e) => setFrequency(e.target.value as TaskFrequency)}
									className="mt-1.5 h-10 w-full rounded-xl border border-[#d8e8df] bg-white px-3 text-sm font-medium text-[#0d1f18] outline-none transition focus:border-[#1e7a4a] focus:ring-2 focus:ring-[#1e7a4a]/10 disabled:opacity-60"
								>
									<option value="DAILY">Daily Routine</option>
									<option value="SPECIFIC_DAYS">Specific Days of Week</option>
									<option value="TIMES_PER_WEEK">3 Times Per Week</option>
								</select>
							</label>

							<fieldset>
								<legend className="text-xs font-semibold uppercase tracking-wider text-[#4d6658]">Priority</legend>
								<div className="mt-1.5 flex gap-1.5">
									{(["Low", "Medium", "High"] as const).map((level) => {
										const selected = priority === level;
										const activeStyles =
											level === "Low"
												? "border-[#a7f3d0] bg-[#e8f5ee] text-[#1a6b40] font-bold"
												: level === "Medium"
													? "border-[#fde68a] bg-[#fffbeb] text-[#92400e] font-bold"
													: "border-[#fecaca] bg-[#fef2f2] text-[#991b1b] font-bold";
										return (
											<button
												key={level}
												type="button"
												disabled={isSaving}
												onClick={() => setPriority(level)}
												aria-pressed={selected}
												className={`flex-1 h-10 rounded-xl border text-xs font-medium transition ${
													selected
														? activeStyles
														: "border-[#d8e8df] bg-white text-[#4d6658] hover:bg-[#f4f8f5]"
												} disabled:opacity-60`}
											>
												{level}
											</button>
										);
									})}
								</div>
							</fieldset>
						</div>

						{/* Email Reminder Box */}
						<div className="rounded-xl border border-[#d8e8df] bg-[#f8fbf9] p-3.5">
							<label className="flex cursor-pointer items-center justify-between">
								<div>
									<span className="block text-xs font-bold text-[#0d1f18]">
										📧 Email Reminder
									</span>
									<span className="text-[11px] text-[#4d6658]">
										Receive email reminders to stay consistent with this routine.
									</span>
								</div>
								<input
									type="checkbox"
									checked={reminderEnabled}
									disabled={isSaving}
									onChange={(e) => setReminderEnabled(e.target.checked)}
									className="h-4 w-4 rounded accent-[#1e7a4a] cursor-pointer"
								/>
							</label>

							{reminderEnabled && (
								<div className="mt-3 grid gap-3 border-t border-[#d8e8df] pt-3 sm:grid-cols-2">
									<div>
										<label className="block text-[11px] font-semibold text-[#4d6658]">
											Start Time
										</label>
										<input
											type="time"
											disabled={isSaving}
											value={reminderTime}
											onChange={(e) => setReminderTime(e.target.value)}
											className="mt-1 h-9 w-full rounded-lg border border-[#d8e8df] bg-white px-2.5 text-xs text-[#0d1f18] outline-none focus:border-[#1e7a4a] disabled:opacity-60"
										/>
									</div>
									<div>
										<label className="block text-[11px] font-semibold text-[#4d6658]">
											Reminder Interval
										</label>
										<select
											disabled={isSaving}
											value={reminderIntervalHours}
											onChange={(e) => setReminderIntervalHours(Number(e.target.value))}
											className="mt-1 h-9 w-full rounded-lg border border-[#d8e8df] bg-white px-2.5 text-xs text-[#0d1f18] outline-none focus:border-[#1e7a4a] disabled:opacity-60"
										>
											<option value={0}>Once a day (at scheduled time)</option>
											<option value={1}>Every 1 hour (until completed)</option>
											<option value={2}>Every 2 hours (until completed)</option>
											<option value={3}>Every 3 hours (until completed)</option>
											<option value={4}>Every 4 hours (until completed)</option>
											<option value={6}>Every 6 hours (until completed)</option>
											<option value={12}>Every 12 hours (until completed)</option>
										</select>
									</div>
								</div>
							)}
						</div>

						{/* Notes */}
						<label className="block text-xs font-semibold uppercase tracking-wider text-[#4d6658]">
							Notes <span className="font-normal text-[#8aab97]">(Optional)</span>
							<textarea
								value={notes}
								disabled={isSaving}
								onChange={(event) => setNotes(event.target.value.slice(0, 500))}
								maxLength={500}
								rows={2}
								placeholder="Add extra routine context or goals..."
								className="mt-1.5 w-full resize-none rounded-xl border border-[#d8e8df] bg-white px-3.5 py-2.5 text-sm font-medium text-[#0d1f18] outline-none transition placeholder:text-[#8aab97] focus:border-[#1e7a4a] focus:ring-2 focus:ring-[#1e7a4a]/10 disabled:opacity-60"
							/>
						</label>
					</div>

					{/* Error Banner */}
					{saveError && (
						<div className="mx-6 mb-3 flex items-center gap-2 rounded-xl border border-[#fca5a5] bg-[#fef2f2] px-3.5 py-2.5 text-xs font-medium text-[#b91c1c]">
							<svg className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
								<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
							</svg>
							{saveError}
						</div>
					)}

					{/* Footer */}
					<div className="flex items-center justify-between border-t border-[#d8e8df] bg-[#f8fbf9] px-6 py-4">
						<span className="text-[11px] text-[#8aab97]">Changes apply to your routine instantly.</span>
						<div className="flex gap-2">
							<Button
								variant="secondary"
								type="button"
								disabled={isSaving}
								onClick={onClose}
								className="rounded-xl border-[#d8e8df] bg-white px-4 py-2 text-xs font-semibold text-[#4d6658] hover:bg-[#f4f8f5]"
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={isSaving || saved}
								className="min-w-[110px] rounded-xl bg-gradient-to-r from-[#1e7a4a] to-[#15803d] px-4 py-2 text-xs font-bold text-white shadow-sm hover:from-[#196640] hover:to-[#126835] disabled:opacity-80 flex items-center justify-center gap-1.5"
							>
								{isSaving ? (
									<>
										<Spinner className="h-3.5 w-3.5 text-white" />
										<span>{task ? "Saving..." : "Creating..."}</span>
									</>
								) : saved ? (
									"Saved ✓"
								) : task ? (
									"Save Changes"
								) : (
									"Create Task"
								)}
							</Button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
