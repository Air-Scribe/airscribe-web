import { Stack, Tooltip } from '@mantine/core';
import { TabType } from '../../../contexts/RoutingContext';

interface NavItem {
  id: TabType;
  icon: React.ComponentType<{ className?: string; stroke?: number }>;
  label: string;
}

interface NavbarNavigationProps {
  items: NavItem[];
  activeTab: TabType;
  collapsed: boolean;
  onTabChange: (tab: TabType) => void;
}

export function NavbarNavigation({
  items,
  activeTab,
  collapsed,
  onTabChange,
}: NavbarNavigationProps) {
  return (
    <Stack gap='xs'>
      {items.map(item => (
        <Tooltip
          key={item.id}
          label={item.label}
          position='right'
          withinPortal
          disabled={!collapsed}
        >
          <a
            href='#'
            onClick={event => {
              event.preventDefault();
              onTabChange(item.id);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--mantine-spacing-sm)',
              padding: 'var(--mantine-spacing-sm)',
              borderRadius: 'var(--mantine-radius-sm)',
              textDecoration: 'none',
              color: 'white',
              backgroundColor:
                activeTab === item.id
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'transparent',
              transition: 'background-color 0.2s ease',
            }}
            data-active={activeTab === item.id || undefined}
            data-collapsed={collapsed || undefined}
          >
            <item.icon stroke={1.5} />
            {!collapsed && <span>{item.label}</span>}
          </a>
        </Tooltip>
      ))}
    </Stack>
  );
}
