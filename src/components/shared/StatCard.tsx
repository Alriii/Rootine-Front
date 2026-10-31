import { Card } from "@/components/ui/card";
import { DashboardIcon } from "@/components/shared/DashboardIcon";

interface StatCardProps {
	icon: "list" | "check" | "alert" | "calendar";
	value: number;
	label: string;
	tone: "green" | "lime" | "orange" | "blue";
	active?: boolean;
}

const tones = {
	green: "bg-[#EDF6EE] text-[#2E7D52]",
	lime: "bg-[#EDF6EE] text-[#22C55E]",
	orange: "bg-[#FFF3E8] text-[#E58A32]",
	blue: "bg-[#EFF6FF] text-[#3B82F6]",
};

export function StatCard({ icon, value, label, tone, active = false }: StatCardProps) {
	return (
		<Card className={`flex items-center gap-4 rounded-2xl p-5 shadow-none transition-colors sm:p-6 ${
			active ? "border-[#A8CCB2] bg-[#F7FBF7]" : "border-[#E2E8F0] bg-white"
		}`}>
			<span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
				<DashboardIcon name={icon} className="h-[22px] w-[22px]" />
			</span>
			<div className="min-w-0">
				<p className="text-2xl font-bold leading-none tracking-tight text-[#0F172A]">{value}</p>
				<p className="mt-2 text-sm text-[#64748B]">{label}</p>
			</div>
		</Card>
	);
}
