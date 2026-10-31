import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { AuthField } from "@/components/auth/AuthField";
import { AuthFormCard } from "@/components/auth/AuthFormCard";
import { AuthPasswordField } from "@/components/auth/AuthPasswordField";
import { useAuth } from "@/components/auth/useAuth";
import { AuthLayout } from "@/pages/auth/layout";

type RecoveryStep = "recover" | "reset" | "changed";

export default function ForgotPasswordPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<RecoveryStep>("recover");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [demoCode, setDemoCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [navigate, user]);

  async function handleSendCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address before requesting a code.");
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => window.setTimeout(resolve, 350));
    setDemoCode(String(Math.floor(100000 + Math.random() * 900000)));
    setCode("");
    setModalOpen(true);
    setIsSubmitting(false);
  }

  function handleConfirmCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (code.trim() !== demoCode) {
      setError("That verification code does not match. Check the demo code and try again.");
      return;
    }
    setError("");
    setStep("reset");
  }

  async function handleSavePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (newPassword.length < 8) {
      setError("Use at least 8 characters for your new password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("The password fields do not match.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    await new Promise((resolve) => window.setTimeout(resolve, 350));
    setIsSubmitting(false);
    setStep("changed");
  }

  if (user) return null;

  const pageContent = step === "recover" ? (
    <AuthFormCard title="Recover access" description="Enter your email, then verify the code shown in this frontend demo.">
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
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full rounded-xl bg-[#1B7F4E] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#166b41] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B7F4E] disabled:cursor-wait disabled:opacity-70"
        >
          {isSubmitting ? "Preparing code..." : "Send Code"}
        </button>
      </form>

      <form onSubmit={handleConfirmCode} className="mt-5 space-y-4">
        <AuthField
          label="Verification code"
          name="verification-code"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="Enter the 6-digit demo code"
          value={code}
          onChange={(event) => {
            setCode(event.target.value.replace(/\D/g, "").slice(0, 6));
            setError("");
          }}
          error={error.includes("code") ? error : undefined}
          disabled={!demoCode || isSubmitting}
        />
        <button
          type="submit"
          disabled={!demoCode || isSubmitting}
          className="h-12 w-full rounded-xl border border-[#B8D9C1] bg-[#EDF6EE] px-5 text-sm font-bold text-[#2E7D52] transition hover:bg-[#e2f0e4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B7F4E] disabled:cursor-not-allowed disabled:opacity-60"
        >
          Confirm Code
        </button>
      </form>
      {error && !error.includes("email") && !error.includes("code") && (
        <p role="alert" className="mt-4 text-sm text-[#b42318]">{error}</p>
      )}
      <p className="mt-6 text-center text-sm">
        <Link to="/login" className="font-bold text-[#1B7F4E] hover:text-[#145f3a]">
          ← Back to Log In
        </Link>
      </p>
    </AuthFormCard>
  ) : step === "reset" ? (
    <AuthFormCard title="Reset password" description={`Choose a new password for ${email.trim()}.`}>
      <form onSubmit={handleSavePassword} noValidate className="space-y-5">
        <AuthPasswordField
          label="New password"
          name="new-password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={newPassword}
          onChange={(event) => {
            setNewPassword(event.target.value);
            setError("");
          }}
          error={error.includes("8 characters") ? error : undefined}
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
        {error && <p role="alert" className="text-sm text-[#b42318]">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full rounded-xl bg-[#1B7F4E] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#166b41] disabled:cursor-wait disabled:opacity-70"
        >
          {isSubmitting ? "Saving..." : "Save New Password"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm">
        <Link to="/login" className="font-bold text-[#1B7F4E] hover:text-[#145f3a]">
          Back to Log In
        </Link>
      </p>
    </AuthFormCard>
  ) : (
    <AuthFormCard title="Password Changed" description="The password reset demo is complete.">
      <div className="mb-5 flex items-center gap-3 rounded-2xl border border-[#d8e9d8] bg-[#f1f8f0] p-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#dcefdc] text-[#1B7F4E]" aria-hidden="true">
          ✓
        </span>
        <p className="text-sm font-semibold text-[#245f38]">Your new password passed validation.</p>
      </div>
      <p className="mb-6 text-sm leading-6 text-[#68746b]">
        This frontend prototype does not save credentials or change an account password.
      </p>
      <Link
        to="/login"
        className="flex h-12 w-full items-center justify-center rounded-xl bg-[#1B7F4E] px-5 text-sm font-bold text-white hover:bg-[#166b41]"
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
          ? "You’re all set to return to the Rootine login screen."
          : "A fresh start is just around the corner. Complete these steps to recover access."
      }
    >
      {pageContent}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/45 p-4 backdrop-blur-[2px]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setModalOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="recovery-code-title"
            className="w-full max-w-md rounded-3xl border border-[#e4e9e1] bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EDF6EE] text-[#2E7D52]" aria-hidden="true">
              <span className="text-xl">✓</span>
            </div>
            <h2 id="recovery-code-title" className="text-xl font-bold text-[#17231c]">Code ready for this demo</h2>
            <p className="mt-2 text-sm leading-6 text-[#68746b]">
              No email was sent. Use this temporary verification code to continue:
            </p>
            <p className="my-4 rounded-xl border border-dashed border-[#B8D9C1] bg-[#EDF6EE] px-4 py-3 text-center font-mono text-2xl font-bold tracking-[0.3em] text-[#2E7D52]">
              {demoCode}
            </p>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="h-11 w-full rounded-xl bg-[#1B7F4E] px-4 text-sm font-bold text-white hover:bg-[#166b41]"
            >
              Enter Verification Code
            </button>
          </section>
        </div>
      )}
    </AuthLayout>
  );
}
