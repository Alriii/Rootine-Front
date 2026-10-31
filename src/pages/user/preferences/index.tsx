import { useState, useEffect, type FormEvent } from "react";
import { Link } from "react-router";
import { useAuth } from "@/components/auth/useAuth";
import { AddTaskDialog, DashboardHeader, useHomeTasks } from "@/components/shared";
import { Spinner } from "@/components/ui/spinner";
import { apiRequest } from "@/lib/api";

const COUNTRY_OPTIONS = [
  "Philippines",
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Singapore",
  "Japan",
  "Germany",
  "France",
  "South Korea",
  "India",
  "United Arab Emirates",
  "Saudi Arabia",
  "Indonesia",
  "Malaysia",
  "Thailand",
  "Vietnam",
  "New Zealand",
  "Brazil",
  "Mexico",
  "Spain",
  "Italy",
  "Netherlands",
  "Switzerland",
];

const TIMEZONE_OPTIONS = [
  { value: "UTC", label: "(UTC+00:00) UTC — Coordinated Universal Time" },
  { value: "Asia/Manila", label: "(UTC+08:00) Asia/Manila — Philippines" },
  { value: "Asia/Singapore", label: "(UTC+08:00) Asia/Singapore — Singapore" },
  { value: "Asia/Hong_Kong", label: "(UTC+08:00) Asia/Hong_Kong — Hong Kong" },
  { value: "Asia/Tokyo", label: "(UTC+09:00) Asia/Tokyo — Japan / Korea" },
  { value: "Asia/Bangkok", label: "(UTC+07:00) Asia/Bangkok — Thailand / Vietnam / Jakarta" },
  { value: "Asia/Kolkata", label: "(UTC+05:30) Asia/Kolkata — India / Sri Lanka" },
  { value: "Asia/Dubai", label: "(UTC+04:00) Asia/Dubai — UAE / Gulf" },
  { value: "Asia/Riyadh", label: "(UTC+03:00) Asia/Riyadh — Saudi Arabia" },
  { value: "Europe/London", label: "(UTC+00:00) Europe/London — United Kingdom / Ireland" },
  { value: "Europe/Paris", label: "(UTC+01:00) Europe/Paris — France / Germany / Italy" },
  { value: "Europe/Berlin", label: "(UTC+01:00) Europe/Berlin — Central Europe" },
  { value: "Europe/Athens", label: "(UTC+02:00) Europe/Athens — Greece / Eastern Europe" },
  { value: "Europe/Moscow", label: "(UTC+03:00) Europe/Moscow — Russia" },
  { value: "America/New_York", label: "(UTC-05:00) America/New_York — Eastern Time (US & Canada)" },
  { value: "America/Chicago", label: "(UTC-06:00) America/Chicago — Central Time (US & Canada)" },
  { value: "America/Denver", label: "(UTC-07:00) America/Denver — Mountain Time (US & Canada)" },
  { value: "America/Los_Angeles", label: "(UTC-08:00) America/Los_Angeles — Pacific Time (US & Canada)" },
  { value: "America/Anchorage", label: "(UTC-09:00) America/Anchorage — Alaska" },
  { value: "Pacific/Honolulu", label: "(UTC-10:00) Pacific/Honolulu — Hawaii" },
  { value: "America/Sao_Paulo", label: "(UTC-03:00) America/Sao_Paulo — Brazil" },
  { value: "America/Buenos_Aires", label: "(UTC-03:00) America/Buenos_Aires — Argentina" },
  { value: "Australia/Perth", label: "(UTC+08:00) Australia/Perth — Western Australia" },
  { value: "Australia/Sydney", label: "(UTC+10:00) Australia/Sydney — Eastern Australia" },
  { value: "Pacific/Auckland", label: "(UTC+12:00) Pacific/Auckland — New Zealand" },
];

