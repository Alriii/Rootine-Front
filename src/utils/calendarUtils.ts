export function formatDate(dateString: string) {
	const [year, month, day] = dateString.split("-").map(Number);
	return new Date(year, month - 1, day).toLocaleDateString("en-US", {
		month: "short",
		day: "2-digit",
		year: "numeric",
	});
}

export function formatDateKey(date: Date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

export function getCompletionDate(task: { date: string; completedAt?: string }) {
	if (!task.completedAt) return task.date;
	const completed = new Date(task.completedAt);
	const year = completed.getFullYear();
	const month = String(completed.getMonth() + 1).padStart(2, "0");
	const day = String(completed.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

export function getMonthLabel(year: number, month: number) {
	return new Date(year, month, 1).toLocaleDateString("en-US", {
		month: "long",
		year: "numeric",
	});
}

export function getCalendarDays(year: number, month: number): Array<number | null> {
	const firstDay = new Date(year, month, 1).getDay();
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const cellCount = Math.ceil((firstDay + daysInMonth) / 7) * 7;

	return Array.from({ length: cellCount }, (_, index) => {
		const day = index - firstDay + 1;
		return day > 0 && day <= daysInMonth ? day : null;
	});
}

export function parseLocalDate(dateString: string) {
	const [year, month, day] = dateString.split("-").map(Number);
	return new Date(year, month - 1, day);
}

export function startOfDay(date: Date) {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getWeekStart(date: Date) {
	const day = startOfDay(date);
	const daysSinceMonday = (day.getDay() + 6) % 7;
	day.setDate(day.getDate() - daysSinceMonday);
	return day;
}

export function getTimelineGroupLabel(dateString: string, today: Date) {
	const date = parseLocalDate(dateString);
	const todayStart = startOfDay(today);
	if (date.getTime() === todayStart.getTime()) return "Today";
	const tomorrow = new Date(todayStart);
	tomorrow.setDate(tomorrow.getDate() + 1);
	if (date.getTime() === tomorrow.getTime()) return "Tomorrow";

	const startOfThisWeek = getWeekStart(today);
	const startOfNextWeek = new Date(startOfThisWeek);
	startOfNextWeek.setDate(startOfNextWeek.getDate() + 7);
	const startOfFollowingWeek = new Date(startOfNextWeek);
	startOfFollowingWeek.setDate(startOfFollowingWeek.getDate() + 7);

	if (date < startOfNextWeek) return "Later This Week";
	if (date < startOfFollowingWeek) return "Next Week";
	return formatDate(dateString);
}
