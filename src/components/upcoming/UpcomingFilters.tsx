import type { TimelineFilter } from "@/components/upcoming/upcomingUtils";

interface UpcomingFiltersProps {
	value: TimelineFilter;
	onChange: (value: TimelineFilter) => void;
}

const filters: TimelineFilter[] = ["All", "This Week", "Next Week", "High Priority"];

export function UpcomingFilters({ value, onChange }: UpcomingFiltersProps) {
	return (
		<div className="flex flex-wrap gap-1">
			{filters.map((filter) => (
				<button
					key={filter}
					type="button"
					onClick={() => onChange(filter)}
					aria-pressed={value === filter}
					className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
						value === filter ? "bg-[#EDF6EE] text-[#2E7D52]" : "text-[#64748B] hover:bg-[#F1F5F9]"
					}`}
				>
					{filter}
				</button>
			))}
		</div>
	);
}
