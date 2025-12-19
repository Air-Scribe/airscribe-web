import { Button, Image, Paper, Space, Text, Title, Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import classes from "../styles/FinishRegistration.module.css";
import logoPng from "../assets/airscribe.png?url";

export function FinishRegistrationPage() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract tokens from URL (passed from AuthCallback after Supabase processes OAuth)
  const accessToken = searchParams.get("access_token");
  const refreshToken = searchParams.get("refresh_token");

  // Fallback: also check for code (in case it's passed directly)
  const code = searchParams.get("code");

  // Check if we have tokens or code (indicates desktop auth flow)
  const hasTokens = !!(accessToken && refreshToken);
  const hasCode = !!code;
  const isDesktop = hasTokens || hasCode;

  const handleOpenApp = async () => {
    setLoading(true);
    setError(null);

    try {
      // If we have tokens, pass them to Electron app
      if (hasTokens && accessToken && refreshToken) {
        // Pass both tokens to Electron app
        // Electron will use setSession() with both tokens
        const electronCallbackUrl = `airscribe://auth/callback?access_token=${encodeURIComponent(accessToken)}&refresh_token=${encodeURIComponent(refreshToken)}`;
        console.log("Opening Electron app with session tokens");
        window.location.href = electronCallbackUrl;
      } else if (hasCode && code) {
        // Fallback: if we have a code, pass it (though this shouldn't happen in normal flow)
        const electronCallbackUrl = `airscribe://auth/callback?code=${encodeURIComponent(code)}`;
        console.log("Opening Electron app with OAuth code (fallback)");
        window.location.href = electronCallbackUrl;
      } else {
        // No tokens or code, just open the app normally
        window.open("airscribe://", "_blank");
        setLoading(false);
      }

      // Note: The loading state will remain true since we're redirecting
      // The Electron app should handle the authentication from here
    } catch (err) {
      console.error("Error opening Electron app:", err);
      setError("Failed to open Airscribe app. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form}>
        <Image
          src={logoPng}
          alt="Airscribe logo"
          width={50}
          height={50}
          fit="contain"
        />
        <Title order={2} className={classes.title}>
          You have registered successfully!
        </Title>

        <Text>
          {isDesktop
            ? "Your email has been verified. Click the button below to open the Airscribe app and complete setup."
            : "Your email has been verified. Please open the Airscribe app to continue."}
        </Text>

        {error && (
          <>
            <Space h="md" />
            <Alert icon={<IconAlertCircle size={16} />} color="red">
              {error}
            </Alert>
          </>
        )}

        <Space h="md" />
        <Button
          onClick={handleOpenApp}
          loading={loading}
          disabled={isDesktop && !hasTokens && !hasCode}
          fullWidth
        >
          {loading
            ? "Connecting..."
            : isDesktop
              ? "Open Airscribe App"
              : "Open Airscribe"}
        </Button>
      </Paper>
    </div>
  );
}
