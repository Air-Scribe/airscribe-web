import { createTheme, CSSVariablesResolver } from '@mantine/core';

const cssVariablesResolver: CSSVariablesResolver = theme => ({
  variables: {
    // Shared CSS variables (available in both light and dark)
  },
  light: {
    // Light mode variables
    '--mantine-color-body': '#ffffff',
    '--mantine-color-text': '#000000',
    '--mantine-color-dimmed': '#868e96',
    '--mantine-color-default': '#ffffff',
    '--mantine-color-default-hover': '#f8f9fa',
    '--mantine-color-default-color': '#000000',
    '--mantine-color-default-border': '#e9ecef',
  },
  dark: {
    // Dark mode variables
    '--mantine-color-body': '#111827', // Base Background
    '--mantine-color-text': '#F9FAFB', // Primary Text
    '--mantine-color-dimmed': '#D1D5DB', // Muted Text (improved contrast)
    '--mantine-color-default': '#1F2937', // Elevated Cards / Panels
    '--mantine-color-default-hover': '#374151', // Borders / Dividers
    '--mantine-color-default-color': '#F9FAFB', // Text on surfaces
    '--mantine-color-default-border': '#374151', // Borders
  },
});

export const theme = createTheme({
  primaryColor: 'blue',
  colors: {
    blue: [
      '#EFF6FF',
      '#DBEAFE',
      '#BFDBFE',
      '#93C5FD',
      '#60A5FA',
      '#3B82F6',
      '#2563EB',
      '#1D4ED8',
      '#1E40AF',
      '#1E3A8A',
    ],
    amber: [
      '#FFFBEB',
      '#FEF3C7',
      '#FDE68A',
      '#FCD34D',
      '#FBBF24',
      '#F59E0B', // Primary amber color
      '#D97706',
      '#B45309',
      '#92400E',
      '#78350F',
    ],
    green: [
      '#ECFDF5',
      '#D1FAE5',
      '#A7F3D0',
      '#6EE7B7',
      '#34D399',
      '#10B981', // Primary green color
      '#059669',
      '#047857',
      '#065F46',
      '#064E3B',
    ],
    red: [
      '#FEF2F2',
      '#FEE2E2',
      '#FECACA',
      '#FCA5A5',
      '#F87171',
      '#EF4444', // Primary red color
      '#DC2626',
      '#B91C1C',
      '#991B1B',
      '#7F1D1D',
    ],
    yellow: [
      '#FEFCE8',
      '#FEF9C3',
      '#FEF08A',
      '#FDE047',
      '#FACC15', // Primary yellow color
      '#EAB308',
      '#CA8A04',
      '#A16207',
      '#854D0E',
      '#713F12',
    ],
    gray: [
      '#F9FAFB', // Primary Text (gray[0])
      '#F3F4F6',
      '#E5E7EB',
      '#D1D5DB', // Secondary Text (gray[3])
      '#9CA3AF', // Muted Text (gray[4])
      '#6B7280',
      '#4B5563',
      '#374151', // Borders / Dividers (gray[7])
      '#1F2937', // Elevated Cards / Panels (gray[8])
      '#111827', // Base Background (gray[9])
    ],
  },
  // Mantine v8 dark mode configuration
  other: {
    // Dark mode color mappings for reference
    darkMode: {
      background: '#111827', // Base Background
      surface: '#1F2937', // Elevated Cards / Panels
      border: '#374151', // Borders / Dividers
      textPrimary: '#F9FAFB', // Primary Text
      textSecondary: '#D1D5DB', // Secondary Text
      textMuted: '#9CA3AF', // Muted Text
      text: 'red',
    },
  },
});

export { cssVariablesResolver };
