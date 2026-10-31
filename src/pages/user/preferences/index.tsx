import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import {
  type UserPreferences,
} from "@/components/auth/authTypes";
import { useAuth } from "@/components/auth/useAuth";
import { AddTaskDialog, DashboardHeader, useHomeTasks } from "@/components/shared";

export default function PreferencesPage({
  isAddTaskOpen = false,
  onCloseAddTask = () => {},
}: {
  isAddTaskOpen?: boolean;
  onCloseAddTask?: () => void;
}) {
  const {
    getPreferences,
    savePreferences,
    updateUser,
    setThemePreference,
  } = useAuth();
  const taskState = useHomeTasks();
  const [preferences, setPreferences] = useState<UserPreferences>(() => getPreferences());
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  function update<K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) {
    setPreferences((current) => ({ ...current, [key]: value }));
    if (key === "appearance") setThemePreference(value as UserPreferences["appearance"]);
    setError("");
    setSaved(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(preferences.email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    if (!preferences.displayName.trim()) {
      setError("Display name is required.");
      return;
    }

    try {
      const nextPreferences = {
        ...preferences,
        displayName: preferences.displayName.trim(),
        email: preferences.email.trim().toLowerCase(),
      };
      updateUser({ name: nextPreferences.displayName, email: nextPreferences.email });
      savePreferences(nextPreferences);
      setPreferences(nextPreferences);
      setSaved(true);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save preferences.");
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFCFA]">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-9 lg:py-8">
        <DashboardHeader
          title="Preferences"
          subtitle="Personalize your Rootine experience."
          search=""
          showSearch={false}
        />
        <div className="mt-6 max-w-3xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-bold text-[#0F172A]">Profile information</h2>
              <p className="mt-1 text-sm text-[#64748B]">Update the name and email shown in your account menu.</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-[#334155]">
                  Display name
                  <input
                    value={preferences.displayName}
                    onChange={(event) => update("displayName", event.target.value)}
                    autoComplete="name"
                    className="mt-2 h-11 w-full rounded-xl border border-[#E2E8F0] px-3.5 text-sm text-[#0F172A] outline-none focus:border-[#2E7D52] focus:ring-4 focus:ring-[#2E7D52]/10"
                  />
                </label>
                <label className="block text-sm font-medium text-[#334155]">
                  Email
                  <input
                    type="email"
                    value={preferences.email}
                    onChange={(event) => update("email", event.target.value)}
                    autoComplete="email"
                    className="mt-2 h-11 w-full rounded-xl border border-[#E2E8F0] px-3.5 text-sm text-[#0F172A] outline-none focus:border-[#2E7D52] focus:ring-4 focus:ring-[#2E7D52]/10"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-bold text-[#0F172A]">Appearance</h2>
              <p className="mt-1 text-sm text-[#64748B]">Choose a display preference for your workspace.</p>
              <label className="mt-5 block max-w-sm text-sm font-medium text-[#334155]">
                Color theme
                <select
                  value={preferences.appearance}
                  onChange={(event) => update("appearance", event.target.value as UserPreferences["appearance"])}
                  className="mt-2 h-11 w-full rounded-xl border border-[#E2E8F0] bg-white px-3.5 text-sm text-[#0F172A] outline-none focus:border-[#2E7D52] focus:ring-4 focus:ring-[#2E7D52]/10"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">Match device setting</option>
                </select>
              </label>
              <p className="mt-2 text-xs text-[#849087]">Theme changes apply immediately and are stored when you save preferences.</p>
            </section>

            <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-bold text-[#0F172A]">Notifications</h2>
              <label className="mt-4 flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={preferences.notificationsEnabled}
                  onChange={(event) => update("notificationsEnabled", event.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-[#2E7D52]"
                />
                <span>
                  <span className="block text-sm font-medium text-[#334155]">Enable reminders</span>
                  <span className="mt-1 block text-xs leading-5 text-[#64748B]">Save your reminder preference for a future notification integration. No notifications are sent by this prototype.</span>
                </span>
              </label>
            </section>

            {error && (
              <p role="alert" className="rounded-xl border border-[#f1d2ce] bg-[#fff5f3] px-4 py-3 text-sm text-[#9b3c34]">
                {error}
              </p>
            )}
            {saved && (
              <p role="status" className="rounded-xl border border-[#d8e9d8] bg-[#f1f8f0] px-4 py-3 text-sm text-[#326440]">
                Preferences saved in this browser.
              </p>
            )}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className="h-11 rounded-xl bg-[#2E7D52] px-5 text-sm font-semibold text-white transition hover:bg-[#246742] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E7D52]"
              >
                Save Preferences
              </button>
              <Link to="/" className="rounded-lg px-3 py-2 text-sm font-semibold text-[#64748B] hover:text-[#2E7D52]">
                Back to Home
              </Link>
            </div>
          </form>
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
