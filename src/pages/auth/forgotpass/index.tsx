import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { AuthField } from "@/components/auth/AuthField";
import { AuthFormCard } from "@/components/auth/AuthFormCard";
import { AuthPasswordField } from "@/components/auth/AuthPasswordField";
import { useAuth } from "@/components/auth/useAuth";
import { AuthLayout } from "@/pages/auth/layout";
import { apiRequest } from "@/lib/api";

type RecoveryStep = "recover" | "reset" | "changed";

export default function ForgotPasswordPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<RecoveryStep>("recover");
  const [codeSent, setCodeSent] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCodeSentModal, setShowCodeSentModal] = useState(false);

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [navigate, user]);

  async function handleSendCode(event?: FormEvent<HTMLFormElement>) {
    if (event) event.preventDefault();
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address before requesting a code.");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest<{ status: string; message: string }>("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: email.trim() }),
      });
      setCodeSent(true);
      setShowCodeSentModal(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send password reset code.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleProceedToCode() {
    setShowCodeSentModal(false);
  }

  function handleConfirmCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (code.trim().length !== 5) {
      setError("Please enter the 5-digit verification code sent to your email.");
      return;
    }
    setError("");
    setStep("reset");
  }

  async function handleSavePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(newPassword)) {
      setError("Password must contain uppercase, lowercase, number, and special character.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("The password fields do not match.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      await apiRequest<{ status: string; message: string }>("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          code: code.trim(),
          newPassword,
        }),
      });
      setStep("changed");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to reset password. Code may have expired.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (user) return null;

  const pageContent =
    step === "recover" ? (
      !codeSent ? (
        <AuthFormCard
          title="Recover access"
          description="Enter your email to receive a 5-digit password reset code."
        >
          <form onSubmit={handleSendCode} noValidate className="space-y-5">
            <AuthField
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
              }}
              error={error.includes("email") ? error : undefined}
              disabled={isSubmitting}
            />

            {error && !error.includes("email") && (
              <p role="alert" className="rounded-xl border border-[#f1d2ce] bg-[#fff5f3] px-3.5 py-3 text-sm text-[#9b3c34]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1B7F4E] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#166b41] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B7F4E] disabled:cursor-wait disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <svg className="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Sending code...</span>
                </>
              ) : (
                "Send Code to Email"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm">
            <Link to="/login" className="font-bold text-[#1B7F4E] hover:text-[#145f3a]">
              ← Back to Log In
            </Link>
          </p>
        </AuthFormCard>
      ) : (
        <AuthFormCard
          title="Enter 5-digit code"
          description={`We sent a 5-digit verification code to ${email}.`}
        >
          <div className="mb-4 flex items-center justify-between rounded-xl border border-[#d8e8da] bg-[#f2f8f2] px-3.5 py-2.5 text-xs text-[#2e5d3c]">
            <span className="truncate font-medium">{email}</span>
            <button
              type="button"
              onClick={() => {
                setCodeSent(false);
                setError("");
              }}
              className="ml-2 shrink-0 font-bold underline hover:text-[#1B7F4E]"
            >
              Change
            </button>
          </div>

          <form onSubmit={handleConfirmCode} className="space-y-4">
            <div>
              <label htmlFor="verify-code" className="block text-sm font-semibold text-[#29372e] mb-1.5">
                5-Digit Reset Code
              </label>
              <input
                id="verify-code"
                type="text"
                inputMode="numeric"
                maxLength={5}
                placeholder="12345"
                autoFocus
                value={code}
                onChange={(event) => {
                  setCode(event.target.value.replace(/\D/g, "").slice(0, 5));
                  setError("");
                }}
                className="h-12 w-full text-center text-xl font-bold tracking-[8px] rounded-xl border border-[#d0dad2] bg-white px-4 text-[#1a231d] shadow-sm transition focus:border-[#1B7F4E] focus:outline-none focus:ring-2 focus:ring-[#1B7F4E]/20"
                disabled={isSubmitting}
              />
            </div>

            {error && (
              <p role="alert" className="rounded-xl border border-[#f1d2ce] bg-[#fff5f3] px-3.5 py-3 text-sm text-[#9b3c34]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={code.length !== 5 || isSubmitting}
              className="h-12 w-full rounded-xl bg-[#1B7F4E] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#166b41] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B7F4E] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Confirm Code & Continue
            </button>

            <div className="flex items-center justify-between pt-2 text-xs">
              <span className="text-[#657367]">Didn't get the code?</span>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSendCode()}
                className="font-bold text-[#1B7F4E] hover:underline disabled:opacity-50"
              >
                {isSubmitting ? "Sending..." : "Resend Code"}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm">
            <Link to="/login" className="font-bold text-[#1B7F4E] hover:text-[#145f3a]">
              ← Back to Log In
            </Link>
          </p>
        </AuthFormCard>
      )
    ) : step === "reset" ? (
      <AuthFormCard title="Reset password" description={`Choose a new password for ${email.trim()}.`}>
        <form onSubmit={handleSavePassword} noValidate className="space-y-5">
          <AuthPasswordField
            label="New password"
            name="new-password"
            autoComplete="new-password"
            placeholder="At least 8 chars (upper, lower, num, symbol)"
            value={newPassword}
            onChange={(event) => {
              setNewPassword(event.target.value);
              setError("");
            }}
            error={error.includes("8 characters") || error.includes("uppercase") ? error : undefined}
            disabled={isSubmitting}
          />
          <AuthPasswordField
            label="Confirm password"
            name="confirm-new-password"
            autoComplete="new-password"
            placeholder="Enter the new password again"
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(event.target.value);
              setError("");
            }}
            error={error.includes("match") ? error : undefined}
            disabled={isSubmitting}
          />
          {error && !error.includes("8 characters") && !error.includes("uppercase") && !error.includes("match") && (
            <p role="alert" className="rounded-xl border border-[#f1d2ce] bg-[#fff5f3] px-3.5 py-3 text-sm text-[#9b3c34]">{error}</p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1B7F4E] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#166b41] disabled:cursor-wait disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <svg className="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Saving password...</span>
              </>
            ) : (
              "Save New Password"
            )}
          </button>
        </form>
        <p className="mt-6 text-center text-sm">
          <Link to="/login" className="font-bold text-[#1B7F4E] hover:text-[#145f3a]">
            Back to Log In
          </Link>
        </p>
      </AuthFormCard>
    ) : (
      <AuthFormCard title="Password Changed" description="Your password has been successfully updated.">
        <div className="mb-5 flex items-center gap-3 rounded-2xl border border-[#d8e9d8] bg-[#f1f8f0] p-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#dcefdc] text-[#1B7F4E]" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </span>
          <p className="text-sm font-semibold text-[#245f38]">Your new password is now active in your database.</p>
        </div>
        <Link
          to="/login"
          className="flex h-12 w-full items-center justify-center rounded-xl bg-[#1B7F4E] px-5 text-sm font-bold text-white shadow-sm hover:bg-[#166b41]"
        >
          Return to Log In
        </Link>
      </AuthFormCard>
    );

  return (
    <AuthLayout
      heading={
        step === "recover"
          ? "Recover access."
          : step === "reset"
            ? "Choose a new password."
            : "Password changed."
      }
      description={
        step === "changed"
          ? "You're all set to return to the Rootine login screen."
          : "A fresh start is just around the corner. Complete these steps to recover access."
      }
    >
      {pageContent}

      {/* Pop-up modal after sending reset code */}
      {showCodeSentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition-all">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#dcfce7] text-[#15803d]">
              <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h9" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                <path d="m16 19 2 2 4-4" />
              </svg>
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-lg font-bold text-[#111827]">Reset Code Sent!</h3>
              <p className="mt-2 text-sm text-[#4b5563]">
                A 5-digit password reset code has been sent to:
              </p>
              <p className="mt-1 font-semibold text-xs text-[#1B7F4E]">{email}</p>
              <p className="mt-3 text-xs text-[#9ca3af]">
                Please check your inbox (and spam folder) and enter the 5-digit code.
              </p>
            </div>
            <div className="mt-6">
              <button
                type="button"
                onClick={handleProceedToCode}
                className="w-full rounded-xl bg-[#1B7F4E] py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#166b41]"
              >
                Enter 5-Digit Code
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
