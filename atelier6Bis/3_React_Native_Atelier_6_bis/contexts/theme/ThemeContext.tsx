import React, { createContext, useContext, useState, ReactNode } from "react";

export type ThemeMode = "light" | "dark";

type ThemeColors = {
  background: string;
  text: string;
  card: string;
  primary: string;
};

type ThemeContextValue = {
  mode: ThemeMode;
  toggleTheme: () => void;
  colors: ThemeColors;
};

const light: ThemeColors = {
  background: "#ffffff",
  text: "#111111",
  card: "#f5f5f5",
  primary: "#1e90ff",
};

const dark: ThemeColors = {
  background: "#0b0b0b",
  text: "#f5f5f5",
  card: "#1a1a1a",
  primary: "#4aa3ff",
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>("light");
  const toggleTheme = () => setMode(m => (m === "light" ? "dark" : "light"));
  const colors = mode === "light" ? light : dark;

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
