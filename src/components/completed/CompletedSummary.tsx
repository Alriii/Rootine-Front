import { Card } from "@/components/ui/card";
import { DashboardIcon } from "@/components/shared/DashboardIcon";

export function CompletedSummary({ count }: { count: number }) {
	return (
		<Card className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl border border-[#e4ece6] bg-white p-5 shadow-xs sm:p-5.5">
			<span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ebf4ed] text-[#194d33]">
				<DashboardIcon name="check" className="h-6 w-6" />
			</span>
			<div>
				<p className="text-3xl font-extrabold leading-none tracking-tight text-[#173826]">{count}</p>
				<p className="mt-1 text-xs font-bold uppercase tracking-wider text-[#627d6e]">Finished Tasks Archive</p>
			</div>
			<p className="text-xs font-medium text-[#5a7365] sm:ml-auto">
				Every completed task builds consistency and momentum. Keep growing! 🌱
			</p>
		</Card>
	);
}
