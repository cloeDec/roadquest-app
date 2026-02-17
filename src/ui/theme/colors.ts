export const colors = {
  // Couleurs de fond
  backgroundPrimary: "#0A0E27",
  backgroundSecondary: "#151B3B",
  backgroundTertiary: "#1E2749",

  // Couleurs de marque
  brandPrimary: "#4A90E2",
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
} as const;

export type ColorName = keyof typeof colors;
