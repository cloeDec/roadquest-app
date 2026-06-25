export const API = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000",
  TIMEOUT: 10000,
} as const;

export const POI = {
  VISIT_DETECTION_RADIUS_M: 100,
  DEFAULT_MAX_DISTANCE_M: 120000,
  DEFAULT_SEARCH_RADIUS_M: 50000,
} as const;

export const LOCATION = {
  TRACKING_INTERVAL_MS: 1000,
  DISTANCE_INTERVAL_M: 5,
  ACCURACY: "high" as const,
} as const;

export const XP = {
  BASE_POI_VISIT: 50,
  FIRST_TYPE_BONUS: 25,
  LEVEL_MULTIPLIER: 1.5,
} as const;

export const LEVELS = {
  XP_PER_LEVEL: 1000,
  MAX_LEVEL: 100,
} as const;
