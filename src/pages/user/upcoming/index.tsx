import { AddTaskDialog, DashboardHeader } from "@/components/shared";
import { UpcomingSidebar, UpcomingSummary, UpcomingTimeline, useUpcoming } from "@/components/upcoming";

export default function UpcomingPage({
	isAddTaskOpen = false,
	onCloseAddTask = () => {},
}: { isAddTaskOpen?: boolean; onCloseAddTask?: () => void }) {
	const page = useUpcoming();

	return (
		<div className="min-h-screen min-w-0 bg-[#FAFCFA]">
			<div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-9 lg:py-8">
				<DashboardHeader title="Upcoming Schedule & Timeline" subtitle="Plan ahead, manage upcoming tasks, and keep your schedule balanced." search={page.search} onSearchChange={page.setSearch} />
				<UpcomingSummary
					totalScheduled={page.totalScheduled}
					dueThisWeek={page.dueThisWeek}
					highPriority={page.highPriority}
					activeSection={page.summarySelection}
					onSectionChange={page.onSummarySelectionChange}
				/>
				<div className="mt-6 grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(330px,0.9fr)]">
					<UpcomingTimeline {...page.timelineProps} />
					<UpcomingSidebar {...page.sidebarProps} />
				</div>
			</div>
			{isAddTaskOpen && <AddTaskDialog open onClose={onCloseAddTask} onCreate={page.createTask} />}
		</div>
	);
}
