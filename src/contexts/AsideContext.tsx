import {
  createContext,
  ReactNode,
  useContext,
  useReducer,
  useState,
} from 'react';
import { SidebarKey, SidebarProps } from '../components/Sidebars/registry';

interface SidebarState {
  isOpen: boolean;
  key: SidebarKey | null;
  // Strongly typed props that match the sidebar key
  props: SidebarProps[SidebarKey] | null;
}

interface AsideContextType {
  // Sidebar state
  sidebar: SidebarState;
  openSidebar: <T extends SidebarKey>(key: T, props: SidebarProps[T]) => void;
  closeSidebar: () => void;
  // Navbar state
  navbarCollapsed: boolean;
  toggleNavbar: () => void;
}

const AsideContext = createContext<AsideContextType | undefined>(undefined);

interface AsideProviderProps {
  children: ReactNode;
}

type SidebarAction =
  | {
      type: 'OPEN_SIDEBAR';
      payload: { key: SidebarKey; props: SidebarProps[SidebarKey] };
    }
  | { type: 'CLOSE_SIDEBAR' };

function sidebarReducer(
  state: SidebarState,
  action: SidebarAction
): SidebarState {
  switch (action.type) {
    case 'OPEN_SIDEBAR':
      return {
        isOpen: true,
        key: action.payload.key,
        props: action.payload.props,
      };
    case 'CLOSE_SIDEBAR':
      return {
        isOpen: false,
        key: null,
        props: null,
      };
    default:
      return state;
  }
}

export function AsideProvider({ children }: AsideProviderProps) {
  const [navbarCollapsed, setNavbarCollapsed] = useState(false);

  const initialState: SidebarState = {
    isOpen: false,
    key: null,
    props: null,
  };

  const [sidebar, dispatch] = useReducer(sidebarReducer, initialState);

  const openSidebar = <T extends SidebarKey>(
    key: T,
    props: SidebarProps[T]
  ) => {
    dispatch({
      type: 'OPEN_SIDEBAR',
      payload: { key, props },
    });
  };

  const closeSidebar = () => {
    dispatch({
      type: 'CLOSE_SIDEBAR',
    });
  };

  const toggleNavbar = () => {
    setNavbarCollapsed(!navbarCollapsed);
  };

  const value: AsideContextType = {
    sidebar,
    openSidebar,
    closeSidebar,
    navbarCollapsed,
    toggleNavbar,
  };

  return (
    <AsideContext.Provider value={value}>{children}</AsideContext.Provider>
  );
}

export function useAside() {
  const context = useContext(AsideContext);
  if (context === undefined) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return context;
}
