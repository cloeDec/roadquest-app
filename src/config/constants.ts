/**
 * Constantes globales de l'application
 * @module config/constants
 */

/**
 * Configuration de l'API
 */
export const API = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000",
  TIMEOUT: 10000,
} as const;

/**
 * Configuration de la détection de POI
 */
export const POI = {
  /** Rayon de détection pour marquer un POI comme visité (en mètres) */
  VISIT_DETECTION_RADIUS_M: 100,
  /** Distance maximale pour la recherche de POI (en mètres) */
  DEFAULT_MAX_DISTANCE_M: 120000,
  /** Rayon par défaut pour les requêtes de POI (en mètres) */
  DEFAULT_SEARCH_RADIUS_M: 50000,
} as const;

/**
 * Configuration du tracking GPS
 */
export const LOCATION = {
  /** Intervalle de mise à jour de la position (en ms) */
  TRACKING_INTERVAL_MS: 1000,
  /** Distance minimale pour déclencher une mise à jour (en mètres) */
  DISTANCE_INTERVAL_M: 5,
  /** Niveau de précision GPS */
  ACCURACY: "high" as const,
} as const;

/**
 * Configuration du système XP
 */
export const XP = {
  /** XP de base pour visiter un POI */
  BASE_POI_VISIT: 50,
  /** Bonus pour un premier type de POI */
  FIRST_TYPE_BONUS: 25,
  /** Multiplicateur de niveau */
  LEVEL_MULTIPLIER: 1.5,
} as const;

/**
 * Niveaux et XP requis
 */
export const LEVELS = {
  /** XP requis pour chaque niveau */
  XP_PER_LEVEL: 1000,
  /** Niveau maximum */
  MAX_LEVEL: 100,
} as const;
