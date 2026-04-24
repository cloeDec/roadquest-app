/**
 * Utilitaires de calcul de distance GPS
 * @module utils/distance
 */

/**
 * Calcule la distance entre deux points GPS en utilisant la formule de Haversine
 * @param lat1 - Latitude du premier point
 * @param lon1 - Longitude du premier point
 * @param lat2 - Latitude du second point
 * @param lon2 - Longitude du second point
 * @returns Distance en kilomètres
 */
export const calculateDistanceKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Calcule la distance entre deux points GPS en mètres
 * @param lat1 - Latitude du premier point
 * @param lon1 - Longitude du premier point
 * @param lat2 - Latitude du second point
 * @param lon2 - Longitude du second point
 * @returns Distance en mètres
 */
export const calculateDistanceMeters = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  return calculateDistanceKm(lat1, lon1, lat2, lon2) * 1000;
};

/**
 * Convertit des degrés en radians
 */
const toRadians = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};
