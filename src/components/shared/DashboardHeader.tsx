import { AccountDropdown } from "@/components/shared/AccountDropdown";
import { DashboardIcon } from "@/components/shared/DashboardIcon";

interface DashboardHeaderProps {
	title: string;
	subtitle?: string | null;
	search: string;
	onSearchChange?: (value: string) => void;
	showSearch?: boolean;
}

export function DashboardHeader({
	title,
	subtitle = "Focus on what needs to be done right now today.",
	search,
	onSearchChange,
	showSearch = true,
}: DashboardHeaderProps) {
	return (
		<header className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
			<div>
				<h1 className="text-[26px] font-bold leading-tight tracking-[-0.03em] text-[#0F172A] sm:text-[30px]">{title}</h1>
				{subtitle && <p className="mt-1.5 text-sm text-[#64748B]">{subtitle}</p>}
			</div>
			<div className="flex items-center gap-3">
				{showSearch && (
					<label className="flex h-10 min-w-0 flex-1 items-center gap-2.5 rounded-xl border border-[#E2E8F0] bg-white px-3.5 text-[#94A3B8] transition focus-within:border-[#A8CCB2] sm:w-64 sm:flex-none">
						<DashboardIcon name="search" className="h-[17px] w-[17px] shrink-0" />
						<input
							value={search}
							onChange={(event) => onSearchChange?.(event.target.value)}
							placeholder="Search tasks or tags..."
							aria-label="Search tasks or tags"
							className="w-full bg-transparent text-xs text-[#0F172A] outline-none placeholder:text-[#94A3B8]"
						/>
					</label>
				)}
				<AccountDropdown />
			</div>
		</header>
	);
}
