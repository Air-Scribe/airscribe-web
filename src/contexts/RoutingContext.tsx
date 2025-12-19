import { createContext, ReactNode, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export type TabType = "home" | "settings";

interface RoutingContextType {
  activeTab: TabType;
  navigateToTab: (tab: TabType) => void;
}

const RoutingContext = createContext<RoutingContextType | undefined>(undefined);

interface RoutingProviderProps {
  children: ReactNode;
}

export function RoutingProvider({ children }: RoutingProviderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Map URL paths to tab types
  const pathToTab: Record<string, TabType> = {
    "/": "home",
    "/home": "home",
    "/settings": "settings",
  };

  // Map tab types to URL paths
  const tabToPath: Record<TabType, string> = {
    home: "/",
    settings: "/settings",
  };

  // Get current active tab from URL
  const getActiveTabFromPath = (): TabType => {
    const path = location.pathname;
    return pathToTab[path] || "home";
  };

  const activeTab = getActiveTabFromPath();

  const navigateToTab = (tab: TabType) => {
    navigate(tabToPath[tab]);
  };

  const value: RoutingContextType = {
    activeTab,
    navigateToTab,
  };

  return (
    <RoutingContext.Provider value={value}>{children}</RoutingContext.Provider>
  );
}

export function useRouting() {
  const context = useContext(RoutingContext);
  if (context === undefined) {
    throw new Error("useRouting must be used within a RoutingProvider");
  }
  return context;
}
