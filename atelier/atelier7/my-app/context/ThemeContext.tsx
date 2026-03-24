export type Theme = 'light' | 'dark';

export type ThemeState = {
  theme: Theme;
  isDark: boolean;
};

export type ThemeContextType = ThemeState & {
  toggleTheme: () => void;
};

export type ThemeColors = {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  primary: string;
  border: string;
};

export const lightColors: ThemeColors = {
  background: '#f0f4ff',
  surface: '#ffffff',
  text: '#1a1a1a',
  textSecondary: '#555555',
  primary: '#1a3a6b',
  border: '#e0e0e0',
};

export const darkColors: ThemeColors = {
  background: '#121212',
  surface: '#1e1e1e',
  text: '#ffffff',
  textSecondary: '#aaaaaa',
  primary: '#4a8fd4',
  border: '#333333',
};
