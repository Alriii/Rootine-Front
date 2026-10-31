import type { Task } from "@/components/shared/types";
import { formatDate, getCompletionDate } from "@/utils/calendarUtils";

export function getCompletedTime(task: Task) {
	if (!task.completedAt) return `${formatDate(task.date)} · ${task.time}`;
	const completedAt = new Date(task.completedAt);
	return `${formatDate(getCompletionDate(task))} · ${completedAt.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
	})}`;
}
