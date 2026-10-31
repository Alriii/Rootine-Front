import { useMemo } from "react";
import { useHomeTasks } from "@/components/shared/useHomeTasks";
import type { Category } from "@/components/shared/types";

export function useCompleted() {
	const taskState = useHomeTasks("completed", null);
	const completedTasks = useMemo(
		() => taskState.tasks.filter((task) => task.completed),
		[taskState.tasks],
	);

	function clearFilters() {
		taskState.setSelectedDate(null);
		taskState.setCategoryFilter("All");
	}

	function toggleTaskMenu(id: string) {
		taskState.setOpenMenuId((openId) => (openId === id ? null : id));
	}

	const archiveProps = {
		tasks: taskState.visibleTasks,
		totalCompleted: completedTasks.length,
		selectedDate: taskState.selectedDate,
		categoryFilter: taskState.categoryFilter as "All" | Category,
		openMenuId: taskState.openMenuId,
		busyTaskIds: taskState.busyTaskIds,
		isLoading: taskState.isLoading,
		onCategoryChange: taskState.setCategoryFilter,
		onToggleTask: taskState.toggleTask,
		onToggleMenu: toggleTaskMenu,
		onDeleteTask: taskState.deleteTask,
		onUpdateTask: taskState.updateTask,
		onClearFilters: clearFilters,
	};
	const sidebarProps = {
		completedTasks,
		selectedDate: taskState.selectedDate,
		milestone: taskState.milestone,
		onSelectDate: taskState.setSelectedDate,
		onClearDate: () => taskState.setSelectedDate(null),
		onCompleteMilestone: () => taskState.milestone && taskState.toggleTask(taskState.milestone.id),
	};

	return {
		completedTasks,
		archiveProps,
		sidebarProps,
		search: taskState.search,
		setSearch: taskState.setSearch,
		createTask: taskState.createTask,
	};
}
