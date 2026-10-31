import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { AuthFormCard } from "@/components/auth/AuthFormCard";
import { useAuth } from "@/components/auth/useAuth";
import { AuthLayout } from "@/pages/auth/layout";

export default function AccountCreatedPage() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const registrationComplete =
    (location.state as { registrationComplete?: boolean } | null)?.registrationComplete === true;

  useEffect(() => {
    if (!user || !registrationComplete) {
      navigate(user ? "/" : "/signup", { replace: true });
    }
  }, [navigate, registrationComplete, user]);

  if (!user || !registrationComplete) return null;

  return (
    <AuthLayout
      heading="Account ready, welcome aboard."
      description="Every meaningful change begins with a small step. We’re glad you’re here."
      successIllustration
    >
      <AuthFormCard title="Account Created" description="Your frontend demo account is ready for this browser session.">
        <div className="mb-5 flex items-center gap-3 rounded-2xl border border-[#d8e9d8] bg-[#f1f8f0] p-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#dcefdc] text-[#1B7F4E]">
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
              <path d="m6 12.5 4 4L18.5 8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div>
            <p className="text-sm font-bold text-[#245f38]">You’re ready for your next step</p>
            <p className="mt-0.5 text-xs text-[#59735f]">{user.email}</p>
          </div>
        </div>
        <p className="mb-6 text-sm leading-6 text-[#68746b]">
          This prototype keeps your profile in the current browser session only. It is not production authentication.
        </p>
        <Link
          to="/"
          className="flex h-12 w-full items-center justify-center rounded-xl bg-[#1B7F4E] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#166b41] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B7F4E]"
        >
          Continue to Home
        </Link>
      </AuthFormCard>
    </AuthLayout>
  );
}
