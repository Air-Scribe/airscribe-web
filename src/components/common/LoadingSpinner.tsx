import { Loader, Stack, Text } from '@mantine/core';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export function LoadingSpinner({
  message = 'Loading...',
  size = 'md',
}: LoadingSpinnerProps) {
  return (
    <Stack align='center' gap='md'>
      <Loader size={size} />
      <Text size='sm' c='dimmed'>
        {message}
      </Text>
    </Stack>
  );
}
