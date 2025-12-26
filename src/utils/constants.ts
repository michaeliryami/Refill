/**
 * Design System Constants
 * 
 * Centralized design tokens for consistent UI across the application.
 * Following industry best practices for scalable design systems.
 * 
 * @module utils/constants
 */

/**
 * Color Palette
 * 
 * iOS Human Interface Guidelines inspired colors
 */
export const Colors = {
  // Primary
  primary: '#007AFF',
  primaryDark: '#0051D5',
  primaryLight: '#5AC8FA',
  
  // Secondary
  secondary: '#5856D6',
  secondaryDark: '#4140B2',
  secondaryLight: '#8E8CD8',
  
  // Semantic Colors
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#5AC8FA',
  
  // Neutrals
  black: '#000000',
  white: '#FFFFFF',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  
  // Background
  backgroundPrimary: '#FFFFFF',
  backgroundSecondary: '#F9FAFB',
  backgroundTertiary: '#F3F4F6',
  
  // Text
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textInverse: '#FFFFFF',
  
  // Border
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  borderDark: '#D1D5DB',
} as const;

/**
 * Typography
 * 
 * Type scale and font weights
 */
export const Typography = {
  // Font Sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  
  // Font Weights
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

/**
 * Spacing
 * 
 * 8pt grid system
 */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
  '4xl': 64,
} as const;

/**
 * Border Radius
 */
export const BorderRadius = {
  none: 0,
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

/**
 * Shadows
 * 
 * Elevation-based shadow system
 */
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  base: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
} as const;

/**
 * Layout
 */
export const Layout = {
  // Container widths
  containerMaxWidth: 1200,
  
  // Screen breakpoints (for web)
  breakpoints: {
    mobile: 320,
    tablet: 768,
    desktop: 1024,
    wide: 1280,
  },
  
  // Safe area insets (default values, use SafeAreaProvider for actual values)
  safeArea: {
    top: 44,
    bottom: 34,
  },
} as const;

/**
 * Animation Durations (milliseconds)
 */
export const Animation = {
  duration: {
    fast: 150,
    base: 250,
    slow: 350,
  },
  
  // Easing functions (for Animated API)
  easing: {
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    spring: 'spring',
  },
} as const;

/**
 * Z-Index Layers
 */
export const ZIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  modal: 1200,
  popover: 1300,
  tooltip: 1400,
} as const;

/**
 * API Configuration
 */
export const API = {
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
} as const;

/**
 * Environment
 */
export const Environment = {
  isDevelopment: process.env.EXPO_PUBLIC_ENV === 'development',
  isProduction: process.env.EXPO_PUBLIC_ENV === 'production',
  isStaging: process.env.EXPO_PUBLIC_ENV === 'staging',
} as const;





