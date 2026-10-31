import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/components/auth/useAuth";
import { AuthField } from "@/components/auth/AuthField";
import { AuthFormCard } from "@/components/auth/AuthFormCard";
import { AuthPasswordField } from "@/components/auth/AuthPasswordField";
import { AuthLayout } from "@/pages/auth/layout";

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");
    const nextErrors: typeof errors = {};

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (password.length < 8) {
      nextErrors.password = "Use at least 8 characters.";
    }
    if (!confirmPassword || confirmPassword !== password) {
      nextErrors.confirmPassword = "Passwords must match.";
    }
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await signup(email.trim(), password);
        navigate("/account-created", {
          replace: true,
          state: { registrationComplete: true },
        });
      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : "Unable to create your demo account.");
      } finally {
        setIsSubmitting(false);
      }
    }
  }

  return (
    <AuthLayout
      heading="Create your space, stay in flow."
      description="Start with a few small habits and shape a routine that works for you, one day at a time."
    >
      <AuthFormCard title="Create your account" description="A few details are all you need to get started.">
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
              setSubmitError("");
            }}
            error={errors.email}
            disabled={isSubmitting}
          />
          <AuthPasswordField
            label="Password"
            name="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setErrors((current) => ({ ...current, password: undefined }));
              setSubmitError("");
            }}
            error={errors.password}
            disabled={isSubmitting}
          />
          <AuthPasswordField
            label="Confirm password"
            name="confirm-password"
            autoComplete="new-password"
            placeholder="Enter your password again"
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(event.target.value);
              setErrors((current) => ({ ...current, confirmPassword: undefined }));
              setSubmitError("");
            }}
            error={errors.confirmPassword}
            disabled={isSubmitting}
          />
          {submitError && (
            <p role="alert" className="rounded-xl border border-[#f1d2ce] bg-[#fff5f3] px-3.5 py-3 text-sm text-[#9b3c34]">
              {submitError}
            </p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 h-12 w-full rounded-xl bg-[#1B7F4E] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#166b41] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B7F4E] active:translate-y-px disabled:cursor-wait disabled:opacity-70"
          >
            {isSubmitting ? "Checking details..." : "Sign Up"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-[#68746b]">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-[#1B7F4E] hover:text-[#145f3a]">
            Log in
          </Link>
        </p>
      </AuthFormCard>
    </AuthLayout>
  );
}