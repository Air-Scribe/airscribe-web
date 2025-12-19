import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Alert, Loader, Stack, Text, Code } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { supabase } from "../lib/supabase";

export function AuthLoginPage() {
  const [searchParams] = useSearchParams();
  const isDesktop = searchParams.get("desktop") === "true";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addDebugInfo = useCallback((message: string) => {
    console.log(message);
    setDebugInfo((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  }, []);

  useEffect(() => {
    const handleLogin = async () => {
      addDebugInfo("Page loaded, checking desktop mode...");

      if (!isDesktop) {
        addDebugInfo("Not desktop mode, redirecting to register");
        window.location.href = "/register";
        return;
      }

      addDebugInfo("Desktop mode detected");

      // Check if OAuth is already in progress (prevent duplicate OAuth flows)
      const oauthInProgress = sessionStorage.getItem("oauth_in_progress");
      if (oauthInProgress) {
        addDebugInfo("OAuth already in progress, waiting...");
        // Don't trigger another OAuth flow
        return;
      }

      // Mark OAuth as in progress
      sessionStorage.setItem("oauth_in_progress", "true");

      // Store desktop mode flag in sessionStorage so callback page can detect it
      sessionStorage.setItem("oauth_desktop_mode", "true");

      // Check Supabase configuration
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      addDebugInfo(`Supabase URL: ${supabaseUrl ? "✓ Set" : "✗ Missing"}`);
      addDebugInfo(
        `Supabase Anon Key: ${supabaseAnonKey ? "✓ Set" : "✗ Missing"}`
      );

      if (
        !supabaseUrl ||
        supabaseUrl.includes("stub") ||
        !supabaseAnonKey ||
        supabaseAnonKey.includes("stub")
      ) {
        setError(
          "Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables."
        );
        setLoading(false);
        return;
      }

      // Set a timeout to detect if the OAuth call is hanging
      const timeoutId = setTimeout(() => {
        addDebugInfo("⚠ OAuth call is taking longer than expected...");
        setError(
          "OAuth request is taking too long. This might indicate a network issue or Supabase configuration problem. Check the browser console for more details."
        );
        setLoading(false);
      }, 10000); // 10 second timeout

      try {
        const redirectTo = `${window.location.origin}/auth/callback?desktop=true`;
        addDebugInfo(`Preparing OAuth with redirectTo: ${redirectTo}`);

        // Start Google OAuth with desktop callback
        // Important: redirectTo must be a web URL, not a deep link
        // The deep link redirect happens AFTER OAuth completes in the callback page
        addDebugInfo("Calling supabase.auth.signInWithOAuth...");

        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo,
            skipBrowserRedirect: false, // Ensure it goes through browser OAuth flow
          },
        });

        clearTimeout(timeoutId);

        if (error) {
          addDebugInfo(`✗ OAuth error: ${error.message}`);
          setError(`Failed to start authentication: ${error.message}`);
          setLoading(false);
          return;
        }

        addDebugInfo(
          `✓ OAuth response received: ${data ? "has data" : "no data"}`
        );

        // Redirect to the OAuth URL
        if (data?.url) {
          addDebugInfo(`Full OAuth URL: ${data.url}`);
          addDebugInfo(
            `Redirecting to Google OAuth: ${data.url.substring(0, 100)}...`
          );

          // Log the full URL for debugging
          console.log("Supabase OAuth URL:", data.url);

          // Clear the in-progress flag before redirecting (it will be set again if needed)
          sessionStorage.removeItem("oauth_in_progress");

          // Use a small delay to ensure debug info is visible
          setTimeout(() => {
            window.location.href = data.url;
          }, 100);
        } else {
          addDebugInfo("✗ No URL in OAuth response");
          setError(
            "Failed to get OAuth URL. Please check your Supabase configuration:\n" +
              "1. Ensure Google OAuth is enabled in Supabase\n" +
              "2. Ensure the redirect URL is whitelisted\n" +
              "3. Check your Google OAuth credentials in Supabase"
          );
          setLoading(false);
        }
      } catch (err) {
        clearTimeout(timeoutId);
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        addDebugInfo(`✗ Unexpected error: ${errorMessage}`);
        setError(`An unexpected error occurred: ${errorMessage}`);
        setLoading(false);
      }
    };

    handleLogin();
  }, [isDesktop, addDebugInfo]);

  if (error) {
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
          {error}
        </Alert>
        <Text size="sm" c="dimmed" mt="xs">
          Make sure your redirect URL ({window.location.origin}/auth/callback)
          is whitelisted in your Supabase dashboard under Authentication → URL
          Configuration.
        </Text>
      </Stack>
    );
  }

  return (
    <Stack
      align="center"
      justify="center"
      style={{ minHeight: "100vh" }}
      p="md"
    >
      <Loader size="lg" />
      <Text>Redirecting to Google...</Text>
      {debugInfo.length > 0 && (
        <Stack gap="xs" mt="lg" style={{ maxWidth: 600, width: "100%" }}>
          <Text size="sm" fw={500}>
            Debug Info:
          </Text>
          <Code
            block
            style={{ fontSize: "0.75rem", maxHeight: 200, overflow: "auto" }}
          >
            {debugInfo.join("\n")}
          </Code>
        </Stack>
      )}
    </Stack>
  );
}
