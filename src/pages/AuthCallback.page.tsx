import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Alert, Loader, Stack, Text } from "@mantine/core";
import { IconAlertCircle, IconCheck } from "@tabler/icons-react";
import { supabase } from "../lib/supabase";

export function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "error" | "success">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Note: We no longer extract the OAuth code because Supabase processes it automatically
  // Instead, we get the tokens from the session that Supabase creates

  // Check for desktop mode from URL parameter OR sessionStorage
  // (Supabase might strip the query parameter during OAuth redirect)
  const isDesktopFromUrl = searchParams.get("desktop") === "true";
  const isDesktopFromStorage =
    sessionStorage.getItem("oauth_desktop_mode") === "true";
  const isDesktop = isDesktopFromUrl || isDesktopFromStorage;

  // Clear the sessionStorage flags after reading them
  if (isDesktopFromStorage) {
    sessionStorage.removeItem("oauth_desktop_mode");
  }
  // Clear OAuth in progress flag when we reach callback
  sessionStorage.removeItem("oauth_in_progress");

  console.log("AuthCallback - Desktop mode detection:", {
    fromUrl: isDesktopFromUrl,
    fromStorage: isDesktopFromStorage,
    isDesktop,
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let hasProcessed = false;

    const processSession = async (session: any) => {
      if (hasProcessed) return;
      hasProcessed = true;

      if (!session?.user?.email) {
        console.error("No session or user email");
        setStatus("error");
        setErrorMessage("Failed to complete authentication. Please try again.");
        return;
      }

      // If desktop mode, get tokens from Supabase session and redirect to register page
      if (isDesktop) {
        console.log(
          "Desktop mode detected, getting tokens from Supabase session"
        );

        // Wait a moment for Supabase to process the code and create a session
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Get the session that Supabase created after processing the code
        const {
          data: { session: currentSession },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !currentSession) {
          console.error("Failed to get session:", sessionError);
          setStatus("error");
          setErrorMessage(
            "Failed to get authentication session. Please try logging in again."
          );
          return;
        }

        // Extract both tokens from the session
        const accessToken = currentSession.access_token;
        const refreshToken = currentSession.refresh_token;

        if (!accessToken || !refreshToken) {
          console.error("Session missing tokens:", {
            hasAccessToken: !!accessToken,
            hasRefreshToken: !!refreshToken,
          });
          setStatus("error");
          setErrorMessage(
            "Session tokens not available. Please try logging in again."
          );
          return;
        }

        // Redirect to register page with both tokens
        // Electron app will use these tokens to set the session
        const registerUrl = `/register?access_token=${encodeURIComponent(accessToken)}&refresh_token=${encodeURIComponent(refreshToken)}`;
        console.log("Redirecting to register with session tokens");
        window.location.href = registerUrl;
      } else {
        // Regular web callback - redirect to register
        console.log(
          "Regular web callback (not desktop), redirecting to register"
        );
        window.location.href = "/register";
      }
    };

    // Listen for auth state changes (recommended way to handle OAuth callbacks)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(
        "Auth state change:",
        event,
        session ? "session exists" : "no session"
      );

      if (event === "SIGNED_IN" && session) {
        clearTimeout(timeoutId);
        await processSession(session);
      }
    });

    // Also try to get session immediately (in case it's already available)
    const checkSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Session error:", error);
        }

        if (session?.user?.email) {
          clearTimeout(timeoutId);
          await processSession(session);
        } else {
          // Wait a bit and try again if no session yet
          timeoutId = setTimeout(async () => {
            const {
              data: { session: retrySession },
              error: retryError,
            } = await supabase.auth.getSession();

            if (retryError) {
              console.error("Retry session error:", retryError);
              console.error("URL:", window.location.href);
              setStatus("error");
              setErrorMessage(
                "Failed to complete authentication. Please try again."
              );
            } else if (!retrySession?.user?.email) {
              console.error(
                "No session after retry. URL:",
                window.location.href
              );
              setStatus("error");
              setErrorMessage(
                "Failed to complete authentication. Please try again."
              );
            } else {
              await processSession(retrySession);
            }
          }, 2000);
        }
      } catch (err) {
        console.error("Callback error:", err);
        setStatus("error");
        setErrorMessage("An error occurred during authentication.");
      }
    };

    checkSession();

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [isDesktop]);

  if (status === "loading") {
    return (
      <Stack align="center" justify="center" style={{ minHeight: "100vh" }}>
        <Loader size="lg" />
        <Text>Completing authentication...</Text>
      </Stack>
    );
  }

  if (status === "error") {
    return (
      <Stack
        align="center"
        justify="center"
        style={{ minHeight: "100vh" }}
        p="md"
      >
        <Alert
          icon={<IconAlertCircle size={16} />}
          color="red"
          title="Authentication Error"
        >
          {errorMessage || "An error occurred during authentication"}
        </Alert>
      </Stack>
    );
  }

  if (status === "success") {
    return (
      <Stack
        align="center"
        justify="center"
        style={{ minHeight: "100vh" }}
        p="md"
      >
        <Alert icon={<IconCheck size={16} />} color="green" title="Success">
          <Text>Redirecting to Airscribe desktop app...</Text>
          <Text size="sm" c="dimmed" mt="xs">
            If the app doesn't open automatically, please check that Airscribe
            is installed.
          </Text>
        </Alert>
      </Stack>
    );
  }

  return null;
}
