import { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, Button, Stack, Text, Title } from '@mantine/core';
import { IconAlertTriangle, IconRefresh } from '@tabler/icons-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // Report error to external service (if configured)
    this.reportError(error, errorInfo);
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // In a real app, you might want to send this to an error reporting service
    // like Sentry, LogRocket, or Bugsnag
    try {
      // Example: Send to error reporting service
      // errorReportingService.captureException(error, {
      //   extra: errorInfo,
      //   tags: { component: 'ErrorBoundary' }
      // });

      // For now, just log to console
      console.error('Error reported:', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
      });
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  };

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
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
              Something went wrong
            </Title>

            <Text ta='center' c='dimmed' size='sm'>
              We're sorry, but something unexpected happened. This error has
              been reported to our team.
            </Text>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Alert color='red' title='Development Error Details' w='100%'>
                <Text
                  size='xs'
                  component='pre'
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </Text>
              </Alert>
            )}

            <Stack gap='sm' w='100%'>
              <Button
                leftSection={<IconRefresh size={16} />}
                onClick={this.handleRetry}
                fullWidth
              >
                Try Again
              </Button>

              <Button variant='outline' onClick={this.handleReload} fullWidth>
                Reload Page
              </Button>
            </Stack>
          </Stack>
        </div>
      );
    }

    return this.props.children;
  }
}
