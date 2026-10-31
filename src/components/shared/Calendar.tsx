import { useState } from "react";
import { Card } from "@/components/ui/card";
import { DashboardIcon } from "@/components/shared/DashboardIcon";
import { formatDate, getCalendarDays, getMonthLabel } from "@/utils/calendarUtils";
import type { Task } from "@/components/shared/types";

interface CalendarProps {
	tasks: Task[];
	selectedDate: string | null;
	onSelectDate: (date: string) => void;
	onClearDate: () => void;
	getTaskDate?: (task: Task) => string;
}

export function Calendar({
	tasks,
	selectedDate,
	onSelectDate,
	onClearDate,
	getTaskDate = (task) => task.date,
}: CalendarProps) {
	const [shownMonth, setShownMonth] = useState(() => {
		const now = new Date();
		return { year: now.getFullYear(), month: now.getMonth() };
	});

	const calendarDays = getCalendarDays(shownMonth.year, shownMonth.month);
	const scheduledDates = new Set(tasks.map(getTaskDate));

	function changeMonth(offset: number) {
		const nextMonth = new Date(shownMonth.year, shownMonth.month + offset, 1);
		setShownMonth({ year: nextMonth.getFullYear(), month: nextMonth.getMonth() });
	}

	return (
		<Card className="rounded-2xl border border-[#e4ece6] bg-white p-5 shadow-xs sm:p-5.5">
			{/* Header: < > [calendar icon] Month Year */}
			<div className="flex items-center gap-3">
				<div className="flex items-center gap-1">
					<button
						type="button"
						onClick={() => changeMonth(-1)}
						aria-label="Previous month"
						className="flex h-7 w-7 items-center justify-center rounded-lg text-[#5a7365] transition hover:bg-[#ebf4ed] hover:text-[#194d33]"
					>
						<DashboardIcon name="chevron-left" className="h-4 w-4" />
					</button>
					<button
						type="button"
						onClick={() => changeMonth(1)}
						aria-label="Next month"
						className="flex h-7 w-7 items-center justify-center rounded-lg text-[#5a7365] transition hover:bg-[#ebf4ed] hover:text-[#194d33]"
					>
						<DashboardIcon name="chevron-right" className="h-4 w-4" />
					</button>
				</div>

				<div className="flex items-center gap-2">
					<DashboardIcon name="calendar" className="h-4 w-4 text-[#194d33]" />
					<h2 className="text-sm font-bold text-[#173826]">
						{getMonthLabel(shownMonth.year, shownMonth.month)}
					</h2>
				</div>
			</div>

			{/* Day names */}
			<div className="mt-4 grid grid-cols-7 text-center">
				{["SU", "MO", "TU", "WE", "TH", "FR", "SA"].map((weekday) => (
					<span key={weekday} className="py-1 text-[11px] font-medium tracking-wide text-[#70897b]">
						{weekday}
					</span>
				))}

				{calendarDays.map((day, index) => {
					if (day === null) return <span key={`empty-${index}`} className="h-9" />;
					const date = `${shownMonth.year}-${String(shownMonth.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
					const isSelected = selectedDate === date;
					const hasTasks = scheduledDates.has(date);

					return (
						<button
							key={date}
							type="button"
							onClick={() => onSelectDate(date)}
							aria-label={`Select ${formatDate(date)}`}
							aria-pressed={isSelected}
							className={`relative mx-auto my-0.5 flex h-8 w-8 flex-col items-center justify-center rounded-full text-xs font-medium transition-all ${
								isSelected
									? "bg-[#194d33] font-bold text-white shadow-xs"
									: "text-[#173826] hover:bg-[#ebf4ed]"
							}`}
						>
							<span>{day}</span>
							{hasTasks && !isSelected && (
								<span className="absolute bottom-1 h-1 w-1 rounded-full bg-[#194d33]" />
							)}
						</button>
					);
				})}
			</div>

			{/* Footer: dot + Scheduled days */}
			<div className="mt-4 flex items-center justify-between border-t border-[#e8ede9] pt-3 text-xs">
				<span className="inline-flex items-center gap-2 font-medium text-[#5a7365]">
					<span className="h-1.5 w-1.5 rounded-full bg-[#194d33]" />
					Scheduled days
				</span>
				{selectedDate && (
					<button
						type="button"
						onClick={onClearDate}
						className="font-semibold text-[#194d33] transition hover:underline"
					>
						Clear filter
					</button>
				)}
			</div>
		</Card>
	);
}
