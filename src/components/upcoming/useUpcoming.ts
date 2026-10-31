import { useEffect, useMemo, useState } from "react";
import { useHomeTasks } from "@/components/shared/useHomeTasks";
import {
	filterUpcomingTasks,
	groupUpcomingTasks,
	isHighPriority,
	type TimelineFilter,
	type UpcomingSummarySelection,
} from "@/components/upcoming/upcomingUtils";
import { formatDateKey, parseLocalDate, startOfDay } from "@/utils/calendarUtils";

export function useUpcoming() {
	const taskState = useHomeTasks("upcoming", null);
	const [todayDateKey, setTodayDateKey] = useState(() => formatDateKey(new Date()));
	const [timelineFilter, setTimelineFilter] = useState<TimelineFilter>("All");
	const [summarySelection, setSummarySelection] = useState<UpcomingSummarySelection | null>("totalScheduled");
	const today = useMemo(() => startOfDay(parseLocalDate(todayDateKey)), [todayDateKey]);
	const todayStart = startOfDay(today);
	useEffect(() => {
		const now = new Date();
		const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
		const timeoutId = window.setTimeout(
			() => setTodayDateKey(formatDateKey(new Date())),
			nextDay.getTime() - now.getTime(),
		);
		return () => window.clearTimeout(timeoutId);
	}, [todayDateKey]);
	const upcomingTasks = useMemo(
		() => taskState.tasks.filter((task) => !task.completed && parseLocalDate(task.date) > todayStart),
		[taskState.tasks, todayStart],
	);
	const timelineTasks = useMemo(
		() => taskState.visibleTasks.filter((task) => !task.completed && parseLocalDate(task.date) > todayStart),
		[taskState.visibleTasks, todayStart],
	);
	const filteredTimelineTasks = useMemo(
		() => filterUpcomingTasks(timelineTasks, timelineFilter, today),
		[timelineTasks, timelineFilter, today],
	);
	const groups = useMemo(
		() => groupUpcomingTasks(filteredTimelineTasks, today),
		[filteredTimelineTasks, today],
	);
	const dueThisWeek = filterUpcomingTasks(timelineTasks, "This Week", today).length;
	const highPriority = timelineTasks.filter(isHighPriority).length;
	const milestone = upcomingTasks.find(isHighPriority) ?? upcomingTasks[0];

	function selectSummarySection(section: UpcomingSummarySelection) {
		setSummarySelection(section);
		setTimelineFilter(
			section === "dueThisWeek"
				? "This Week"
				: section === "highPriority"
					? "High Priority"
					: "All",
		);
	}

	function selectTimelineFilter(nextFilter: TimelineFilter) {
		setTimelineFilter(nextFilter);
		setSummarySelection(
			nextFilter === "This Week"
				? "dueThisWeek"
				: nextFilter === "High Priority"
					? "highPriority"
					: "totalScheduled",
		);
	}

	function toggleTaskMenu(id: string) {
		taskState.setOpenMenuId((openId) => (openId === id ? null : id));
	}

	return {
		search: taskState.search,
		setSearch: taskState.setSearch,
		summarySelection,
		onSummarySelectionChange: selectSummarySection,
		totalScheduled: timelineTasks.length,
		dueThisWeek,
		highPriority,
		timelineProps: {
			groups,
			filter: timelineFilter,
			taskCount: filteredTimelineTasks.length,
			openMenuId: taskState.openMenuId,
			busyTaskIds: taskState.busyTaskIds,
			isLoading: taskState.isLoading,
			onFilterChange: selectTimelineFilter,
			onToggleTask: taskState.toggleTask,
			onToggleMenu: toggleTaskMenu,
			onDeleteTask: taskState.deleteTask,
			onUpdateTask: taskState.updateTask,
		},
		sidebarProps: {
			tasks: upcomingTasks,
			selectedDate: taskState.selectedDate,
			milestone,
			onSelectDate: taskState.setSelectedDate,
			onClearDate: () => taskState.setSelectedDate(null),
			onCompleteMilestone: () => milestone && taskState.toggleTask(milestone.id),
		},
		createTask: taskState.createTask,
	};
}