function EyeIcon({ visible }: { visible: boolean }) {
  if (visible) {
    return (
      <svg className="h-4 w-4 text-[#5a7365] hover:text-[#194d33]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }
  return (
    <svg className="h-4 w-4 text-[#8aab97] hover:text-[#194d33]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export default function PreferencesPage({
  isAddTaskOpen = false,
  onCloseAddTask = () => {},
}: {
  isAddTaskOpen?: boolean;
  onCloseAddTask?: () => void;
}) {
  const { user, updateUser, themePreference, setThemePreference, saveThemePreference } = useAuth();
  const taskState = useHomeTasks();

  const [name, setName] = useState(user?.name || "");
  const [phoneNumber, setPhoneNumber] = useState("09123456789");
  const [country, setCountry] = useState("Philippines");
  const [city, setCity] = useState("Cordova");
  const [zipCode, setZipCode] = useState("");
  const [timezone, setTimezone] = useState("Asia/Manila");

  // Email Change
  const [newEmail, setNewEmail] = useState("");
  const [emailToken, setEmailToken] = useState("");
  const [emailStep, setEmailStep] = useState<"idle" | "token_sent">("idle");

  // Password Change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Load user profile from backend on mount
  useEffect(() => {
    apiRequest<{
      status: string;
      data: {
        user: {
          name: string;
          email: string;
          phoneNumber?: string;
          city?: string;
          country?: string;
          zipCode?: string;
          timezone?: string;
        };
      };
    }>("/users/me")
      .then((res) => {
        if (res.data?.user) {
          setName(res.data.user.name || "");
          if (res.data.user.phoneNumber) setPhoneNumber(res.data.user.phoneNumber);
          if (res.data.user.city) setCity(res.data.user.city);
          if (res.data.user.country) setCountry(res.data.user.country);
          if (res.data.user.zipCode) setZipCode(res.data.user.zipCode);
          if (res.data.user.timezone) setTimezone(res.data.user.timezone);
        }
      })
      .catch(() => {});
  }, []);

  async function handleUpdateProfile(e: FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setStatusMessage("");

    if (!name.trim()) {
      setErrorMessage("Display name cannot be empty.");
      return;
    }

    setSavingProfile(true);
    try {
      const res = await apiRequest<{ status: string; message: string; data: { user: { name: string } } }>(
        "/users/me",
        {
          method: "PATCH",
          body: JSON.stringify({
            name: name.trim(),
            phoneNumber: phoneNumber.trim(),
            city: city.trim(),
            country: country.trim(),
            zipCode: zipCode.trim(),
            timezone: timezone.trim(),
          }),
        },
      );
      if (res.data?.user?.name) {
        updateUser({ name: res.data.user.name });
      }
      setStatusMessage(res.message || "Profile details updated successfully!");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleRequestEmailChange(e: FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setStatusMessage("");

    if (!newEmail.trim()) {
      setErrorMessage("Please enter a new email address.");
      return;
    }

    setSavingEmail(true);
    try {
      const res = await apiRequest<{ status: string; message: string }>("/auth/change-email/request", {
        method: "POST",
        body: JSON.stringify({ newEmail: newEmail.trim() }),
      });
      setStatusMessage(res.message || `Verification code sent to ${newEmail}. Please check your inbox.`);
      setEmailStep("token_sent");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to request email change.");
    } finally {
      setSavingEmail(false);
    }
  }

  async function handleConfirmEmailChange(e: FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setStatusMessage("");

    if (!emailToken.trim()) {
      setErrorMessage("Please enter the verification code sent to your new email.");
      return;
    }

    setSavingEmail(true);
    try {
      const res = await apiRequest<{ status: string; message: string }>("/auth/change-email/confirm", {
        method: "POST",
        body: JSON.stringify({ token: emailToken.trim() }),
      });
      setStatusMessage(res.message || "Email address updated! Please sign in with your new email.");
      setEmailStep("idle");
      setNewEmail("");
      setEmailToken("");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Invalid or expired token.");
    } finally {
      setSavingEmail(false);
    }
  }

  async function handleChangePassword(e: FormEvent) {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setSavingPassword(true);
    try {
      const res = await apiRequest<{ status: string; message: string }>("/auth/change-password", {
        method: "POST",
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });
      setPasswordSuccess(res.message || "Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setTimeout(() => {
        setPasswordSuccess("");
      }, 6000);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Failed to change password.");
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f2f6f2]">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-9 lg:py-8">
        <DashboardHeader
          title="Account Settings & Preferences"
          subtitle="Manage your profile, credentials, and app preferences."
        />

        {statusMessage && (
          <div className="mt-5 max-w-3xl rounded-xl border border-[#b8d9c6] bg-[#e8f5ee] p-4 text-sm font-semibold text-[#1a6b40]">
            ✓ {statusMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mt-5 max-w-3xl rounded-xl border border-[#fca5a5] bg-[#fef2f2] p-4 text-sm font-medium text-[#b91c1c]">
            {errorMessage}
          </div>
        )}

        <div className="mt-6 max-w-3xl space-y-6">
          {/* Profile Information */}
          <form onSubmit={handleUpdateProfile} className="rounded-2xl border border-[#d8e8df] bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-base font-bold text-[#0d1f18]">Profile details</h2>
            <p className="mt-0.5 text-xs text-[#4d6658]">Update your personal information saved in your account.</p>
            <div className="mt-4 grid gap-3.5 sm:grid-cols-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4d6658]">
                Display Name
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 h-10 w-full rounded-xl border border-[#d8e8df] px-3.5 text-sm font-medium text-[#0d1f18] outline-none transition focus:border-[#1e7a4a] focus:ring-2 focus:ring-[#1e7a4a]/10"
                />
              </label>

              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4d6658]">
                Phone Number
                <input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="mt-1.5 h-10 w-full rounded-xl border border-[#d8e8df] px-3.5 text-sm font-medium text-[#0d1f18] outline-none transition focus:border-[#1e7a4a] focus:ring-2 focus:ring-[#1e7a4a]/10"
                />
              </label>

              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4d6658]">
                Country
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="mt-1.5 h-10 w-full rounded-xl border border-[#d8e8df] bg-white px-3.5 text-sm font-medium text-[#0d1f18] outline-none transition focus:border-[#1e7a4a] focus:ring-2 focus:ring-[#1e7a4a]/10"
                >
                  {country && !COUNTRY_OPTIONS.includes(country) && (
                    <option value={country}>{country}</option>
                  )}
                  {COUNTRY_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4d6658]">
                City
                <input
                  value={city}
                  placeholder="e.g. Cordova"
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-1.5 h-10 w-full rounded-xl border border-[#d8e8df] px-3.5 text-sm font-medium text-[#0d1f18] outline-none transition focus:border-[#1e7a4a] focus:ring-2 focus:ring-[#1e7a4a]/10"
                />
              </label>

              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4d6658]">
                Zip Code
                <input
                  value={zipCode}
                  placeholder="e.g. 6017"
                  onChange={(e) => setZipCode(e.target.value)}
                  className="mt-1.5 h-10 w-full rounded-xl border border-[#d8e8df] px-3.5 text-sm font-medium text-[#0d1f18] outline-none transition focus:border-[#1e7a4a] focus:ring-2 focus:ring-[#1e7a4a]/10"
                />
              </label>

              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4d6658]">
                Timezone
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="mt-1.5 h-10 w-full rounded-xl border border-[#d8e8df] bg-white px-3.5 text-sm font-medium text-[#0d1f18] outline-none transition focus:border-[#1e7a4a] focus:ring-2 focus:ring-[#1e7a4a]/10"
                >
                  {timezone && !TIMEZONE_OPTIONS.some((tz) => tz.value === timezone) && (
                    <option value={timezone}>{timezone}</option>
                  )}
                  {TIMEZONE_OPTIONS.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <button
              type="submit"
              disabled={savingProfile || !name.trim()}
              className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1e7a4a] to-[#15803d] px-5 text-xs font-bold text-white shadow-sm transition hover:from-[#196640] hover:to-[#126835] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {savingProfile ? (
                <>
                  <Spinner className="h-4 w-4 text-white" />
                  <span>Saving Profile...</span>
                </>
              ) : (
                "Update Profile"
              )}
            </button>
          </form>

          {/* Change Email */}
          <section className="rounded-2xl border border-[#d8e8df] bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-base font-bold text-[#0d1f18]">Email address</h2>
            <p className="mt-0.5 text-xs text-[#4d6658]">
              Current email: <strong className="text-[#0d1f18]">{user?.email}</strong>
            </p>

            {emailStep === "idle" ? (
              <form onSubmit={handleRequestEmailChange} className="mt-4 flex flex-wrap gap-2.5">
                <input
                  type="email"
                  placeholder="new-email@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="h-10 flex-1 min-w-[240px] rounded-xl border border-[#d8e8df] px-3.5 text-sm font-medium text-[#0d1f18] outline-none transition focus:border-[#1e7a4a] focus:ring-2 focus:ring-[#1e7a4a]/10"
                />
                <button
                  type="submit"
                  disabled={savingEmail || !newEmail.trim()}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#b8d9c6] bg-[#e8f5ee] px-4 text-xs font-bold text-[#1a6b40] transition hover:bg-[#d1ead9] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {savingEmail ? (
                    <>
                      <Spinner className="h-3.5 w-3.5 text-[#1a6b40]" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    "Request Email Change"
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleConfirmEmailChange} className="mt-4 space-y-3">
                <p className="text-xs text-[#4d6658]">
                  Enter the verification token sent to <strong>{newEmail}</strong>:
                </p>
                <input
                  type="text"
                  placeholder="Paste token here"
                  value={emailToken}
                  onChange={(e) => setEmailToken(e.target.value)}
                  className="h-10 w-full rounded-xl border border-[#d8e8df] px-3.5 text-sm font-medium text-[#0d1f18] outline-none transition focus:border-[#1e7a4a] focus:ring-2 focus:ring-[#1e7a4a]/10"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={savingEmail || !emailToken.trim()}
                    className="h-10 rounded-xl bg-gradient-to-r from-[#1e7a4a] to-[#15803d] px-4 text-xs font-bold text-white shadow-sm transition hover:from-[#196640] hover:to-[#126835] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirm New Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmailStep("idle")}
                    className="h-10 rounded-xl border border-[#d8e8df] px-4 text-xs font-semibold text-[#4d6658] hover:bg-[#f4f8f5]"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </section>

          {/* Change Password */}
          <form onSubmit={handleChangePassword} className="rounded-2xl border border-[#d8e8df] bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-base font-bold text-[#0d1f18]">Change password</h2>
            <p className="mt-0.5 text-xs text-[#4d6658]">Update your password to keep your account secure.</p>

            {passwordSuccess && (
              <div className="mt-3.5 flex items-center gap-2 rounded-xl border border-[#b8d9c6] bg-[#e8f5ee] px-3.5 py-2.5 text-xs font-semibold text-[#1a6b40]">
                <svg className="h-4 w-4 shrink-0 text-[#1a6b40]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{passwordSuccess}</span>
              </div>
            )}

            {passwordError && (
              <div className="mt-3.5 flex items-center gap-2 rounded-xl border border-[#fca5a5] bg-[#fef2f2] px-3.5 py-2.5 text-xs font-semibold text-[#b91c1c]">
                <svg className="h-4 w-4 shrink-0 text-[#b91c1c]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{passwordError}</span>
              </div>
            )}

            <div className="mt-4 grid gap-2.5 max-w-md">
              <div className="relative">
                <input
                  type={showCurrentPw ? "text" : "password"}
                  placeholder="Current password"
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    setPasswordSuccess("");
                    setPasswordError("");
                  }}
                  className="h-10 w-full rounded-xl border border-[#d8e8df] pl-3.5 pr-10 text-sm font-medium text-[#0d1f18] outline-none transition focus:border-[#1e7a4a] focus:ring-2 focus:ring-[#1e7a4a]/10"
                />
                <button
                  type="button"
                  aria-label={showCurrentPw ? "Hide current password" : "Show current password"}
                  onClick={() => setShowCurrentPw((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-[#8aab97] transition hover:bg-[#eaf3eb]"
                >
                  <EyeIcon visible={showCurrentPw} />
                </button>
              </div>

              <div className="relative">
                <input
                  type={showNewPw ? "text" : "password"}
                  placeholder="New password (at least 8 chars)"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setPasswordSuccess("");
                    setPasswordError("");
                  }}
                  className="h-10 w-full rounded-xl border border-[#d8e8df] pl-3.5 pr-10 text-sm font-medium text-[#0d1f18] outline-none transition focus:border-[#1e7a4a] focus:ring-2 focus:ring-[#1e7a4a]/10"
                />
                <button
                  type="button"
                  aria-label={showNewPw ? "Hide new password" : "Show new password"}
                  onClick={() => setShowNewPw((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-[#8aab97] transition hover:bg-[#eaf3eb]"
                >
                  <EyeIcon visible={showNewPw} />
                </button>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPw ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmNewPassword}
                  onChange={(e) => {
                    setConfirmNewPassword(e.target.value);
                    setPasswordSuccess("");
                    setPasswordError("");
                  }}
                  className="h-10 w-full rounded-xl border border-[#d8e8df] pl-3.5 pr-10 text-sm font-medium text-[#0d1f18] outline-none transition focus:border-[#1e7a4a] focus:ring-2 focus:ring-[#1e7a4a]/10"
                />
                <button
                  type="button"
                  aria-label={showConfirmPw ? "Hide confirm password" : "Show confirm password"}
                  onClick={() => setShowConfirmPw((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-[#8aab97] transition hover:bg-[#eaf3eb]"
                >
                  <EyeIcon visible={showConfirmPw} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={savingPassword || !currentPassword.trim() || !newPassword.trim() || !confirmNewPassword.trim()}
              className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1e7a4a] to-[#15803d] px-5 text-xs font-bold text-white shadow-sm transition hover:from-[#196640] hover:to-[#126835] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {savingPassword ? (
                <>
                  <Spinner className="h-4 w-4 text-white" />
                  <span>Updating Password...</span>
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </form>

          {/* Appearance Preference */}
          <section className="rounded-2xl border border-[#d8e8df] bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-base font-bold text-[#0d1f18]">Appearance</h2>
            <p className="mt-0.5 text-xs text-[#4d6658]">Choose a display theme for your workspace.</p>
            <label className="mt-3 block max-w-sm text-xs font-semibold uppercase tracking-wider text-[#4d6658]">
              Color theme
              <select
                value={themePreference}
                onChange={(e) => {
                  const val = e.target.value as "light" | "dark" | "system";
                  setThemePreference(val);
                  saveThemePreference(val);
                }}
                className="mt-1.5 h-10 w-full rounded-xl border border-[#d8e8df] bg-white px-3.5 text-sm font-medium text-[#0d1f18] outline-none transition focus:border-[#1e7a4a] focus:ring-2 focus:ring-[#1e7a4a]/10"
              >
                <option value="light">Light (Fresh & Cozy)</option>
                <option value="dark">Dark</option>
                <option value="system">Match device setting</option>
              </select>
            </label>
          </section>

          <div>
            <Link to="/" className="inline-block rounded-lg px-2 py-1 text-xs font-semibold text-[#4d6658] hover:text-[#1e7a4a]">
              ← Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
      <AddTaskDialog
        open={isAddTaskOpen}
        onClose={onCloseAddTask}
        onCreate={taskState.createTask}
      />
    </div>
  );
}
