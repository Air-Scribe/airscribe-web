// Registry of all available sidebar components
// To add a new sidebar:
// 1. Create the component and export its props interface
// 2. Import both the component and its props interface here
// 3. Add the component to the sidebarComponents registry with a unique key
// 4. Add the props type to the SidebarProps interface
export const sidebarComponents = {
  // Add more sidebars here as needed
  // Example:
  // 'user-profile': UserProfileSidebar,
  // 'settings': SettingsSidebar,
} as const;

// Type for sidebar keys
export type SidebarKey = keyof typeof sidebarComponents;

// Type for sidebar props - maps each key to its component's props
// Add new sidebar props here following the same pattern
export type SidebarProps = {
  // Example:
  // 'user-profile': UserProfileSidebarProps;
  // 'settings': SettingsSidebarProps;
};

// Helper type to get component props by key
export type GetSidebarProps<T extends SidebarKey> = SidebarProps[T];
