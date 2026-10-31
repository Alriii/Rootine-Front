import { AddTaskDialog, Calendar, DashboardHeader, PriorityMilestone } from "@/components/shared";
import { CompletedToday, PendingActions, StatisticsCards, TodaysTasks, useDashboard } from "@/components/dashboard";
import type { TaskView } from "@/components/shared/types";
import type { DashboardSection } from "@/components/dashboard";
import { useState } from "react";

export default function HomePage({
	taskView = "all",
	isAddTaskOpen = false,
	onCloseAddTask = () => {},
	activeSection,
	onSectionChange,
}: {
	taskView?: TaskView;
	isAddTaskOpen?: boolean;
	onCloseAddTask?: () => void;
	activeSection: DashboardSection;
	onSectionChange: (section: DashboardSection) => void;
}) {
	const page = useDashboard(taskView);
	const [internalAddOpen, setInternalAddOpen] = useState(false);

	const isModalOpen = isAddTaskOpen || internalAddOpen;
	const closeModal = () => {
		onCloseAddTask();
		setInternalAddOpen(false);
	};

	return (
		<div className="min-h-screen bg-[#f2f6f2]">
			<div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-9 lg:py-8">
				<DashboardHeader
					title={
						activeSection === "pending"
							? "Pending Actions"
							: activeSection === "completedToday"
								? "Completed Today"
								: page.pageHeading
					}
					subtitle={
						activeSection === "pending"
							? "Tasks that still need your attention."
							: activeSection === "completedToday"
								? "Tasks you've successfully completed today."
								: "Plan ahead with clarity. Stay consistent and grow steadily."
					}
				/>
				<StatisticsCards
					tasks={page.tasks}
					todayDateKey={page.todayDateKey}
					activeSection={activeSection}
					onSectionChange={onSectionChange}
				/>
				<div className="mt-6 grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(330px,0.9fr)]">
					{activeSection === "today" ? (
						<TodaysTasks
							tasks={page.tasks}
							todayDateKey={page.todayDateKey}
							search={page.search}
							openMenuId={page.scheduleProps.openMenuId}
							busyTaskIds={page.scheduleProps.busyTaskIds}
							isLoading={page.scheduleProps.isLoading}
							onToggleTask={page.scheduleProps.onToggleTask}
							onToggleMenu={page.scheduleProps.onToggleMenu}
							onDeleteTask={page.scheduleProps.onDeleteTask}
							onUpdateTask={page.scheduleProps.onUpdateTask}
							onOpenAddTask={() => setInternalAddOpen(true)}
						/>
					) : activeSection === "pending" ? (
						<PendingActions
							tasks={page.tasks}
							search={page.search}
							openMenuId={page.scheduleProps.openMenuId}
							busyTaskIds={page.scheduleProps.busyTaskIds}
							isLoading={page.scheduleProps.isLoading}
							onToggleTask={page.scheduleProps.onToggleTask}
							onToggleMenu={page.scheduleProps.onToggleMenu}
							onDeleteTask={page.scheduleProps.onDeleteTask}
							onUpdateTask={page.scheduleProps.onUpdateTask}
						/>
					) : (
						<CompletedToday
							tasks={page.tasks}
							todayDateKey={page.todayDateKey}
							search={page.search}
							openMenuId={page.scheduleProps.openMenuId}
							busyTaskIds={page.scheduleProps.busyTaskIds}
							onToggleTask={page.scheduleProps.onToggleTask}
							onToggleMenu={page.scheduleProps.onToggleMenu}
							onDeleteTask={page.scheduleProps.onDeleteTask}
							onUpdateTask={page.scheduleProps.onUpdateTask}
						/>
					)}
					<div className="flex flex-col gap-5">
						<Calendar {...page.calendarProps} />
						<PriorityMilestone
							task={page.milestone}
							onComplete={page.onCompleteMilestone}
							onOpenAddTask={() => setInternalAddOpen(true)}
						/>
					</div>
				</div>
			</div>
			{isModalOpen && <AddTaskDialog open onClose={closeModal} onCreate={page.createTask} />}
		</div>
	);
}
