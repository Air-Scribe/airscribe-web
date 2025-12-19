import { Alert, Button, Stack, Text, Title } from '@mantine/core';
import { IconWifiOff, IconRefresh, IconHome } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

interface NetworkErrorFallbackProps {
  onRetry?: () => void;
  title?: string;
  message?: string;
}

export function NetworkErrorFallback({
  onRetry,
  title = 'Connection Problem',
  message = "It looks like you're having trouble connecting to our servers. Please check your internet connection and try again.",
}: NetworkErrorFallbackProps) {
  const navigate = useNavigate();

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    navigate('/');
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
        <IconWifiOff size={48} color='var(--mantine-color-orange-6)' />

        <Title order={2} ta='center'>
          {title}
        </Title>

        <Text ta='center' c='dimmed' size='sm'>
          {message}
        </Text>

        <Alert color='orange' title='Troubleshooting Tips' w='100%'>
          <Stack gap='xs'>
            <Text size='sm'>• Check your internet connection</Text>
            <Text size='sm'>• Try refreshing the page</Text>
            <Text size='sm'>• If the problem persists, contact support</Text>
          </Stack>
        </Alert>

        <Stack gap='sm' w='100%'>
          <Button
            leftSection={<IconRefresh size={16} />}
            onClick={handleRetry}
            fullWidth
          >
            Try Again
          </Button>

          <Button
            variant='outline'
            leftSection={<IconHome size={16} />}
            onClick={handleGoHome}
            fullWidth
          >
            Go Home
          </Button>
        </Stack>
      </Stack>
    </div>
  );
}
