import { ActionIcon, Group, Stack, Text, Tooltip } from '@mantine/core';
import { useMantineColorScheme } from '@mantine/core';
import {
  IconChevronLeft,
  IconChevronRight,
  IconMoon,
  IconSun,
} from '@tabler/icons-react';

interface NavbarHeaderProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function NavbarHeader({
  collapsed,
  onToggleCollapse,
}: NavbarHeaderProps) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  if (collapsed) {
    return (
      <Stack gap='xs'>
        <Tooltip label='Expand sidebar' position='right' withinPortal>
          <ActionIcon onClick={onToggleCollapse}>
            <IconChevronRight size={16} />
          </ActionIcon>
        </Tooltip>
      </Stack>
    );
  }

  return (
    <Group justify='space-between'>
      <Text
        inherit
        variant='gradient'
        component='span'
        gradient={{ from: 'pink', to: 'yellow' }}
        size='lg'
        fw={600}
        style={{ color: 'white' }}
      >
        Airscribe
      </Text>
      <Group gap='xs'>
        <Tooltip label='Toggle theme' position='top' withinPortal>
          <ActionIcon
            variant='outline'
            onClick={toggleColorScheme}
            size='lg'
            style={{
              color: 'white',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              backgroundColor: 'transparent',
            }}
          >
            {colorScheme === 'dark' ? (
              <IconSun size={16} />
            ) : (
              <IconMoon size={16} />
            )}
          </ActionIcon>
        </Tooltip>
        <Tooltip label='Collapse sidebar' position='top' withinPortal>
          <ActionIcon
            variant='outline'
            onClick={onToggleCollapse}
            size='lg'
            style={{
              color: 'white',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              backgroundColor: 'transparent',
            }}
          >
            <IconChevronLeft size={16} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Group>
  );
}
