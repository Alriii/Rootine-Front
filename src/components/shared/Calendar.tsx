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
		<Card className="rounded-2xl border-[#E2E8F0] bg-white p-5 shadow-none sm:p-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2.5">
					<span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EDF6EE] text-[#2E7D52]">
						<DashboardIcon name="calendar" className="h-[18px] w-[18px]" />
					</span>
					<h2 className="text-base font-semibold text-[#0F172A]">Calendar</h2>
				</div>
				<div className="flex items-center gap-1">
					<button
						type="button"
						onClick={() => changeMonth(-1)}
						aria-label="Previous month"
						className="rounded-lg p-2 text-[#64748B] transition hover:bg-[#F1F5F2] hover:text-[#2E7D52]"
					>
						<DashboardIcon name="chevron-left" className="h-4 w-4" />
					</button>
					<button
						type="button"
						onClick={() => changeMonth(1)}
						aria-label="Next month"
						className="rounded-lg p-2 text-[#64748B] transition hover:bg-[#F1F5F2] hover:text-[#2E7D52]"
					>
						<DashboardIcon name="chevron-right" className="h-4 w-4" />
					</button>
				</div>
			</div>

			<p className="mt-4 text-sm font-semibold text-[#334155]">
				{getMonthLabel(shownMonth.year, shownMonth.month)}
			</p>
			<div className="mt-3 grid grid-cols-7 text-center">
				{["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((weekday) => (
					<span key={weekday} className="py-2 text-[11px] font-medium uppercase tracking-wide text-[#94A3B8]">
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
							className={`relative mx-auto flex h-9 w-9 items-center justify-center rounded-full text-xs transition ${
								isSelected
									? "bg-[#2E7D52] font-semibold text-white"
									: "text-[#334155] hover:bg-[#EDF6EE]"
							}`}
						>
							{day}
							{hasTasks && !isSelected && (
								<span className="absolute bottom-1 h-1 w-1 rounded-full bg-[#22C55E]" />
							)}
						</button>
					);
				})}
			</div>
			<div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#EEF1F4] pt-4 text-xs">
				<span className="inline-flex items-center gap-2 text-[#64748B]">
					<span className="h-2 w-2 rounded-full bg-[#22C55E]" />
					Has Schedule Tasks
				</span>
				<button
					type="button"
					onClick={onClearDate}
					className="font-medium text-[#2E7D52] transition hover:text-[#15803D]"
				>
					Clear Filter
				</button>
			</div>
		</Card>
	);
}
