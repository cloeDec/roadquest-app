export const colors = {
  // Couleurs de base
  white: "#FFFFFF",
  black: "#000000",
  transparent: "transparent",

  // Couleurs de fond
  backgroundPrimary: "#0A0E27",
  backgroundSecondary: "#151B3B",
  backgroundTertiary: "#1E2749",

  // Couleurs de marque
  brandPrimary: "#4A90E2",
  brandSecondary: "#6C63FF",
  brandLight: "#6BA4EC",
  brandDark: "#357ABD",

  // Couleurs d'accentuation
  accentPrimary: "#FF6B35",
  accentLight: "#FF8A5C",
  accentDark: "#E65420",

  // Couleurs d'état
  success: "#2ECC71",
  warning: "#F59E0B",
  danger: "#E74C3C",
  error: "#E74C3C",
  info: "#3B82F6",

  // Couleurs de texte
  textPrimary: "#FFFFFF",
  textSecondary: "#B8C5D6",
  textTertiary: "#7A8BA3",

  // Couleurs principales
  primary: "#6C63FF",
  secondary: "#4ECDC4",
  accent: "#FF8C42",

  // Couleurs de bordure
  border: "#2A3555",

  // Couleurs de rang/niveau
  rankBronze: "#94A3B8",
  rankSilver: "#3B82F6",
  rankGold: "#F59E0B",
  rankPlatinum: "#A855F7",
  rankDiamond: "#9333EA",

  // Overlay colors
  overlay: "rgba(0, 0, 0, 0.5)",
  overlayLight: "rgba(255, 255, 255, 0.1)",
  overlayMedium: "rgba(255, 255, 255, 0.2)",
  overlayStrong: "rgba(255, 255, 255, 0.3)",
} as const;

export type ColorName = keyof typeof colors;
