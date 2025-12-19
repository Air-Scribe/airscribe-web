import { IconChevronRight, IconLogout } from '@tabler/icons-react';
import {
  Group,
  Text,
  Tooltip,
  UnstyledButton,
  Menu,
  Avatar,
} from '@mantine/core';
import classes from './UserButton.module.css';

interface UserButtonProps {
  collapsed: boolean;
  name: string;
  email: string;
  avatar?: string;
  onLogout: () => void;
  href?: string;
}

export function UserButton({
  collapsed,
  name,
  email,
  avatar,
  onLogout,
  href,
}: UserButtonProps) {
  return (
    <Tooltip label={name} position='right' hidden={!collapsed}>
      <Menu shadow='md' width={200}>
        <Menu.Target>
          <UnstyledButton
            className={classes.user}
            data-collapsed={collapsed || undefined}
          >
            {!collapsed && (
              <Group wrap='nowrap'>
                <Avatar
                  src={avatar}
                  name={name}
                  radius='xl'
                  color={'initials'}
                />

                <div style={{ flex: 1 }}>
                  <Text size='sm' fw={500}>
                    {name}
                  </Text>

                  <Text size='xs'>{email}</Text>
                </div>

                <IconChevronRight size={14} stroke={1.5} />
              </Group>
            )}
            {collapsed && (
              <Avatar src={avatar} name={name} radius='xl' color={'initials'} />
            )}
          </UnstyledButton>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Account</Menu.Label>
          <Menu.Item leftSection={<IconLogout size={14} />} onClick={onLogout}>
            Sign out
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Tooltip>
  );
}
