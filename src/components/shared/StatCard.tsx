import { Card } from "@/components/ui/card";
import { DashboardIcon } from "@/components/shared/DashboardIcon";

interface StatCardProps {
	icon: "calendar" | "clock" | "alert" | "list" | "check";
	value: number;
	label: string;
	subtitle?: string;
	tone?: "green" | "lime" | "orange" | "blue";
	active?: boolean;
}

export function StatCard({
	icon,
	value,
	label,
	subtitle,
	active = false,
}: StatCardProps) {
	return (
		<Card
			className={`group relative flex items-center gap-4.5 rounded-2xl border p-5 shadow-xs transition-all duration-200 sm:p-5.5 ${
				active
					? "border-[#194d33] ring-1.5 ring-[#194d33]/20 bg-white shadow-sm"
					: "border-[#e4ece6] bg-white hover:border-[#c5d8cb] hover:shadow-sm hover:-translate-y-0.5"
			}`}
		>
			{/* Icon on the left: pale mint rounded square */}
			<span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ebf4ed] text-[#194d33] transition-transform group-hover:scale-105">
				{icon === "clock" ? (
					<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<circle cx="12" cy="12" r="10" />
						<polyline points="12 6 12 12 16 14" />
					</svg>
				) : icon === "alert" ? (
					<svg className="h-5 w-5 text-[#194d33]" viewBox="0 0 24 24" fill="currentColor">
						<path d="M12 2L1 21h22L12 2zm0 3.5l8.5 14.5H3.5L12 5.5zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z" />
					</svg>
				) : (
					<DashboardIcon name={icon === "calendar" ? "calendar" : icon === "check" ? "check" : "list"} className="h-5 w-5" />
				)}
			</span>

			{/* Vertical stack on the right: Label -> Number -> Subtitle */}
			<div className="min-w-0 flex-1">
				<p className="text-[10px] font-bold tracking-widest text-[#627d6e] uppercase">
					{label}
				</p>
				<p className="mt-0.5 text-3xl font-extrabold leading-none tracking-tight text-[#173826]">
					{value}
				</p>
				{subtitle && (
					<p className="mt-1 text-xs font-medium text-[#70897b]">
						{subtitle}
					</p>
				)}
			</div>
		</Card>
	);
}
