import type { Category } from "@/components/shared/types";

type FilterCategory = "All" | Category;

interface CompletedFiltersProps {
	value: FilterCategory;
	onChange: (category: FilterCategory) => void;
}

const categories: FilterCategory[] = ["All", "Work", "Personal", "Health"];

export function CompletedFilters({ value, onChange }: CompletedFiltersProps) {
	return (
		<div className="flex flex-wrap gap-1">
			{categories.map((category) => (
				<button
					key={category}
					type="button"
					onClick={() => onChange(category)}
					aria-pressed={value === category}
					className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
						value === category
							? "bg-[#EDF6EE] text-[#2E7D52]"
							: "text-[#64748B] hover:bg-[#F1F5F9]"
					}`}
				>
					{category}
				</button>
			))}
		</div>
	);
}
