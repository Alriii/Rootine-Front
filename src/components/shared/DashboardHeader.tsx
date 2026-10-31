import { AccountDropdown } from "@/components/shared/AccountDropdown";
import { Spinner } from "@/components/ui/spinner";
import { useApiLoading } from "@/lib/api";

interface DashboardHeaderProps {
	title: string;
	subtitle?: string | null;
}

export function DashboardHeader({
	title,
	subtitle = "Plan ahead with clarity. Stay consistent and grow steadily.",
}: DashboardHeaderProps) {
	const isApiLoading = useApiLoading();

	return (
		<header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<div className="flex items-center gap-3">
					<h1 className="text-2xl font-bold tracking-tight text-[#173826] sm:text-[28px]">
						{title}
					</h1>
					{isApiLoading && (
						<span
							role="status"
							aria-label="Processing request"
							className="inline-flex items-center gap-1.5 rounded-full border border-[#d2e2d6] bg-[#eaf3eb] px-2.5 py-0.5 text-[11px] font-semibold text-[#194d33] animate-pulse"
						>
							<Spinner className="h-3 w-3 text-[#194d33]" />
							Saving...
						</span>
					)}
				</div>
				{subtitle && (
					<p className="mt-1 text-xs font-normal text-[#5a7365]">
						{subtitle}
					</p>
				)}
			</div>
			<div className="flex items-center gap-3">
				<AccountDropdown />
			</div>
		</header>
	);
}
