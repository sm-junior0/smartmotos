const Colors = {
  primary: {
    default: '#FFD700',
    light: '#FFE55C',
    dark: '#B39700',
  },
  secondary: {
    default: '#1A1A1A',
    light: '#333333',
    dark: '#000000',
  },
  accent: {
    default: '#FF6B00',
    light: '#FF8A3D',
    dark: '#CC5500',
  },
  success: '#34C759',
  error: '#FF3B30',
  warning: '#FF9500',
  neutral: {
    white: '#FFFFFF',
    light: '#F5F5F5',
    dark: '#666666',
  },
  transparent: 'transparent',
} as const;

export type ColorType = typeof Colors;
export default Colors;