import type { TimelineFilter } from "@/components/upcoming/upcomingUtils";

interface UpcomingFiltersProps {
	value: TimelineFilter;
	onChange: (value: TimelineFilter) => void;
}

const filters: { label: string; value: TimelineFilter; icon?: boolean }[] = [
	{ label: "All", value: "All" },
	{ label: "This Week", value: "This Week" },
	{ label: "Next Week", value: "Next Week" },
	{ label: "High Priority", value: "High Priority", icon: true },
];

export function UpcomingFilters({ value, onChange }: UpcomingFiltersProps) {
	return (
		<div className="flex flex-wrap gap-1.5">
			{filters.map((filter) => {
				const isSelected = value === filter.value;
				return (
					<button
						key={filter.value}
						type="button"
						onClick={() => onChange(filter.value)}
						aria-pressed={isSelected}
						className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-150 active:scale-95 cursor-pointer ${
							isSelected
								? "bg-[#194d33] text-white shadow-2xs"
								: "border border-[#e2ece5] bg-white text-[#4a6354] hover:bg-[#f2f6f2] hover:text-[#173826]"
						}`}
					>
						{filter.icon && (
							<svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
								<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
								<line x1="12" y1="9" x2="12" y2="13" />
								<line x1="12" y1="17" x2="12.01" y2="17" />
							</svg>
						)}
						<span>{filter.label}</span>
					</button>
				);
			})}
		</div>
	);
}
