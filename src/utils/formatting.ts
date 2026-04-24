/**
 * Utilitaires de formatage (dates, durées, distances)
 * @module utils/formatting
 */

/**
 * Formate une durée en secondes vers un format lisible
 * @param seconds - Durée en secondes
 * @returns Format "Xh Ymin" ou "Ymin"
 */
export const formatDurationSeconds = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }
  return `${minutes}min`;
};

/**
 * Formate une durée en minutes vers un format compact
 * @param minutes - Durée en minutes
 * @returns Format "Xh Y" ou "Ymin"
 */
export const formatDurationMinutes = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0) {
    return mins > 0 ? `${hours}h${mins}` : `${hours}h`;
  }
  return `${mins}min`;
};

/**
 * Formate une distance en km
 * @param km - Distance en kilomètres
 * @param precision - Nombre de décimales (défaut: 1)
 * @returns Format "X.Y km"
 */
export const formatDistance = (km: number, precision: number = 1): string => {
  return `${km.toFixed(precision)} km`;
};

/**
 * Formate une date en format court français
 * @param timestamp - Timestamp en millisecondes ou string ISO
 * @returns Format "15 jan. 2024"
 */
export const formatDateShort = (timestamp: number | string): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/**
 * Formate une date en format long français
 * @param timestamp - Timestamp en millisecondes ou string ISO
 * @returns Format "15 janvier 2024"
 */
export const formatDateLong = (timestamp: number | string): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

/**
 * Formate une date en temps relatif
 * @param dateString - Date ISO string
 * @returns Format "il y a Xmin", "il y a Xh", "il y a Xj"
 */
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) {
    return `il y a ${diffMins}min`;
  }
  if (diffHours < 24) {
    return `il y a ${diffHours}h`;
  }
  if (diffDays < 7) {
    return `il y a ${diffDays}j`;
  }
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
};

/**
 * Formate une heure
 * @param timestamp - Timestamp en millisecondes ou string ISO
 * @returns Format "14h30"
 */
export const formatTime = (timestamp: number | string): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).replace(":", "h");
};

/**
 * Calcule la vitesse moyenne
 * @param distanceKm - Distance en km
 * @param durationSeconds - Durée en secondes
 * @returns Vitesse en km/h
 */
export const calculateAverageSpeed = (
  distanceKm: number,
  durationSeconds: number
): number => {
  if (durationSeconds === 0) return 0;
  const hours = durationSeconds / 3600;
  return distanceKm / hours;
};
