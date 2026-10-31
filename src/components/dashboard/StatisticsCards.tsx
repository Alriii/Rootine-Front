import { StatCard } from "@/components/shared/StatCard";
import type { Task } from "@/components/shared/types";
import { getCompletionDate } from "@/utils/calendarUtils";

export type DashboardSection = "today" | "pending" | "completedToday";

interface StatisticsCardsProps {
	tasks: Task[];
	todayDateKey: string;
	activeSection: DashboardSection;
	onSectionChange: (section: DashboardSection) => void;
}

export function StatisticsCards({ tasks, todayDateKey, activeSection, onSectionChange }: StatisticsCardsProps) {
	const todayCount = tasks.filter((task) => !task.completed && task.date === todayDateKey).length;
	const completedCount = tasks.filter((task) =>
		task.completed && task.completedAt && getCompletionDate(task) === todayDateKey,
	).length;
	const pendingCount = tasks.filter((task) => !task.completed).length;
	const cardButtonClass =
		"w-full rounded-2xl text-left transition-[transform,box-shadow] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-[#194d33]";

	return (
		<section aria-label="Task statistics" className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
			<button
				type="button"
				onClick={() => onSectionChange("today")}
				aria-label={`View ${todayCount} today's tasks`}
				aria-pressed={activeSection === "today"}
				className={cardButtonClass}
			>
				<StatCard
					icon="calendar"
					value={todayCount}
					label="TODAY'S TASKS"
					subtitle="tasks remaining"
					active={activeSection === "today"}
				/>
			</button>
			<button
				type="button"
				onClick={() => onSectionChange("completedToday")}
				aria-label={`View ${completedCount} tasks completed today`}
				aria-pressed={activeSection === "completedToday"}
				className={cardButtonClass}
			>
				<StatCard
					icon="check"
					value={completedCount}
					label="COMPLETED TODAY"
					subtitle="tasks finished"
					active={activeSection === "completedToday"}
				/>
			</button>
			<button
				type="button"
				onClick={() => onSectionChange("pending")}
				aria-label={`View ${pendingCount} pending ${pendingCount === 1 ? "action" : "actions"}`}
				aria-pressed={activeSection === "pending"}
				className={cardButtonClass}
			>
				<StatCard
					icon="alert"
					value={pendingCount}
					label="PENDING ACTIONS"
					subtitle="tasks to prioritize"
					active={activeSection === "pending"}
				/>
			</button>
		</section>
	);
}
