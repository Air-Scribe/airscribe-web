import { Container, Group, Stack, Title } from '@mantine/core';
import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  action?: ReactNode;
}

export function PageHeader({ title, action }: PageHeaderProps) {
  return (
    <Group
      align='center'
      justify='center'
      p={'lg'}
      style={{
        width: '100%',
        // Dont hardcode this, toggle it for dark mode
        backgroundColor: '#fff',
        boxShadow: 'var(--mantine-shadow-sm)',
      }}
    >
      <Container size={'xl'} m={0} p={0} w='100%'>
        <Group justify='space-between' align='center' px={'lg'}>
          <Stack gap={'xs'}>
            <Title order={1}>{title}</Title>
          </Stack>
          {action && <div>{action}</div>}
        </Group>
      </Container>
    </Group>
  );
}
