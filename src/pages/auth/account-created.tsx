import { useEffect, useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router";
import { AuthFormCard } from "@/components/auth/AuthFormCard";
import { AuthLayout } from "@/pages/auth/layout";
import { apiRequest } from "@/lib/api";

export default function AccountCreatedPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { registrationComplete?: boolean; email?: string } | null;
  const registrationComplete = state?.registrationComplete === true;
  const email = state?.email || "";

  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!registrationComplete) {
      navigate("/signup", { replace: true });
    }
  }, [navigate, registrationComplete]);

  if (!registrationComplete) return null;

  async function handleVerify(e: FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!code.trim() || code.trim().length !== 5) {
      setErrorMessage("Please enter your 5-digit verification code.");
      return;
    }

    setIsVerifying(true);
    try {
      await apiRequest<{ status: string; message: string }>("/auth/verify-email", {
        method: "POST",
        body: JSON.stringify({ token: code.trim() }),
      });

      setSuccessMessage("Email verified successfully! You can now log in.");
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Invalid or expired verification code.");
    } finally {
      setIsVerifying(false);
    }
  }

  async function handleResend() {
    if (!email) return;
    setResending(true);
    setErrorMessage("");
    try {
      await apiRequest<{ status: string; message: string }>("/auth/resend-verification", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setSuccessMessage("A new 5-digit verification code has been sent!");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Could not resend code.");
    } finally {
      setResending(false);
    }
  }

  return (
    <AuthLayout
      heading="Account created, check your inbox."
      description="We sent a 5-digit verification code to confirm your email address."
      successIllustration
    >
      <AuthFormCard title="Verify Your Email" description="Enter the 5-digit code sent to your email.">
        <div className="mb-5 flex items-center gap-3 rounded-2xl border border-[#d8e9d8] bg-[#f1f8f0] p-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#dcefdc] text-[#1B7F4E]">
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
              <path d="m6 12.5 4 4L18.5 8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div>
            <p className="text-sm font-bold text-[#245f38]">Code sent to</p>
            <p className="mt-0.5 text-xs text-[#59735f]">{email || "your registered email"}</p>
          </div>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label htmlFor="verify-code" className="block text-sm font-semibold text-[#29372e] mb-2">
              5-Digit Code
            </label>
            <input
              id="verify-code"
              type="text"
              maxLength={5}
              placeholder="12345"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.replace(/\D/g, ""));
                setErrorMessage("");
              }}
              className="h-14 w-full text-center text-2xl font-bold tracking-[8px] rounded-xl border border-[#d0dad2] bg-white px-4 text-[#1a231d] shadow-sm transition focus:border-[#1B7F4E] focus:outline-none focus:ring-2 focus:ring-[#1B7F4E]/20"
              disabled={isVerifying}
            />
          </div>

          {errorMessage && (
            <p role="alert" className="rounded-xl border border-[#f1d2ce] bg-[#fff5f3] px-3.5 py-3 text-sm text-[#9b3c34]">
              {errorMessage}
            </p>
          )}

          {successMessage && (
            <p role="alert" className="rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] px-3.5 py-3 text-sm text-[#166534]">
              {successMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isVerifying || code.length !== 5}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1B7F4E] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#166b41] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B7F4E] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isVerifying ? (
              <>
                <svg className="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Verifying...</span>
              </>
            ) : (
              "Confirm Code & Log In"
            )}
          </button>
        </form>

        <div className="mt-5 flex items-center justify-between text-xs text-[#68746b]">
          <span>Didn't get the code?</span>
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="font-bold text-[#1B7F4E] hover:text-[#145f3a] disabled:opacity-50"
          >
            {resending ? "Sending..." : "Resend Code"}
          </button>
        </div>
      </AuthFormCard>
    </AuthLayout>
  );
}
