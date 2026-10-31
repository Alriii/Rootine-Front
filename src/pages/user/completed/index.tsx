import { AddTaskDialog, DashboardHeader } from "@/components/shared";
import { CompletedArchive, CompletedSidebar, CompletedSummary, useCompleted } from "@/components/completed";

export default function CompletedPage({
	isAddTaskOpen = false,
	onCloseAddTask = () => {},
}: { isAddTaskOpen?: boolean; onCloseAddTask?: () => void }) {
	const page = useCompleted();

	return (
		<div className="min-h-screen min-w-0 bg-[#FAFCFA]">
			<div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-9 lg:py-8">
				<DashboardHeader title="Completed Achievements" subtitle={null} search={page.search} onSearchChange={page.setSearch} />
				<CompletedSummary count={page.completedTasks.length} />
				<div className="mt-6 grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(330px,0.9fr)]">
					<CompletedArchive {...page.archiveProps} />
					<CompletedSidebar {...page.sidebarProps} />
				</div>
			</div>
			{isAddTaskOpen && <AddTaskDialog open onClose={onCloseAddTask} onCreate={page.createTask} />}
		</div>
	);
}
