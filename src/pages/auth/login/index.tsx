import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/components/auth/useAuth";
import { AuthField } from "@/components/auth/AuthField";
import { AuthFormCard } from "@/components/auth/AuthFormCard";
import { AuthPasswordField } from "@/components/auth/AuthPasswordField";
import { AuthLayout } from "@/pages/auth/layout";
import { apiRequest } from "@/lib/api";

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendNotice, setResendNotice] = useState("");

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [navigate, user]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setResendNotice("");
    setNeedsVerification(false);
    const nextErrors: typeof errors = {};

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!password) {
      nextErrors.password = "Enter your password.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await login(email.trim(), password);
        navigate("/", { replace: true });
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Unable to sign in. Please try again.";
        setMessage(errorMsg);
        if (errorMsg.toLowerCase().includes("verify your email")) {
          setNeedsVerification(true);
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  }

  async function handleResendCode() {
    setResending(true);
    setResendNotice("");
    try {
      await apiRequest<{ status: string; message: string }>("/auth/resend-verification", {
        method: "POST",
        body: JSON.stringify({ email: email.trim() }),
      });
      setResendNotice("A new 5-digit code has been sent to your email!");
    } catch (err) {
      setResendNotice(err instanceof Error ? err.message : "Unable to resend verification code.");
    } finally {
      setResending(false);
    }
  }

  if (user) return null;

  return (
    <AuthLayout
      heading="Small steps make big things happen."
      description="Build routines that support the life you want. Pick up where you left off and keep moving forward."
    >
      <AuthFormCard title="Welcome back" description="Log in to continue building your routine.">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <AuthField
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setErrors((current) => ({ ...current, email: undefined }));
              setMessage("");
              setNeedsVerification(false);
            }}
            error={errors.email}
            disabled={isSubmitting}
          />
          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label htmlFor="login-password" className="text-sm font-semibold text-[#29372e]">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-[#1B7F4E] hover:text-[#145f3a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B7F4E]"
              >
                Forgot password?
              </Link>
            </div>
            <AuthPasswordField
              label="Password"
              id="login-password"
              name="password"
              hideLabel
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setErrors((current) => ({ ...current, password: undefined }));
                setMessage("");
              }}
              error={errors.password}
              disabled={isSubmitting}
            />
          </div>

          {message && (
            <div role="alert" className="rounded-xl border border-[#f1d2ce] bg-[#fff5f3] p-4 text-sm text-[#9b3c34]">
              <p className="font-medium">{message}</p>
              {needsVerification && (
                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[#f1d2ce] pt-3">
                  <button
                    type="button"
                    onClick={() =>
                      navigate("/account-created", {
                        state: { registrationComplete: true, email: email.trim() },
                      })
                    }
                    className="rounded-lg bg-[#1B7F4E] px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-[#166b41]"
                  >
                    Enter 5-Digit Code
                  </button>
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={resending}
                    className="rounded-lg border border-[#d0dad2] bg-white px-3.5 py-1.5 text-xs font-bold text-[#1B7F4E] transition hover:bg-[#f1f8f0] disabled:opacity-50"
                  >
                    {resending ? "Sending..." : "Resend Code"}
                  </button>
                </div>
              )}
            </div>
          )}

          {resendNotice && (
            <p role="status" className="rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] px-3.5 py-3 text-xs text-[#166534]">
              {resendNotice}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1B7F4E] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#166b41] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B7F4E] active:translate-y-px disabled:cursor-wait disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <svg className="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Signing in...</span>
              </>
            ) : (
              "Log In"
            )}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-[#68746b]">
          New to Rootine?{" "}
          <Link to="/signup" className="font-bold text-[#1B7F4E] hover:text-[#145f3a]">
            Sign up
          </Link>
        </p>
      </AuthFormCard>
    </AuthLayout>
  );
}
