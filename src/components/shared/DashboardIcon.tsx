import type { ReactNode } from "react";
import type { DashboardIconName } from "@/components/shared/types";

const iconPaths: Record<DashboardIconName, ReactNode> = {
	search: (
		<>
			<circle cx="11" cy="11" r="7" />
			<path d="m20 20-4-4" />
		</>
	),
	user: (
		<>
			<circle cx="12" cy="8" r="3.5" />
			<path d="M5 20a7 7 0 0 1 14 0" />
		</>
	),
	list: (
		<>
			<path d="M9 6h11M9 12h11M9 18h11" />
			<path d="M4 6h.01M4 12h.01M4 18h.01" />
		</>
	),
	check: (
		<path d="M20 6 9 17l-5-5" />
	),
	alert: (
		<>
			<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
			<path d="M12 9v4" />
			<path d="M12 17h.01" />
		</>
	),
	calendar: (
		<>
			<rect x="3" y="5" width="18" height="16" rx="2" />
			<path d="M16 3v4M8 3v4M3 11h18" />
		</>
	),
	"chevron-left": <path d="m15 18-6-6 6-6" />,
	"chevron-right": <path d="m9 18 6-6-6-6" />,
	more: (
		<>
			<circle cx="5" cy="12" r="1.2" fill="currentColor" />
			<circle cx="12" cy="12" r="1.2" fill="currentColor" />
			<circle cx="19" cy="12" r="1.2" fill="currentColor" />
		</>
	),
	bolt: <path d="m13 2-3 8h7l-6 12 1-9H6l7-11Z" />,
	close: <path d="m18 6-12 12M6 6l12 12" />,
	settings: (
		<>
			<circle cx="12" cy="12" r="3" />
			<path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a7.8 7.8 0 0 1-1.5.9l-.3 1.8h-2.8l-.3-1.8a7.8 7.8 0 0 1-1.5-.9l-1.7.7-1.4-2.4 1.4-1.1a7 7 0 0 1 0-1.8l-1.4-1.1 1.4-2.4 1.7.7a7.8 7.8 0 0 1 1.5-.9l.3-1.8h2.8l.3 1.8a7.8 7.8 0 0 1 1.5.9l1.7-.7 1.4 2.4-1.4 1.1a7 7 0 0 1 0 1.8Z" />
		</>
	),
	logout: (
		<>
			<path d="M10 17l5-5-5-5M15 12H3" />
			<path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
		</>
	),
};

interface DashboardIconProps {
	name: DashboardIconName;
	className?: string;
}

export function DashboardIcon({ name, className = "h-5 w-5" }: DashboardIconProps) {
	return (
		<svg
			aria-hidden="true"
			className={className}
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			viewBox="0 0 24 24"
		>
			{iconPaths[name]}
		</svg>
	);
}
