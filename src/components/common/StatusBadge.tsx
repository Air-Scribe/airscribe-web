import { Badge } from '@mantine/core';

interface StatusBadgeProps {
  status: 'success' | 'warning' | 'error' | 'info';
  children: React.ReactNode;
}

const statusConfig = {
  success: { color: 'green', variant: 'light' as const },
  warning: { color: 'yellow', variant: 'light' as const },
  error: { color: 'red', variant: 'light' as const },
  info: { color: 'blue', variant: 'light' as const },
};

export function StatusBadge({ status, children }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge color={config.color} variant={config.variant}>
      {children}
    </Badge>
  );
}
