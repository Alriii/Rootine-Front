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
	const cardButtonClass = "w-full rounded-2xl text-left transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E7D52]";

	return (
		<section aria-label="Task statistics" className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
			<button
				type="button"
				onClick={() => onSectionChange("today")}
				aria-label={`View ${todayCount} today's tasks`}
				aria-pressed={activeSection === "today"}
				className={cardButtonClass}
			>
				<StatCard icon="list" value={todayCount} label="Today's Tasks" tone="green" active={activeSection === "today"} />
			</button>
			<button
				type="button"
				onClick={() => onSectionChange("completedToday")}
				aria-label={`View ${completedCount} tasks completed today`}
				aria-pressed={activeSection === "completedToday"}
				className={cardButtonClass}
			>
				<StatCard icon="check" value={completedCount} label="Completed Today" tone="lime" active={activeSection === "completedToday"} />
			</button>
			<button
				type="button"
				onClick={() => onSectionChange("pending")}
				aria-label={`View ${pendingCount} pending ${pendingCount === 1 ? "action" : "actions"}`}
				aria-pressed={activeSection === "pending"}
				className={cardButtonClass}
			>
				<StatCard icon="alert" value={pendingCount} label="Pending Actions" tone="orange" active={activeSection === "pending"} />
			</button>
		</section>
	);
}
