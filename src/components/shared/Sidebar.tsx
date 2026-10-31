import { NavLink } from "react-router";

type IconName = "leaf" | "home" | "calendar" | "check" | "plus";

function Icon({ name }: { name: IconName }) {
	const paths: Record<IconName, React.ReactNode> = {
		leaf: (
			<>
				<path d="M20 4c-8.5 0-14 3.8-14 10a6 6 0 0 0 6 6c6.2 0 10-5.5 10-14V4h-2Z" />
				<path d="M4 21c2.5-5 6-8 11-11" />
			</>
		),
		home: (
			<>
				<path d="m3 10 9-7 9 7" />
				<path d="M5 9v12h14V9M9 21v-7h6v7" />
			</>
		),
		calendar: (
			<>
				<rect x="3" y="5" width="18" height="16" rx="2" />
				<path d="M16 3v4M8 3v4M3 11h18" />
			</>
		),
		check: (
			<>
				<circle cx="12" cy="12" r="9" />
				<path d="m8 12 2.5 2.5L16 9" />
			</>
		),
		plus: <path d="M12 5v14M5 12h14" />,
	};

	return (
		<svg
			aria-hidden="true"
			className="h-5 w-5 shrink-0"
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.8"
			viewBox="0 0 24 24"
		>
			{paths[name]}
		</svg>
	);
}

const navigationItems: { label: string; to: string; icon: IconName }[] = [
	{ label: "Home", to: "/", icon: "home" },
	{ label: "Upcoming", to: "/upcoming", icon: "calendar" },
	{ label: "Completed", to: "/completed", icon: "check" },
];

export default function Sidebar({
	onAddTask,
	onNavigate,
}: {
	onAddTask?: () => void;
	onNavigate?: () => void;
}) {
	return (
		<aside className="flex w-full shrink-0 flex-col border-b border-[#e8ece5] bg-white px-4 py-3 md:sticky md:top-0 md:h-screen md:min-h-0 md:w-64 md:self-start md:border-b-0 md:border-r md:px-5 md:py-6">
			<a href="/" className="flex items-center px-2 pb-3 md:pb-6" aria-label="Rootine home">
				<img
					src="/rootine-logo-kit/svg/rootine-logo-horizontal-color.svg"
					alt="Rootine"
					className="h-9 w-auto object-contain md:h-10"
				/>
			</a>

			<div className="hidden border-t border-[#edf0eb] md:block" />

			<nav aria-label="Main navigation" className="flex gap-1 overflow-x-auto md:mt-6 md:flex-col md:gap-2">
				{navigationItems.map(({ label, to, icon }) => (
					<NavLink
						key={to}
						to={to}
						end
						onClick={onNavigate}
						className={({ isActive }) =>
							`flex min-w-[92px] flex-1 items-center justify-center gap-2 rounded-xl border px-2.5 py-2.5 text-xs font-medium transition-colors duration-200 md:min-w-0 md:flex-none md:justify-start md:gap-3 md:px-3.5 md:py-3 md:text-sm ${
								isActive
									? "border-[#d7e8d0] bg-[#f0f6ed] text-[#477343]"
									: "border-transparent text-[#747d75] hover:bg-[#f7f9f6] hover:text-[#3e6640]"
							}`
						}
					>
						<Icon name={icon} />
						<span>{label}</span>
					</NavLink>
				))}
			</nav>

			<button
				type="button"
				onClick={onAddTask}
				className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#2E7D52] px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#246742] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E7D52] md:mt-6 md:py-3"
			>
				<Icon name="plus" />
				<span>Add Task</span>
			</button>
			<div className="mt-auto hidden rounded-2xl bg-[#EDF6EE] p-4 md:block">
				<img
					src="/rootine-logo-kit/svg/rootine-symbol-small-color.svg"
					alt=""
					className="h-10 w-10 object-contain"
				/>
				<p className="mt-3 text-sm font-semibold text-[#0F172A]">Grow at your own pace.</p>
				<p className="mt-1 text-xs leading-5 text-[#64748B]">Small steps make a meaningful routine.</p>
			</div>
		</aside>
	);
}