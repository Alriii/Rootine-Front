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

  const initials = user?.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "R";

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        ref={profileButtonRef}
        type="button"
        aria-label="User profile"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            setOpen(true);
            window.setTimeout(() => {
              containerRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
            }, 0);
          }
        }}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[#DCE5DD] bg-white text-[#2E7D52] transition hover:border-[#A8CCB2] hover:bg-[#EDF6EE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E7D52]"
      >
        {user ? (
          <span aria-hidden="true" className="text-xs font-bold">{initials}</span>
        ) : (
          <DashboardIcon name="user" className="h-[19px] w-[19px]" />
        )}
      </button>
      {open && (
        <div
          role="menu"
          aria-label="Account menu"
          onKeyDown={(event) => {
            const items = Array.from(
              event.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]'),
            );
            const currentIndex = items.indexOf(document.activeElement as HTMLElement);
            if (event.key === "Escape") {
              event.preventDefault();
              setOpen(false);
              profileButtonRef.current?.focus();
            } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault();
              const direction = event.key === "ArrowDown" ? 1 : -1;
              const nextIndex = currentIndex < 0
                ? 0
                : (currentIndex + direction + items.length) % items.length;
              items[nextIndex]?.focus();
            } else if (event.key === "Home") {
              event.preventDefault();
              items[0]?.focus();
            } else if (event.key === "End") {
              event.preventDefault();
              items.at(-1)?.focus();
            }
          }}
          className="absolute right-0 top-[calc(100%+10px)] z-50 w-[min(19rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[#E2E8E0] bg-white shadow-[0_18px_50px_-24px_rgba(15,46,34,0.28)]"
        >
          <div className="flex items-center gap-3 border-b border-[#edf0eb] px-4 py-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EDF6EE] text-sm font-bold text-[#2E7D52]">
              {initials}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-[#0F172A]">{user?.name}</span>
              <span className="mt-0.5 block truncate text-xs text-[#64748B]">{user?.email}</span>
            </span>
          </div>
          <div className="p-2">
            <Link
              to="/preferences"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#334155] transition hover:bg-[#F4F7F2] hover:text-[#2E7D52] focus-visible:outline-2 focus-visible:outline-[#2E7D52]"
            >
              <DashboardIcon name="settings" className="h-[18px] w-[18px]" />
              Preferences
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[#9b3c34] transition hover:bg-[#fff5f3] focus-visible:outline-2 focus-visible:outline-[#b5473b]"
            >
              <DashboardIcon name="logout" className="h-[18px] w-[18px]" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
