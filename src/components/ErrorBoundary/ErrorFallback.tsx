import { Alert, Button, Stack, Text, Title } from '@mantine/core';
import { IconAlertTriangle, IconRefresh, IconHome } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
  title?: string;
  message?: string;
  showRetry?: boolean;
  showHome?: boolean;
  showReload?: boolean;
}

export function ErrorFallback({
  error,
  resetError,
  title = 'Something went wrong',
  message = 'We encountered an unexpected error. Please try again.',
  showRetry = true,
  showHome = true,
  showReload = true,
}: ErrorFallbackProps) {
  const navigate = useNavigate();

  const handleRetry = () => {
    if (resetError) {
      resetError();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '2rem',
      }}
    >
      <Stack align='center' gap='lg' maw={600}>
        <IconAlertTriangle size={48} color='var(--mantine-color-red-6)' />

        <Title order={2} ta='center'>
          {title}
        </Title>

        <Text ta='center' c='dimmed' size='sm'>
          {message}
        </Text>

        {process.env.NODE_ENV === 'development' && error && (
          <Alert color='red' title='Development Error Details' w='100%'>
            <Text size='xs' component='pre' style={{ whiteSpace: 'pre-wrap' }}>
              {error.message}
              {'\n\n'}
              {error.stack}
            </Text>
          </Alert>
        )}

        <Stack gap='sm' w='100%'>
          {showRetry && (
            <Button
              leftSection={<IconRefresh size={16} />}
              onClick={handleRetry}
              fullWidth
            >
              Try Again
            </Button>
          )}

          {showHome && (
            <Button
              variant='outline'
              leftSection={<IconHome size={16} />}
              onClick={handleGoHome}
              fullWidth
            >
              Go Home
            </Button>
          )}

          {showReload && (
            <Button variant='outline' onClick={handleReload} fullWidth>
              Reload Page
            </Button>
          )}
        </Stack>
      </Stack>
    </div>
  );
}
