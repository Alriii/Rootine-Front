import { NavLink } from "react-router";

type IconName = "home" | "calendar" | "check" | "plus";

function Icon({ name }: { name: IconName }) {
	const paths: Record<IconName, React.ReactNode> = {
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
				<rect x="3" y="3" width="18" height="18" rx="4" />
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
		<aside className="flex w-full shrink-0 flex-col border-b border-[#e2ece5] bg-white px-4 py-4 md:sticky md:top-0 md:h-screen md:min-h-0 md:w-64 md:self-start md:border-b-0 md:border-r md:px-5 md:py-7">
			{/* Logo / Wordmark (no sprout circle symbol) */}
			<a href="/" className="flex items-center px-2 pb-6 md:pb-8" aria-label="Rootine home">
				<img
					src="/rootine-logo-kit/svg/rootine-wordmark-color.svg"
					alt="Rootine"
					className="h-7 w-auto object-contain md:h-8"
				/>
			</a>

			{/* Navigation */}
			<nav aria-label="Main navigation" className="flex gap-1.5 overflow-x-auto md:flex-col md:gap-2">
				{navigationItems.map(({ label, to, icon }) => (
					<NavLink
						key={to}
						to={to}
						end
						onClick={onNavigate}
						className={({ isActive }) =>
							`group flex min-w-[92px] flex-1 items-center justify-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-150 md:min-w-0 md:flex-none md:justify-start ${
								isActive
									? "bg-[#eaf3eb] text-[#173826]"
									: "text-[#5a7365] hover:bg-[#f2f6f2] hover:text-[#173826]"
							}`
						}
					>
						<Icon name={icon} />
						<span>{label}</span>
					</NavLink>
				))}
			</nav>

			{/* Add Task Button */}
			<button
				type="button"
				onClick={onAddTask}
				className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#194d33] py-3 text-sm font-semibold text-white shadow-xs transition hover:bg-[#143e29] active:scale-[0.98] md:mt-5"
			>
				<Icon name="plus" />
				<span>Add Task</span>
			</button>

			{/* Bottom Inspiration Card */}
			<div className="relative mt-auto hidden overflow-hidden rounded-2xl border border-[#dce8de] bg-[#eaf3eb] p-4.5 md:block">
				<div className="relative z-10 flex items-start gap-3">
					<span className="mt-0.5 text-2xl">🪴</span>
					<div>
						<p className="text-xs font-bold leading-snug text-[#173826]">
							Grow at your pace –
						</p>
						<p className="mt-0.5 text-xs text-[#5a7365]">
							Small daily habits win.
						</p>
					</div>
				</div>
				{/* Decorative soft leaf in bottom right corner */}
				<div className="pointer-events-none absolute -bottom-3 -right-3 text-3xl opacity-30">
					🌿
				</div>
			</div>
		</aside>
	);
}
