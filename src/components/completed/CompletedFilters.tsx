import type { Category } from "@/components/shared/types";

type FilterCategory = "All" | Category;

interface CompletedFiltersProps {
	value: FilterCategory;
	onChange: (category: FilterCategory) => void;
}

const categories: FilterCategory[] = ["All", "Work", "Personal", "Health"];

export function CompletedFilters({ value, onChange }: CompletedFiltersProps) {
	return (
		<div role="group" aria-label="Filter by category" className="flex flex-wrap gap-1.5">
			{categories.map((category) => {
				const isSelected = value === category;
				return (
					<button
						key={category}
						type="button"
						onClick={() => onChange(category)}
						aria-pressed={isSelected}
						className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-150 active:scale-95 cursor-pointer ${
							isSelected
								? "bg-[#194d33] text-white shadow-2xs"
								: "border border-[#e2ece5] bg-white text-[#4a6354] hover:bg-[#f2f6f2] hover:text-[#173826]"
						}`}
					>
						{category}
					</button>
				);
			})}
		</div>
	);
}
