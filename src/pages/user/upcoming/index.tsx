import { AddTaskDialog, DashboardHeader } from "@/components/shared";
import { UpcomingSidebar, UpcomingSummary, UpcomingTimeline, useUpcoming } from "@/components/upcoming";
import { useState } from "react";

export default function UpcomingPage({
	isAddTaskOpen = false,
	onCloseAddTask = () => {},
}: { isAddTaskOpen?: boolean; onCloseAddTask?: () => void }) {
	const page = useUpcoming();
	const [internalAddOpen, setInternalAddOpen] = useState(false);

	const isModalOpen = isAddTaskOpen || internalAddOpen;
	const closeModal = () => {
		onCloseAddTask();
		setInternalAddOpen(false);
	};

	return (
		<div className="min-h-screen min-w-0 bg-[#f2f6f2]">
			<div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-9 lg:py-8">
				<DashboardHeader
					title="Upcoming Schedule & Timeline"
					subtitle="Plan ahead with clarity. Stay consistent and grow steadily."
				/>
				<UpcomingSummary
					totalScheduled={page.totalScheduled}
					dueThisWeek={page.dueThisWeek}
					highPriority={page.highPriority}
					activeSection={page.summarySelection}
					onSectionChange={page.onSummarySelectionChange}
				/>
				<div className="mt-6 grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(330px,0.9fr)]">
					<UpcomingTimeline
						{...page.timelineProps}
						onOpenAddTask={() => setInternalAddOpen(true)}
					/>
					<UpcomingSidebar
						{...page.sidebarProps}
						onOpenAddTask={() => setInternalAddOpen(true)}
					/>
				</div>
			</div>
			{isModalOpen && <AddTaskDialog open onClose={closeModal} onCreate={page.createTask} />}
		</div>
	);
}
