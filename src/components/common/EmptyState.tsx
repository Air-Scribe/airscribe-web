import { Stack, Text, Title } from '@mantine/core';
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <Stack align='center' gap='md' py='xl'>
      {icon}
      <Title order={3} size='h4' ta='center'>
        {title}
      </Title>
      <Text size='sm' c='dimmed' ta='center' maw={400}>
        {description}
      </Text>
      {action}
    </Stack>
  );
}
