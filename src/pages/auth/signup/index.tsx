import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/components/auth/useAuth";
import { AuthField } from "@/components/auth/AuthField";
import { AuthFormCard } from "@/components/auth/AuthFormCard";
import { AuthPasswordField } from "@/components/auth/AuthPasswordField";
import { AuthLayout } from "@/pages/auth/layout";
import { COUNTRIES } from "@/data/countries";

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [city, setCity] = useState("");
  const [countryCode, setCountryCode] = useState("PH");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phoneNumber?: string;
    city?: string;
    countryCode?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");
    const nextErrors: typeof errors = {};

    if (!name.trim() || name.trim().length < 3) {
      nextErrors.name = "Enter your full name (at least 3 characters).";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!phoneNumber.trim() || phoneNumber.trim().length < 7) {
      nextErrors.phoneNumber = "Enter a valid phone number.";
    }
    if (!city.trim()) {
      nextErrors.city = "Enter your city.";
    }
    if (password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(password)) {
      nextErrors.password = "Must contain uppercase, lowercase, number, and symbol.";
    }
    if (!confirmPassword || confirmPassword !== password) {
      nextErrors.confirmPassword = "Passwords must match.";
    }
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await signup({
          name: name.trim(),
          email: email.trim(),
          phoneNumber: phoneNumber.trim(),
          city: city.trim(),
          countryCode: countryCode.trim(),
          password,
        });
        // Show pop-up notification
        setShowPopup(true);
      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : "Unable to create your account.");
      } finally {
        setIsSubmitting(false);
      }
    }
  }

  function handleContinueToVerification() {
    setShowPopup(false);
    navigate("/account-created", {
      replace: true,
      state: { registrationComplete: true, email: email.trim() },
    });
  }

  return (
    <AuthLayout
      heading="Create your space, stay in flow."
      description="Start with a few small habits and shape a routine that works for you, one day at a time."
    >
      <AuthFormCard title="Create your account" description="A few details are all you need to get started.">
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <AuthField
            label="Full Name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Kenneth Imperial"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setErrors((current) => ({ ...current, name: undefined }));
              setSubmitError("");
            }}
            error={errors.name}
            disabled={isSubmitting}
          />

          <AuthField
            label="Email Address"
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

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="signup-country" className="block text-sm font-semibold text-[#29372e] mb-1.5">
                Country
              </label>
              <select
                id="signup-country"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="h-12 w-full rounded-xl border border-[#d0dad2] bg-white px-3 text-sm text-[#1a231d] shadow-sm outline-none transition focus:border-[#1B7F4E] focus:ring-2 focus:ring-[#1B7F4E]/20"
                disabled={isSubmitting}
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name} ({c.dial})
                  </option>
                ))}
              </select>
            </div>

            <AuthField
              label="Phone Number"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="09171234567"
              value={phoneNumber}
              onChange={(event) => {
                setPhoneNumber(event.target.value);
                setErrors((current) => ({ ...current, phoneNumber: undefined }));
                setSubmitError("");
              }}
              error={errors.phoneNumber}
              disabled={isSubmitting}
            />
          </div>

          <AuthField
            label="City"
            name="city"
            type="text"
            autoComplete="address-level2"
            placeholder="Cordova, Cebu"
            value={city}
            onChange={(event) => {
              setCity(event.target.value);
              setErrors((current) => ({ ...current, city: undefined }));
              setSubmitError("");
            }}
            error={errors.city}
            disabled={isSubmitting}
          />

          <AuthPasswordField
            label="Password"
            name="password"
            autoComplete="new-password"
            placeholder="At least 8 chars (upper, lower, num, symbol)"
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

          {/* Submit button with loading circle animation */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1B7F4E] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#166b41] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B7F4E] active:translate-y-px disabled:cursor-wait disabled:opacity-75"
          >
            {isSubmitting ? (
              <>
                <svg className="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Creating account...</span>
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#68746b]">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-[#1B7F4E] hover:text-[#145f3a]">
            Log in
          </Link>
        </p>
      </AuthFormCard>

      {/* Pop-up Modal upon Successful Submission */}
      {showPopup && (
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
              <h3 className="text-lg font-bold text-[#111827]">
                Check Your Inbox!
              </h3>
              <p className="mt-2 text-sm text-[#4b5563]">
                A verification code has been sent to your email.
              </p>
              <p className="mt-1 font-semibold text-xs text-[#1B7F4E]">
                {email}
              </p>
              <p className="mt-3 text-xs text-[#9ca3af]">
                We sent you a 5-digit verification code. Please enter it on the next screen to verify your account.
              </p>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleContinueToVerification}
                className="w-full rounded-xl bg-[#1B7F4E] py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#166b41] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B7F4E]"
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
