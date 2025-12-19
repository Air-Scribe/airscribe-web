import { Box } from "@mantine/core";
import { TabType } from "../../contexts/RoutingContext";
import classes from "./Navbar.module.css";
import { NavbarHeader } from "./components/NavbarHeader";
import { NavbarNavigation } from "./components/NavbarNavigation";
import { NavbarFooter } from "./components/NavbarFooter";
import { useNavbar } from "./hooks/useNavbar";

interface NavbarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const { navbarCollapsed, toggleNavbar, modalOpened, closeModal, navItems } =
    useNavbar();

  return (
    <>
      <Box
        className={`${classes.navbar} ${navbarCollapsed ? classes.navbarCollapsed : ""}`}
      >
        <div className={classes.navbarMain}>
          <div className={classes.header}>
            <NavbarHeader
              collapsed={navbarCollapsed}
              onToggleCollapse={toggleNavbar}
            />
          </div>

          <NavbarNavigation
            items={navItems}
            activeTab={activeTab}
            collapsed={navbarCollapsed}
            onTabChange={onTabChange}
          />
        </div>

        <div className={classes.footer}>
          <NavbarFooter collapsed={navbarCollapsed} />
        </div>
      </Box>
    </>
  );
}
