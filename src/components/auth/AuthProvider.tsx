import { useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "@/components/auth/AuthContext";
import type { AuthUser, ThemePreference, UserPreferences } from "@/components/auth/authTypes";
import { apiRequest } from "@/lib/api";

const SESSION_KEY = "rootine.auth.session";
const PREFERENCES_KEY = "rootine.preferences";
const THEME_KEY = "rootine.theme";

function readThemePreference(): ThemePreference {
  const storedTheme = localStorage.getItem(THEME_KEY);
  if (storedTheme === "light" || storedTheme === "dark" || storedTheme === "system") {
    return storedTheme;
  }
  return "light";
}

function readSession(): AuthUser | null {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
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
    const parsed = JSON.parse(stored);
    if (parsed && typeof parsed === "object") {
      return { ...defaults, ...parsed };
    }
  } catch {
    // ignore error
  }
  return defaults;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readSession);
  const [themePreference, setThemePreference] = useState<ThemePreference>(readThemePreference);
  const [isReady, setIsReady] = useState(false);

  // Check current user profile from backend on app mount
  useEffect(() => {
    const token = localStorage.getItem("rootine_access_token");
    if (!token) {
      setIsReady(true);
      return;
    }

    apiRequest<{ status: string; data: { user: AuthUser } }>("/auth/me")
      .then((res) => {
        if (res.data?.user) {
          setUser(res.data.user);
          localStorage.setItem(SESSION_KEY, JSON.stringify(res.data.user));
        }
      })
      .catch(() => {
        // Token expired or invalid
        localStorage.removeItem("rootine_access_token");
        localStorage.removeItem("rootine_refresh_token");
        localStorage.removeItem(SESSION_KEY);
        setUser(null);
      })
      .finally(() => {
        setIsReady(true);
      });
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = () => {
      const useDarkTheme =
        themePreference === "dark" || (themePreference === "system" && mediaQuery.matches);
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

  async function login(email: string, password: string): Promise<AuthUser> {
    const response = await apiRequest<{
      status: string;
      message: string;
      data: {
        token: string;
        refreshToken: string;
        user: { id: string; name: string; email: string; emailVerified: boolean };
      };
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: email.trim(), password }),
    });

    const { token, refreshToken, user: loggedInUser } = response.data;
    localStorage.setItem("rootine_access_token", token);
    localStorage.setItem("rootine_refresh_token", refreshToken);
    localStorage.setItem(SESSION_KEY, JSON.stringify(loggedInUser));

    setUser(loggedInUser);
    return loggedInUser;
  }

  async function signup(data: {
    name: string;
    email: string;
    password: string;
    phoneNumber: string;
    city: string;
    countryCode: string;
  }): Promise<void> {
    await apiRequest<{ status: string; message: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password,
        phoneNumber: data.phoneNumber.trim(),
        countryCode: data.countryCode.trim(),
        city: data.city.trim(),
      }),
    });
  }

  async function logout() {
    const refreshToken = localStorage.getItem("rootine_refresh_token");
    if (refreshToken) {
      try {
        await apiRequest("/auth/logout", {
          method: "POST",
          body: JSON.stringify({ refreshToken }),
        });
      } catch {
        // silent fail on logout request
      }
    }
    localStorage.removeItem("rootine_access_token");
    localStorage.removeItem("rootine_refresh_token");
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }

  function updateUser(updates: Pick<AuthUser, "name" | "email">) {
    if (!user) throw new Error("Sign in before updating profile information.");
    const nextUser = { ...user, ...updates };
    localStorage.setItem(SESSION_KEY, JSON.stringify(nextUser));
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
