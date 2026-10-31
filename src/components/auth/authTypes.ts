export type AuthUser = {
  name: string;
  email: string;
};

export type UserPreferences = {
  displayName: string;
  email: string;
  appearance: ThemePreference;
  notificationsEnabled: boolean;
};

export type ThemePreference = "light" | "dark" | "system";
