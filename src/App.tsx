import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/tiptap/styles.css";

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ErrorBoundary, ErrorFallback } from "./components/ErrorBoundary";
import { AuthProvider } from "./contexts/AuthContext";
import { cssVariablesResolver, theme } from "./theme";
import { FinishRegistrationPage } from "./pages/FinishRegistration.page";
import { AuthLoginPage } from "./pages/AuthLogin.page";
import { AuthCallbackPage } from "./pages/AuthCallback.page";
import { SplashPage } from "./pages/Splash.page";

export default function App() {
  return (
    <ErrorBoundary
      fallback={<ErrorFallback />}
      onError={(error, errorInfo) => {
        // Custom error handling logic
        console.error("App-level error:", error, errorInfo);
      }}
    >
      <MantineProvider
        theme={theme}
        defaultColorScheme="auto"
        cssVariablesResolver={cssVariablesResolver}
      >
        <Notifications position="bottom-right" zIndex={10000} />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<SplashPage />} />
              <Route path="/register" element={<FinishRegistrationPage />} />
              <Route path="/auth/login" element={<AuthLoginPage />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
              {/* Redirect all other routes to register */}
              <Route path="*" element={<Navigate to="/register" replace />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </MantineProvider>
    </ErrorBoundary>
  );
}
