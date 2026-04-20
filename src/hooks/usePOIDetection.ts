import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { markPOIAsVisited, POI } from "@/src/store/slices/poisSlice";
import { Alert } from "react-native";

/**
 * Distance de détection pour considérer un POI comme visité (en mètres)
 */
const VISIT_DETECTION_RADIUS = 100; // 100 mètres

/**
 * Calculer la distance entre deux points (formule Haversine)
 */
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371000; // Rayon de la Terre en mètres
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance en mètres
};

/**
 * Hook pour détecter automatiquement les POIs visités
 */
export function usePOIDetection(
  currentLatitude: number | null,
  currentLongitude: number | null,
  isTracking: boolean
) {
  const dispatch = useAppDispatch();
  const { nearbyPOIs } = useAppSelector((state) => state.pois);
  const currentTrip = useAppSelector((state) => state.trips.currentTrip);

  // Garder une trace des POIs déjà visités pendant cette session
  const visitedInSession = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Réinitialiser les POIs visités quand on commence un nouveau trajet
    if (isTracking && currentTrip) {
      visitedInSession.current.clear();
    }
  }, [isTracking, currentTrip?.id]);

  useEffect(() => {
    // Ne pas détecter si on n'est pas en train de suivre ou si pas de position
    if (!isTracking || !currentLatitude || !currentLongitude || !currentTrip) {
      return;
    }

    // Vérifier chaque POI à proximité
    nearbyPOIs.forEach((poi: POI) => {
      // Ignorer si déjà visité (dans la BDD ou dans cette session)
      if (poi.visited || visitedInSession.current.has(poi.poi_id)) {
        return;
      }

      // Calculer la distance avec la position actuelle
      const distance = calculateDistance(
        currentLatitude,
        currentLongitude,
        poi.location.latitude,
        poi.location.longitude
      );

      // Si on est assez proche, marquer comme visité
      if (distance <= VISIT_DETECTION_RADIUS) {
        handlePOIVisit(poi);
      }
    });
  }, [
    currentLatitude,
    currentLongitude,
    isTracking,
    nearbyPOIs,
    currentTrip,
  ]);

  const handlePOIVisit = async (poi: POI) => {
    // Marquer comme visité dans cette session pour éviter les doublons
    visitedInSession.current.add(poi.poi_id);

    try {
      // Marquer dans la BDD si on a un trajet en cours
      if (currentTrip?.id) {
        await dispatch(markPOIAsVisited(poi.poi_id, currentTrip.id) as any);

        // Notifier l'utilisateur
        Alert.alert(
          "🎉 POI découvert !",
          `Vous avez visité : ${poi.name}\n\n+${calculateXPReward(poi)} XP`,
          [{ text: "Super !", style: "default" }]
        );
      }
    } catch (error) {
      console.error("Erreur lors du marquage du POI:", error);
      // Retirer de la session en cas d'erreur pour réessayer
      visitedInSession.current.delete(poi.poi_id);
    }
  };

  /**
   * Calculer les XP gagnés selon le type et rating du POI
   */
  const calculateXPReward = (poi: POI): number => {
    const baseXP = {
      col: 50,
      route_panoramique: 40,
      virage: 30,
      spot_photo: 25,
      monument: 35,
      autre: 20
    };

    const xp = baseXP[poi.type] || 20;
    const ratingMultiplier = poi.rating / 5;

    return Math.round(xp * ratingMultiplier);
  };
}
