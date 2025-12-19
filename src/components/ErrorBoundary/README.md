# Error Handling System

This directory contains the global error handling system for the Airscribe app.

## Components

### ErrorBoundary

A React Error Boundary that catches JavaScript errors anywhere in the component tree.

```tsx
import { ErrorBoundary, ErrorFallback } from './components/ErrorBoundary';

<ErrorBoundary
  fallback={<ErrorFallback />}
  onError={(error, errorInfo) => {
    console.error('Error caught:', error, errorInfo);
  }}
>
  <YourComponent />
</ErrorBoundary>;
```

### ErrorFallback

A fallback UI component that displays when an error occurs.

```tsx
<ErrorFallback
  error={error}
  resetError={resetError}
  title='Custom Error Title'
  message='Custom error message'
  showRetry={true}
  showHome={true}
  showReload={true}
/>
```

### NetworkErrorFallback

A specialized fallback for network-related errors.

```tsx
<NetworkErrorFallback
  onRetry={handleRetry}
  title='Connection Problem'
  message='Check your internet connection'
/>
```

## Hooks

### useErrorReporting

A hook for reporting errors in components.

```tsx
import { useErrorReporting } from '../hooks/useErrorReporting';

function MyComponent() {
  const { reportError, reportAsyncError, wrapAsyncFunction } =
    useErrorReporting({
      component: 'MyComponent',
      userId: 'user123',
    });

  const handleClick = async () => {
    try {
      await riskyOperation();
    } catch (error) {
      reportError(error, 'handleClick');
    }
  };

  // Or wrap async functions automatically
  const safeAsyncFunction = wrapAsyncFunction(
    riskyAsyncFunction,
    'safeAsyncFunction'
  );
}
```

## Global Error Handler

The global error handler automatically catches:

- Uncaught JavaScript errors
- Unhandled promise rejections
- Resource loading errors (images, scripts, etc.)

It's automatically initialized in the main App component.

## Error Reporting

Errors are automatically:

- Logged to console in development
- Queued for reporting to external services
- Tagged with component context and user information

## Usage Examples

### In API Hooks

```tsx
const { reportError } = useErrorReporting({ component: 'useApi' });

try {
  const response = await apiCall();
} catch (error) {
  reportError(error, 'apiCall');
  throw error;
}
```

### In Components

```tsx
const { reportError } = useErrorReporting({ component: 'MyComponent' });

const handleSubmit = async data => {
  try {
    await submitData(data);
  } catch (error) {
    reportError(error, 'handleSubmit');
    setError('Failed to submit data');
  }
};
```

### Wrapping Async Functions

```tsx
const { wrapAsyncFunction } = useErrorReporting({ component: 'MyComponent' });

const safeApiCall = wrapAsyncFunction(apiCall, 'safeApiCall');
// Now safeApiCall will automatically report errors
```
