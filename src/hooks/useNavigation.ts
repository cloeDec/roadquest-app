import { useState, useRef, useCallback } from "react";
import * as Location from "expo-location";
import { Alert } from "react-native";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import {
  startTrip,
  addCoordinate,
  endTrip,
  saveTripToAPI,
} from "@/src/store/slices/tripsSlice";
import { calculateDistanceKm } from "@/src/utils";

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface UseNavigationResult {
  isTracking: boolean;
  distanceRemaining: number | null;
  timeRemaining: number | null;
  startNavigation: (destination: string, destinationCoords: Coordinate, routeCoordinates: Coordinate[]) => Promise<void>;
  stopNavigation: () => Promise<void>;
}

export function useNavigation(
  location: Location.LocationObject | null,
  destinationCoords: Coordinate | null,
  onLocationUpdate: (location: Location.LocationObject) => void,
  onArrival: () => void
): UseNavigationResult {
  const dispatch = useAppDispatch();
  const currentTrip = useAppSelector((state) => state.trips.currentTrip);

  const [isTracking, setIsTracking] = useState(false);
  const [distanceRemaining, setDistanceRemaining] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);

  const startNavigation = useCallback(async (
    destination: string,
    destCoords: Coordinate,
    routeCoordinates: Coordinate[]
  ) => {
    setIsTracking(true);

    dispatch(
      startTrip({
        destination: {
          name: destination,
          latitude: destCoords.latitude,
          longitude: destCoords.longitude,
        },
        routeCoordinates: routeCoordinates.map((coord) => ({
          ...coord,
          timestamp: Date.now(),
        })),
      })
    );

    Alert.alert("Guidage démarré", "Navigation en cours vers votre destination.");

    locationSubscription.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1000,
        distanceInterval: 5,
      },
      (newLocation) => {
        onLocationUpdate(newLocation);

        dispatch(
          addCoordinate({
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
          })
        );

        const distance = calculateDistanceKm(
          newLocation.coords.latitude,
          newLocation.coords.longitude,
          destCoords.latitude,
          destCoords.longitude
        );
        setDistanceRemaining(distance);

        const timeInMinutes = (distance / 50) * 60;
        setTimeRemaining(timeInMinutes);

        if (distance < 0.05) {
          onArrival();
        }
      }
    );
  }, [dispatch, onLocationUpdate, onArrival]);

  const stopNavigation = useCallback(async () => {
    setIsTracking(false);
    setDistanceRemaining(null);
    setTimeRemaining(null);

    dispatch(endTrip());

    if (currentTrip) {
      try {
        await dispatch(saveTripToAPI({
          ...currentTrip,
          endTime: Date.now(),
          isActive: false
        }) as any);
        Alert.alert("Guidage arrêté", "Trajet enregistré avec succès !");
      } catch (error) {
        Alert.alert("Erreur", "Impossible de sauvegarder le trajet");
      }
    }

    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }
  }, [dispatch, currentTrip]);

  return {
    isTracking,
    distanceRemaining,
    timeRemaining,
    startNavigation,
    stopNavigation,
  };
}
