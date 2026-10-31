import { useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "@/components/auth/AuthContext";
import type { AuthUser, ThemePreference, UserPreferences } from "@/components/auth/authTypes";

const SESSION_KEY = "rootine.auth.session";
const PREFERENCES_KEY = "rootine.preferences";
const THEME_KEY = "rootine.theme";

function readThemePreference(): ThemePreference {
  const storedTheme = localStorage.getItem(THEME_KEY);
  if (storedTheme === "light" || storedTheme === "dark" || storedTheme === "system") {
    return storedTheme;
  }
  try {
    const storedPreferences = localStorage.getItem(PREFERENCES_KEY);
    if (storedPreferences) {
      const parsed: unknown = JSON.parse(storedPreferences);
      if (
        typeof parsed === "object" &&
        parsed !== null &&
        "appearance" in parsed &&
        (parsed.appearance === "light" || parsed.appearance === "dark" || parsed.appearance === "system")
      ) {
        return parsed.appearance;
      }
    }
  } catch (error) {
    console.error("Unable to restore the saved theme preference.", error);
  }
  return "light";
}

function removeStoredSession() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error("Unable to clear the stored Rootine session.", error);
  }
}

function readSession(): AuthUser | null {
  try {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (!stored) return null;
    const parsed: unknown = JSON.parse(stored);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "name" in parsed &&
      "email" in parsed &&
      typeof parsed.name === "string" &&
      typeof parsed.email === "string"
    ) {
      return { name: parsed.name, email: parsed.email };
    }
    console.error("Stored Rootine session has an invalid format.");
    removeStoredSession();
  } catch (error) {
    console.error("Unable to restore the Rootine session.", error);
    removeStoredSession();
  }
  return null;
}

function createUser(email: string): AuthUser {
  const normalizedEmail = email.trim().toLowerCase();
  const emailName = normalizedEmail.split("@")[0]?.replace(/[._-]+/g, " ") ?? "";
  const name = emailName
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
  return { name: name || "Rootine member", email: normalizedEmail };
}

function restoreUserPreferences(user: AuthUser): AuthUser {
  const preferences = getStoredPreferences(user);
  return { ...user, name: preferences.displayName };
}

function getStoredPreferences(user: AuthUser): UserPreferences {
  const defaults: UserPreferences = {
    displayName: user.name,
    email: user.email,
    appearance: "light",
    notificationsEnabled: true,
  };
  try {
    const stored = localStorage.getItem(PREFERENCES_KEY);
    if (!stored) return defaults;
    const parsed: unknown = JSON.parse(stored);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "email" in parsed &&
      parsed.email === user.email &&
      "displayName" in parsed &&
      typeof parsed.displayName === "string" &&
      "appearance" in parsed &&
      (parsed.appearance === "light" || parsed.appearance === "dark" || parsed.appearance === "system") &&
      "notificationsEnabled" in parsed &&
      typeof parsed.notificationsEnabled === "boolean"
    ) {
      return {
        displayName: parsed.displayName,
        email: user.email,
        appearance: parsed.appearance,
        notificationsEnabled: parsed.notificationsEnabled,
      };
    }
  } catch (error) {
    console.error("Unable to restore Rootine preferences.", error);
  }
  return defaults;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readSession);
  const [themePreference, setThemePreference] = useState<ThemePreference>(readThemePreference);
  const [isReady] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = () => {
      const useDarkTheme = themePreference === "dark" ||
        (themePreference === "system" && mediaQuery.matches);
      document.documentElement.dataset.theme = useDarkTheme ? "dark" : "light";
    };

    applyTheme();
    mediaQuery.addEventListener("change", applyTheme);
    return () => mediaQuery.removeEventListener("change", applyTheme);
  }, [themePreference]);

  function saveThemePreference(theme: ThemePreference) {
    localStorage.setItem(THEME_KEY, theme);
    setThemePreference(theme);
  }

  function setAuthenticatedUser(nextUser: AuthUser) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  }

  async function login(email: string, password: string) {
    await new Promise((resolve) => window.setTimeout(resolve, 350));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      throw new Error("Enter a valid email address.");
    }
    if (!password) {
      throw new Error("Enter your password.");
    }
    const nextUser = restoreUserPreferences(createUser(email));
    setAuthenticatedUser(nextUser);
    return nextUser;
  }

  async function signup(email: string, password: string) {
    await new Promise((resolve) => window.setTimeout(resolve, 350));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      throw new Error("Enter a valid email address.");
    }
    if (password.length < 8) {
      throw new Error("Use a password with at least 8 characters.");
    }
    const nextUser = restoreUserPreferences(createUser(email));
    setAuthenticatedUser(nextUser);
    return nextUser;
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    setUser(null);
  }

  function updateUser(updates: Pick<AuthUser, "name" | "email">) {
    if (!user) throw new Error("Sign in before updating profile information.");
    const nextUser = { name: updates.name.trim(), email: updates.email.trim().toLowerCase() };
    if (!nextUser.name || !nextUser.email) {
      throw new Error("Display name and email are required.");
    }
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  }

  function savePreferences(preferences: UserPreferences) {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
    saveThemePreference(preferences.appearance);
  }

  function getPreferences() {
    if (!user) throw new Error("Sign in before reading preferences.");
    return getStoredPreferences(user);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isReady,
        themePreference,
        setThemePreference,
        saveThemePreference,
        login,
        signup,
        logout,
        updateUser,
        getPreferences,
        savePreferences,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
