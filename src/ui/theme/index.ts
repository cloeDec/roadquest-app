export * from "./colors";
export * from "./gradients";
export * from "./typography";
export * from "./spacing";

import { colors } from "./colors";
import { gradients } from "./gradients";
import { typography } from "./typography";
import { spacing, borderRadius } from "./spacing";

export const theme = {
  colors,
  gradients,
  typography,
  spacing,
  borderRadius,
} as const;

export type Theme = typeof theme;
