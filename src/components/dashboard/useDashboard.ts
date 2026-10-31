import { useEffect, useState } from "react";
import { useHomeTasks } from "@/components/shared/useHomeTasks";
import type { TaskView } from "@/components/shared/types";
import { formatDateKey } from "@/utils/calendarUtils";

export function useDashboard(taskView: TaskView = "all") {
	const taskState = useHomeTasks(taskView);
	const [todayDateKey, setTodayDateKey] = useState(() => formatDateKey(new Date()));
	useEffect(() => {
		const now = new Date();
		const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
		const timeoutId = window.setTimeout(
			() => setTodayDateKey(formatDateKey(new Date())),
			nextDay.getTime() - now.getTime(),
		);
		return () => window.clearTimeout(timeoutId);
	}, [todayDateKey]);
	const pageHeading = taskView === "upcoming"
		? "Upcoming Tasks"
		: taskView === "completed"
			? "Completed Tasks"
			: "Today's Task Command";

	function toggleTaskMenu(id: string) {
		taskState.setOpenMenuId((openId) => openId === id ? null : id);
	}

	return {
		tasks: taskState.tasks,
		todayDateKey,
		pageHeading,
		search: taskState.search,
		setSearch: taskState.setSearch,
		createTask: taskState.createTask,
		scheduleProps: {
			tasks: taskState.visibleTasks,
			totalTasks: taskState.tasks.length,
			selectedDate: taskState.selectedDate,
			categoryFilter: taskState.categoryFilter,
			openMenuId: taskState.openMenuId,
			busyTaskIds: taskState.busyTaskIds,
			isLoading: taskState.isLoading,
			onCategoryChange: taskState.setCategoryFilter,
			onToggleTask: taskState.toggleTask,
			onToggleMenu: toggleTaskMenu,
			onDeleteTask: taskState.deleteTask,
			onUpdateTask: taskState.updateTask,
			onClearDate: () => taskState.setSelectedDate(null),
		},
		calendarProps: {
			tasks: taskState.tasks,
			selectedDate: taskState.selectedDate,
			onSelectDate: taskState.setSelectedDate,
			onClearDate: () => taskState.setSelectedDate(null),
		},
		milestone: taskState.milestone,
		onCompleteMilestone: () => taskState.milestone && taskState.toggleTask(taskState.milestone.id),
	};
}
