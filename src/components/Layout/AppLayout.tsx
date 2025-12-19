import { Navbar } from '@/components/Navbar/Navbar';
import { AppShell } from '@mantine/core';
import React, { ReactNode } from 'react';

import { useAside } from '../../contexts/AsideContext';
import { TabType } from '../../contexts/RoutingContext';
import { sidebarComponents } from '../Sidebars/registry';

// Clean sidebar renderer component
function SidebarRenderer() {
  const { sidebar } = useAside();

  if (!sidebar.isOpen || !sidebar.key || !sidebar.props) {
    return null;
  }

  const ComponentToRender = sidebarComponents[sidebar.key];
  if (!ComponentToRender) {
    return null;
  }

  // Type assertion needed since registry may be empty
  const Component = ComponentToRender as React.ComponentType<any>;
  return <Component {...(sidebar.props as any)} />;
}

interface AppLayoutProps {
  children: ReactNode;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function AppLayout({
  children,
  activeTab,
  onTabChange,
}: AppLayoutProps) {
  const { navbarCollapsed, sidebar } = useAside();

  return (
    <AppShell
      // TODO: change this bg
      style={{ backgroundColor: '#f6f6f6', height: '100%' }}
      navbar={{
        width: navbarCollapsed ? 80 : 300,
        breakpoint: 'sm',
        collapsed: { mobile: true, desktop: false },
      }}
      aside={{
        width: sidebar.isOpen ? 400 : 0,
        breakpoint: 'md',
        collapsed: { mobile: true, desktop: false },
      }}
      padding={0}
    >
      <AppShell.Navbar>
        <Navbar activeTab={activeTab} onTabChange={onTabChange} />
      </AppShell.Navbar>

      <AppShell.Main style={{ height: '100%' }}>{children}</AppShell.Main>

      <AppShell.Aside>
        <SidebarRenderer />
      </AppShell.Aside>
    </AppShell>
  );
}
