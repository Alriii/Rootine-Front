import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/components/auth/useAuth";
import { DashboardIcon } from "@/components/shared/DashboardIcon";

export function AccountDropdown() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function handleSignOut() {
    setOpen(false);
    logout();
    navigate("/login", { replace: true });
  }

  const initials =
    user?.name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "R";

  const AvatarInner = ({ size }: { size: "sm" | "lg" }) => {
    const cls =
      size === "lg"
        ? "h-10 w-10 text-sm rounded-xl"
        : "h-9 w-9 text-xs rounded-xl";
    return (
      <span
        className={`flex shrink-0 items-center justify-center bg-[#194d33] font-bold text-white ${cls}`}
      >
        {initials}
      </span>
    );
  };

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        ref={profileButtonRef}
        type="button"
        aria-label="User profile"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((c) => !c)}
        className="flex items-center gap-1.5 rounded-full p-0.5 transition hover:bg-[#eaf3eb] focus-visible:outline-2 focus-visible:outline-[#194d33]"
      >
        <AvatarInner size="sm" />
        <svg
          className="h-3.5 w-3.5 text-[#5a7365] transition-transform duration-150"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Account menu"
          className="absolute right-0 top-[calc(100%+8px)] z-50 w-64 overflow-hidden rounded-2xl border border-[#e2ece5] bg-white shadow-xl shadow-[#173826]/10"
        >
          {/* User info header */}
          <div className="flex items-center gap-3 border-b border-[#e2ece5] bg-[#fafdfa] p-3.5">
            <AvatarInner size="lg" />
            <div className="min-w-0 flex-1">
              <span className="block truncate text-xs font-bold text-[#173826]">{user?.name}</span>
              <span className="block truncate text-[11px] text-[#70897b]">{user?.email}</span>
            </div>
          </div>

          <div className="p-1.5">
            <Link
              to="/preferences"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#5a7365] transition hover:bg-[#eaf3eb] hover:text-[#173826]"
            >
              <DashboardIcon name="settings" className="h-4 w-4 text-[#70897b]" />
              Preferences
            </Link>
            <div className="my-1 border-t border-[#e2ece5]" />
            <button
              type="button"
              role="menuitem"
              onClick={handleSignOut}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-[#b91c1c] transition hover:bg-[#fef2f2]"
            >
              <DashboardIcon name="logout" className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
