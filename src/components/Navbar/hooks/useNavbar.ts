import { useDisclosure } from '@mantine/hooks';
import {
  IconHome,
  IconSettings,
} from '@tabler/icons-react';
import { useAside } from '../../../contexts/AsideContext';
import { TabType } from '../../../contexts/RoutingContext';

export function useNavbar() {
  const { navbarCollapsed, toggleNavbar } = useAside();
  const [modalOpened, { close: closeModal }] = useDisclosure(false);

  const navItems = [
    {
      id: 'home' as TabType,
      icon: IconHome,
      label: 'Home',
    },
    {
      id: 'settings' as TabType,
      icon: IconSettings,
      label: 'Settings',
    },
  ];

  return {
    navbarCollapsed,
    toggleNavbar,
    modalOpened,
    closeModal,
    navItems,
  };
}
