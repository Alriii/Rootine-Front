import { useEffect, useRef, useState } from "react";
import { AddTaskDialog } from "@/components/shared/AddTaskDialog";
import { DeleteTaskConfirmation } from "@/components/shared/DeleteTaskConfirmation";
import { DashboardIcon } from "@/components/shared/DashboardIcon";
import { Spinner } from "@/components/ui/spinner";
import type { Task } from "@/components/shared/types";

interface TaskRowProps {
	task: Task;
	menuOpen: boolean;
	timeLabel?: string;
	showTimeOnMobile?: boolean;
	isBusy?: boolean;
	onToggle: () => void;
	onToggleMenu: () => void;
	onDelete: () => void;
	onUpdate: (task: Task) => void;
}

const categoryConfig: Record<string, { bg: string; text: string }> = {
	Work:     { bg: "bg-[#e8f5ee]", text: "text-[#1a6b40]" },
	Personal: { bg: "bg-[#eef2ff]", text: "text-[#3730a3]" },
	Health:   { bg: "bg-[#fff4e6]", text: "text-[#b45309]" },
};

const priorityConfig: Record<string, { border: string; badge: string; text: string }> = {
	Low:    { border: "border-l-[#34d399]", badge: "bg-[#e8f5ee]", text: "text-[#1a6b40]" },
	Medium: { border: "border-l-[#f59e0b]", badge: "bg-[#fffbeb]", text: "text-[#b45309]" },
	High:   { border: "border-l-[#ef4444]", badge: "bg-[#fef2f2]", text: "text-[#b91c1c]" },
};

