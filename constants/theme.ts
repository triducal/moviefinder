/**
 * App theme configuration for light and dark mode.
 * Derived from your design color palette.
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    // Base text & backgrounds
    text: '#11181C',
    background: '#FFFFFF',
    backgroundPrimary: '#FFFFFF',
    backgroundSecondary: '#F8F8F8',
    backgroundTertiary: '#E6E6E6',

    // UI tones
    textMuted: '#555555',
    brandPrimary: '#3B82F6',
    ratingStar: '#F0B200',
    danger: '#EF4444',
    success: '#22C55E',

    // System tints/icons
    tint: '#3B82F6',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#3B82F6',
  },

  dark: {
    // Base text & backgrounds
    text: '#FFFFFF',
    background: '#060606',
    backgroundPrimary: '#060606',
    backgroundSecondary: '#111111',
    backgroundTertiary: '#222222',

    // UI tones
    textMuted: '#8F8F8F',
    brandPrimary: '#3B82F6',
    ratingStar: '#F0B200',
    danger: '#EF4444',
    success: '#22C55E',

    // System tints/icons
    tint: '#FFFFFF',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#FFFFFF',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
