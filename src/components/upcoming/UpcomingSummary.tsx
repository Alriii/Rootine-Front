import { StatCard } from "@/components/shared/StatCard";
import type { UpcomingSummarySelection } from "@/components/upcoming/upcomingUtils";

interface UpcomingSummaryProps {
	totalScheduled: number;
	dueThisWeek: number;
	highPriority: number;
	activeSection: UpcomingSummarySelection | null;
	onSectionChange: (section: UpcomingSummarySelection) => void;
}

export function UpcomingSummary({
	totalScheduled,
	dueThisWeek,
	highPriority,
	activeSection,
	onSectionChange,
}: UpcomingSummaryProps) {
	const buttonClass = "w-full rounded-2xl text-left transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E7D52]";

	return (
		<section aria-label="Upcoming task statistics" className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
			<button
				type="button"
				onClick={() => onSectionChange("totalScheduled")}
				aria-label={`View ${totalScheduled} total scheduled tasks`}
				aria-pressed={activeSection === "totalScheduled"}
				className={buttonClass}
			>
				<StatCard icon="calendar" value={totalScheduled} label="Total Scheduled" tone="green" active={activeSection === "totalScheduled"} />
			</button>
			<button
				type="button"
				onClick={() => onSectionChange("dueThisWeek")}
				aria-label={`View ${dueThisWeek} tasks due this week`}
				aria-pressed={activeSection === "dueThisWeek"}
				className={buttonClass}
			>
				<StatCard icon="calendar" value={dueThisWeek} label="Due This Week" tone="blue" active={activeSection === "dueThisWeek"} />
			</button>
			<button
				type="button"
				onClick={() => onSectionChange("highPriority")}
				aria-label={`View ${highPriority} high priority tasks`}
				aria-pressed={activeSection === "highPriority"}
				className={buttonClass}
			>
				<StatCard icon="alert" value={highPriority} label="High Priority Focus" tone="orange" active={activeSection === "highPriority"} />
			</button>
		</section>
	);
}
