import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/components/auth/useAuth";
import { AuthField } from "@/components/auth/AuthField";
import { AuthFormCard } from "@/components/auth/AuthFormCard";
import { AuthPasswordField } from "@/components/auth/AuthPasswordField";
import { AuthLayout } from "@/pages/auth/layout";

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [navigate, user]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
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
        setMessage(error instanceof Error ? error.message : "Unable to sign in. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
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
            <p role="alert" className="rounded-xl border border-[#f1d2ce] bg-[#fff5f3] px-3.5 py-3 text-sm leading-5 text-[#9b3c34]">
              {message}
            </p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full rounded-xl bg-[#1B7F4E] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#166b41] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B7F4E] active:translate-y-px disabled:cursor-wait disabled:opacity-70"
          >
            {isSubmitting ? "Signing in..." : "Log In"}
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