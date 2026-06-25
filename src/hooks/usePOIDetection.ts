import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { markPOIAsVisited, POI } from "@/src/store/slices/poisSlice";
import { Alert } from "react-native";
import { calculateDistanceMeters } from "@/src/utils";
import { POI as POIConfig } from "@/src/config/constants";

const XP_BY_TYPE: Record<string, number> = {
  col: 50,
  route_panoramique: 40,
  virage: 30,
  spot_photo: 25,
  monument: 35,
  autre: 20
};

export function usePOIDetection(
  currentLatitude: number | null,
  currentLongitude: number | null,
  isTracking: boolean
) {
  const dispatch = useAppDispatch();
  const { nearbyPOIs } = useAppSelector((state) => state.pois);
  const currentTrip = useAppSelector((state) => state.trips.currentTrip);
  const visitedInSession = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (isTracking && currentTrip) {
      visitedInSession.current.clear();
    }
  }, [isTracking, currentTrip?.id]);

  useEffect(() => {
    if (!isTracking || !currentLatitude || !currentLongitude || !currentTrip) {
      return;
    }

    nearbyPOIs.forEach((poi: POI) => {
      if (poi.visited || visitedInSession.current.has(poi.poi_id)) {
        return;
      }

      const distance = calculateDistanceMeters(
        currentLatitude,
        currentLongitude,
        poi.location.latitude,
        poi.location.longitude
      );

      if (distance <= POIConfig.VISIT_DETECTION_RADIUS_M) {
        handlePOIVisit(poi);
      }
    });
  }, [currentLatitude, currentLongitude, isTracking, nearbyPOIs, currentTrip]);

  const calculateXPReward = (poi: POI): number => {
    const xp = XP_BY_TYPE[poi.type] || 20;
    const ratingMultiplier = poi.rating / 5;
    return Math.round(xp * ratingMultiplier);
  };

  const handlePOIVisit = async (poi: POI) => {
    visitedInSession.current.add(poi.poi_id);

    try {
      if (currentTrip?.id) {
        await dispatch(markPOIAsVisited(poi.poi_id, currentTrip.id) as any);

        Alert.alert(
          "🎉 POI découvert !",
          `Vous avez visité : ${poi.name}\n\n+${calculateXPReward(poi)} XP`,
          [{ text: "Super !", style: "default" }]
        );
      }
    } catch {
      visitedInSession.current.delete(poi.poi_id);
    }
  };
}
