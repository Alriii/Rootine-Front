import { Card } from "@/components/ui/card";
import { DashboardIcon } from "@/components/shared/DashboardIcon";

export function CompletedSummary({ count }: { count: number }) {
	return (
		<Card className="mt-7 flex flex-wrap items-center gap-4 rounded-2xl border-[#E2E8F0] bg-white p-5 shadow-none sm:p-6">
			<span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EDF6EE] text-[#2E7D52]">
				<DashboardIcon name="check" className="h-6 w-6" />
			</span>
			<div>
				<p className="text-2xl font-bold leading-none tracking-tight text-[#0F172A]">{count}</p>
				<p className="mt-2 text-sm font-medium text-[#334155]">Finished Tasks</p>
			</div>
			<p className="text-sm text-[#64748B] sm:ml-auto">Great job keeping up with your goals!</p>
		</Card>
	);
}
