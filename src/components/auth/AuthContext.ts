import { createContext } from "react";
import type { AuthUser, ThemePreference, UserPreferences } from "@/components/auth/authTypes";

export type AuthContextValue = {
  user: AuthUser | null;
  isReady: boolean;
  themePreference: ThemePreference;
  setThemePreference: (theme: ThemePreference) => void;
  saveThemePreference: (theme: ThemePreference) => void;
  login: (email: string, password: string) => Promise<AuthUser>;
  signup: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
  updateUser: (updates: Pick<AuthUser, "name" | "email">) => void;
  getPreferences: () => UserPreferences;
  savePreferences: (preferences: UserPreferences) => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
