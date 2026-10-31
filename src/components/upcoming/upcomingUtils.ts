import type { Task } from "@/components/shared/types";
import { getTimelineGroupLabel, getWeekStart, parseLocalDate, startOfDay } from "@/utils/calendarUtils";

export type TimelineFilter = "All" | "This Week" | "Next Week" | "High Priority";
export type UpcomingSummarySelection = "totalScheduled" | "dueThisWeek" | "highPriority";

export function isHighPriority(task: Task) {
	return task.priority === true || task.priority === "High";
}

function getTaskTimeValue(time: string) {
	const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(time);
	if (!match) return 0;
	const hour = Number(match[1]) % 12 + (match[3].toUpperCase() === "PM" ? 12 : 0);
	return hour * 60 + Number(match[2]);
}

export function filterUpcomingTasks(tasks: Task[], filter: TimelineFilter, today: Date) {
	const todayStart = startOfDay(today);
	const nextWeekStart = getWeekStart(today);
	nextWeekStart.setDate(nextWeekStart.getDate() + 7);
	const followingWeekStart = new Date(nextWeekStart);
	followingWeekStart.setDate(followingWeekStart.getDate() + 7);
	const thisWeekEnd = new Date(nextWeekStart);
	thisWeekEnd.setDate(thisWeekEnd.getDate() - 1);
	const nextWeekEnd = new Date(followingWeekStart);
	nextWeekEnd.setDate(nextWeekEnd.getDate() - 1);

	return tasks.filter((task) => {
		const date = parseLocalDate(task.date);
		switch (filter) {
			case "This Week":
				return date >= todayStart && date <= thisWeekEnd;
			case "Next Week":
				return date >= nextWeekStart && date <= nextWeekEnd;
			case "High Priority":
				return isHighPriority(task);
			default:
				return true;
		}
	}).sort((first, second) => {
		const dateDifference = parseLocalDate(first.date).getTime() - parseLocalDate(second.date).getTime();
		return dateDifference || getTaskTimeValue(first.time) - getTaskTimeValue(second.time);
	});
}

export function groupUpcomingTasks(tasks: Task[], today: Date) {
	const groups = new Map<string, Task[]>();
	for (const task of tasks) {
		const label = getTimelineGroupLabel(task.date, today);
		const group = groups.get(label) ?? [];
		group.push(task);
		groups.set(label, group);
	}
	return [...groups.entries()];
}
