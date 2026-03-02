import { createContext, useContext } from "react";
import { ThemeMode } from "./storage";

export type ThemeColors = {
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  primary: string;
  primaryLight: string;
  danger: string;
  success: string;
  white: string;
};

const darkColors: ThemeColors = {
  background: "#191919",
  surface: "#2F2F2F",
  surfaceAlt: "#3D3D3D",
  text: "#E8E8E8",
  textSecondary: "#9B9B9B",
  textMuted: "#6B6B6B",
  border: "#3D3D3D",
  primary: "#2383E2",
  primaryLight: "#529CCA",
  danger: "#EB5757",
  success: "#4DAB9A",
  white: "#FFFFFF",
};

const lightColors: ThemeColors = {
  background: "#FFFFFF",
  surface: "#F7F6F3",
  surfaceAlt: "#EEEEEE",
  text: "#37352F",
  textSecondary: "#6B6B6B",
  textMuted: "#9B9B9B",
  border: "#E9E9E7",
  primary: "#2383E2",
  primaryLight: "#2383E2",
  danger: "#EB5757",
  success: "#4DAB9A",
  white: "#FFFFFF",
};

export function getThemeColors(mode: ThemeMode): ThemeColors {
  return mode === "dark" ? darkColors : lightColors;
}

export type AppTheme = {
  colors: ThemeColors;
  mode: ThemeMode;
};

export const ThemeContext = createContext<AppTheme>({
  colors: darkColors,
  mode: "dark",
});

export function useAppTheme() {
  return useContext(ThemeContext);
}
