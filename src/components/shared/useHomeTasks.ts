/**
 * useHomeTasks — thin compatibility shim.
 * All task state now lives in TaskContext (TaskProvider).
 * This hook delegates to usePageTasks so existing page hooks
 * (useDashboard, useUpcoming, useCompleted) continue to work unchanged.
 */
import type { TaskView } from "@/components/shared/types";
import { usePageTasks } from "@/components/shared/TaskContext";
import { formatDateKey } from "@/utils/calendarUtils";

export function useHomeTasks(
	taskView: TaskView = "all",
	initialSelectedDate: string | null = formatDateKey(new Date()),
) {
	return usePageTasks(taskView, initialSelectedDate);
}
