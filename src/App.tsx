import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AuthLayout from "@/components/auth/AuthLayout";
import AppLayout from "@/components/layout/AppLayout";
import { HabitProvider } from "@/contexts/HabitContext";

// Auth Pages
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import LandingPage from "@/pages/LandingPage";

// App Pages
import Dashboard from "@/pages/Dashboard";
import CalendarPage from "@/pages/CalendarPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import Settings from "@/pages/Settings";
import ProfilePage from "@/pages/ProfilePage";
import HabitTrackerPage from "@/pages/HabitTrackerPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <HabitProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner position="top-right" />
              
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                
                {/* Auth Routes */}
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                </Route>
                
                {/* Protected App Routes */}
                <Route 
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/calendar" element={<CalendarPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/tracker" element={<HabitTrackerPage />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/profile" element={<ProfilePage />} />
                </Route>
                
                {/* Not Found */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </HabitProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
