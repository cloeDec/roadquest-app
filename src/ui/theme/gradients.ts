export const gradients = {
  background: ["#0A0E27", "#1E2749"],
  brand: ["#4A90E2", "#6BA4EC"],
  accent: ["#FF6B35", "#E65420"],
} as const;

export type GradientName = keyof typeof gradients;

export const gradientConfig = {
  start: { x: 0, y: 0 },
  end: { x: 0, y: 1 },
} as const;