export function TaskRow({
	task,
	menuOpen,
	timeLabel,
	showTimeOnMobile = false,
	isBusy = false,
	onToggle,
	onToggleMenu,
	onDelete,
	onUpdate,
}: TaskRowProps) {
	const [editing, setEditing] = useState(false);
	const [confirmingDelete, setConfirmingDelete] = useState(false);
	const [openUpwards, setOpenUpwards] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const kebabBtnRef = useRef<HTMLButtonElement>(null);

	function handleKebabClick() {
		if (!menuOpen && kebabBtnRef.current) {
			const rect = kebabBtnRef.current.getBoundingClientRect();
			setOpenUpwards(window.innerHeight - rect.bottom < 170);
		}
		onToggleMenu();
	}

	useEffect(() => {
		if (!menuOpen) return;
		function handlePointerDown(e: PointerEvent) {
			if (menuRef.current && !menuRef.current.contains(e.target as Node) && !kebabBtnRef.current?.contains(e.target as Node)) {
				onToggleMenu();
			}
		}
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") {
				onToggleMenu();
			}
		}
		document.addEventListener("pointerdown", handlePointerDown);
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("pointerdown", handlePointerDown);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [menuOpen, onToggleMenu]);

	const priorityKey =
		task.priority === true ? "High"
		: task.priority === false ? "Medium"
		: (task.priority as string) || "Medium";

	const pCfg = priorityConfig[priorityKey] ?? priorityConfig.Medium;
	const catCfg = categoryConfig[task.category] ?? { bg: "bg-[#f1f5f9]", text: "text-[#475569]" };

	return (
		<div
			className={`group relative flex items-center gap-3.5 rounded-xl border border-l-[3.5px] px-4 py-3 transition-all duration-150 ${
				menuOpen ? "z-40 " : "z-0 "
			}${
				task.completed
					? "border-[#e2ebe5] border-l-[#a7c9b5] bg-[#f8fbf9] opacity-75"
					: `${pCfg.border} border-[#d8e8df] bg-white shadow-xs hover:border-y-[#b8d9c6] hover:border-r-[#b8d9c6] hover:shadow-sm`
			}`}
		>
			{/* Checkbox — clean rounded square with moving circle spinner when busy */}
			<button
				type="button"
				onClick={onToggle}
				disabled={isBusy}
				aria-label={`Mark ${task.title} ${task.completed ? "incomplete" : "complete"}`}
				className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-150 ${
					task.completed
						? "border-[#1e7a4a] bg-[#1e7a4a] text-white"
						: "border-[#b8d9c6] bg-white hover:border-[#1e7a4a]"
				} ${isBusy ? "cursor-wait opacity-80" : ""}`}
			>
				{isBusy ? (
					<Spinner className={`h-3 w-3 ${task.completed ? "text-white" : "text-[#1e7a4a]"}`} />
				) : task.completed ? (
					<svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
						<path
							d="M2.5 6.5l2.5 2.5 5-5"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				) : null}
			</button>

			{/* Content */}
			<div className="min-w-0 flex-1">
				<p
					className={`truncate text-sm font-semibold leading-snug ${
						task.completed
							? "text-[#8aab97] line-through decoration-[#b8d9c6]"
							: "text-[#0d1f18]"
					}`}
				>
					{task.title}
				</p>
				<div className="mt-1 flex flex-wrap items-center gap-1.5">
					<span
						className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold tracking-wide ${catCfg.bg} ${catCfg.text}`}
					>
						{task.category}
					</span>
					{!task.completed && (
						<span
							className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${pCfg.badge} ${pCfg.text}`}
						>
							{priorityKey}
						</span>
					)}
					{task.completed && (
						<span className="rounded-md bg-[#e8f5ee] px-1.5 py-0.5 text-[10px] font-bold text-[#1a6b40]">
							Completed
						</span>
					)}
					{task.detail && !task.completed && (
						<span className="hidden max-w-[160px] truncate text-[11px] text-[#8aab97] sm:inline">
							{task.detail}
						</span>
					)}
				</div>
			</div>

			{/* Time chip */}
			<span
				className={`${showTimeOnMobile ? "" : "hidden sm:inline-flex"} shrink-0 items-center rounded-lg bg-[#f0f7f3] px-2.5 py-1 text-xs font-semibold tabular-nums text-[#4d6658]`}
			>
				{timeLabel ?? task.time}
			</span>

			{/* Kebab menu */}
			<div className="relative shrink-0">
				<button
					ref={kebabBtnRef}
					type="button"
					onClick={handleKebabClick}
					aria-label={`Actions for ${task.title}`}
					aria-expanded={menuOpen}
					className="rounded-lg p-1.5 text-[#8aab97] transition hover:bg-[#e8f5ee] hover:text-[#1e7a4a]"
				>
					<DashboardIcon name="more" className="h-4 w-4" />
				</button>

				{menuOpen && (
					<div
						ref={menuRef}
						className={`absolute right-0 z-50 w-44 rounded-xl border border-[#d8e8df] bg-white p-1 shadow-xl shadow-[#0d1f18]/15 ${
							openUpwards ? "bottom-full mb-1.5" : "top-full mt-1.5"
						}`}
					>
						<button
							type="button"
							disabled={isBusy}
							onClick={() => {
								onToggle();
								onToggleMenu();
							}}
							className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-semibold text-[#1e7a4a] hover:bg-[#e8f5ee] disabled:opacity-50"
						>
							<DashboardIcon name="check" className="h-3.5 w-3.5" />
							Mark {task.completed ? "incomplete" : "complete"}
						</button>
						<button
							type="button"
							onClick={() => { onToggleMenu(); setEditing(true); }}
							className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-semibold text-[#4d6658] hover:bg-[#f0f7f3]"
						>
							<DashboardIcon name="bolt" className="h-3.5 w-3.5" />
							Edit task
						</button>
						<div className="my-1 border-t border-[#e8ede9]" />
						<button
							type="button"
							disabled={isBusy}
							onClick={() => { onToggleMenu(); setConfirmingDelete(true); }}
							className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-semibold text-[#b91c1c] hover:bg-[#fef2f2] disabled:opacity-50"
						>
							<DashboardIcon name="alert" className="h-3.5 w-3.5" />
							Delete task
						</button>
					</div>
				)}
			</div>

			{editing && (
				<AddTaskDialog open task={task} onClose={() => setEditing(false)} onUpdate={onUpdate} />
			)}
			{confirmingDelete && (
				<DeleteTaskConfirmation
					taskTitle={task.title}
					onCancel={() => setConfirmingDelete(false)}
					onConfirm={() => { setConfirmingDelete(false); onDelete(); }}
				/>
			)}
		</div>
	);
}
