import "@/styles/global.css";

import { useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Sidebar } from "@/components/shared";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { useAuth } from "@/components/auth/useAuth";
import HomePage from "@/pages/user/home";
import UpcomingPage from "@/pages/user/upcoming";
import CompletedPage from "@/pages/user/completed";
import PreferencesPage from "@/pages/user/preferences";
import type { DashboardSection } from "@/components/dashboard";
import LoginPage from "@/pages/auth/login";
import SignupPage from "@/pages/auth/signup";
import ForgotPasswordPage from "@/pages/auth/forgotpassword";
import AccountCreatedPage from "@/pages/auth/account-created";

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

function AppContent() {
  const { user, isReady } = useAuth();
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<DashboardSection>("today");

  const homePageProps = {
    isAddTaskOpen,
    onCloseAddTask: () => setIsAddTaskOpen(false),
    activeSection,
    onSectionChange: setActiveSection,
  };

  if (!isReady) return null;

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/forgotpass" element={<ForgotPasswordPage />} />
      <Route path="/account-created" element={<AccountCreatedPage />} />
      <Route
        path="/*"
        element={
          user ? (
          <div className="flex h-screen min-h-0 flex-col overflow-hidden md:flex-row">
            <Sidebar
              onAddTask={() => setIsAddTaskOpen(true)}
              onNavigate={() => setActiveSection("today")}
            />
            <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">
              <Routes>
                <Route path="/" element={<HomePage {...homePageProps} />} />
                <Route path="/upcoming" element={<UpcomingPage {...homePageProps} />} />
                <Route path="/completed" element={<CompletedPage {...homePageProps} />} />
                <Route
                  path="/preferences"
                  element={
                    <PreferencesPage
                      isAddTaskOpen={isAddTaskOpen}
                      onCloseAddTask={() => setIsAddTaskOpen(false)}
                    />
                  }
                />
              </Routes>
            </main>
          </div>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
