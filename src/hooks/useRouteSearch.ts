import { useState, useCallback } from "react";
import { Alert } from "react-native";

const OPENROUTE_API_KEY = process.env.EXPO_PUBLIC_OPENROUTE_API_KEY;

interface PlaceSuggestion {
  properties: {
    id: string;
    name: string;
    label: string;
    country: string;
    locality?: string;
  };
  geometry: {
    coordinates: [number, number];
  };
}

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface RouteInfo {
  coordinates: Coordinate[];
  distance: number;
  duration: number;
}

interface UseRouteSearchResult {
  destination: string;
  suggestions: PlaceSuggestion[];
  showSuggestions: boolean;
  destinationCoords: Coordinate | null;
  routeCoordinates: Coordinate[];
  searchPlaces: (text: string) => Promise<void>;
  selectPlace: (place: PlaceSuggestion, origin: Coordinate) => Promise<void>;
  setDestinationDirect: (name: string, coords: Coordinate, origin: Coordinate) => Promise<void>;
  clearSearch: () => void;
}

export function useRouteSearch(): UseRouteSearchResult {
  const [destination, setDestination] = useState("");
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [destinationCoords, setDestinationCoords] = useState<Coordinate | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<Coordinate[]>([]);

  const searchPlaces = useCallback(async (text: string) => {
    setDestination(text);

    if (text.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await fetch(
        `https://api.openrouteservice.org/geocode/autocomplete?api_key=${OPENROUTE_API_KEY}&text=${encodeURIComponent(text)}&boundary.country=FR&size=5`,
        { headers: { Accept: "application/json" } }
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        setSuggestions(data.features);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch {
      Alert.alert("Erreur", "Impossible de rechercher des adresses.");
    }
  }, []);

  const calculateRoute = useCallback(async (origin: Coordinate, dest: Coordinate): Promise<RouteInfo | null> => {
    try {
      const response = await fetch(
        "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
        {
          method: "POST",
          headers: {
            Accept: "application/json, application/geo+json",
            Authorization: OPENROUTE_API_KEY || "",
            "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({
            coordinates: [
              [origin.longitude, origin.latitude],
              [dest.longitude, dest.latitude],
            ],
          }),
        }
      );

      const data = await response.json();

      if (data.error) {
        Alert.alert("Erreur API", JSON.stringify(data.error));
        return null;
      }

      if (data.features && data.features.length > 0) {
        const route = data.features[0].geometry.coordinates;
        const routeCoords: Coordinate[] = route.map((coord: [number, number]) => ({
          latitude: coord[1],
          longitude: coord[0],
        }));

        const distance = data.features[0].properties.summary.distance / 1000;
        const duration = data.features[0].properties.summary.duration / 60;

        return { coordinates: routeCoords, distance, duration };
      }

      Alert.alert("Erreur", "Aucun itinéraire trouvé.");
      return null;
    } catch (error) {
      Alert.alert("Erreur", `Impossible de calculer l'itinéraire: ${error}`);
      return null;
    }
  }, []);

  const selectPlace = useCallback(async (place: PlaceSuggestion, origin: Coordinate) => {
    setDestination(place.properties.label);
    setShowSuggestions(false);

    const coords = {
      latitude: place.geometry.coordinates[1],
      longitude: place.geometry.coordinates[0],
    };
    setDestinationCoords(coords);

    const route = await calculateRoute(origin, coords);
    if (route) {
      setRouteCoordinates(route.coordinates);
      Alert.alert(
        "Itinéraire calculé",
        `Distance: ${route.distance.toFixed(1)} km\nDurée estimée: ${Math.round(route.duration)} min`
      );
    }
  }, [calculateRoute]);

  const setDestinationDirect = useCallback(async (name: string, coords: Coordinate, origin: Coordinate) => {
    setDestination(name);
    setDestinationCoords(coords);
    setShowSuggestions(false);

    const route = await calculateRoute(origin, coords);
    if (route) {
      setRouteCoordinates(route.coordinates);
    }
  }, [calculateRoute]);

  const clearSearch = useCallback(() => {
    setDestination("");
    setSuggestions([]);
    setShowSuggestions(false);
    setDestinationCoords(null);
    setRouteCoordinates([]);
  }, []);

  return {
    destination,
    suggestions,
    showSuggestions,
    destinationCoords,
    routeCoordinates,
    searchPlaces,
    selectPlace,
    setDestinationDirect,
    clearSearch,
  };
}
