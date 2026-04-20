import { borderRadius, colors, spacing } from "@/src/ui";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import {
  startTrip,
  addCoordinate,
  endTrip,
  saveTripToAPI,
  loadTripsFromAPI,
} from "@/src/store/slices/tripsSlice";

// Clé API OpenRouteService depuis les variables d'environnement
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
    coordinates: [number, number]; // [longitude, latitude]
  };
}

interface Coordinate {
  latitude: number;
  longitude: number;
}

export default function MapScreen() {
  const dispatch = useAppDispatch();
  const currentTrip = useAppSelector((state) => state.trips.currentTrip);

  const mapRef = useRef<MapView>(null);
  const locationSubscription = useRef<Location.LocationSubscription | null>(
    null,
  );
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [isTracking, setIsTracking] = useState(false);
  const [destination, setDestination] = useState("");
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [destinationCoords, setDestinationCoords] =
    useState<Coordinate | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<Coordinate[]>([]);
  const [distanceRemaining, setDistanceRemaining] = useState<number | null>(
    null,
  );
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  useEffect(() => {
    requestLocationPermission();
    // Charger les trajets depuis l'API
    dispatch(loadTripsFromAPI() as any);

    return () => {
      // Nettoyer l'abonnement à la localisation lors du démontage
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, []);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission refusée",
        "L'accès à la localisation est nécessaire pour utiliser la carte.",
      );
      return;
    }

    const currentLocation = await Location.getCurrentPositionAsync({});
    setLocation(currentLocation);

    // Centrer la carte sur la position actuelle
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  const handlePlayPress = async () => {
    if (!location) {
      Alert.alert(
        "Localisation requise",
        "Veuillez activer la localisation pour démarrer un trajet.",
      );
      return;
    }

    if (!destinationCoords) {
      Alert.alert(
        "Destination requise",
        "Veuillez d'abord sélectionner une destination.",
      );
      return;
    }

    if (!isTracking) {
      // Démarrer le guidage
      startNavigation();
    } else {
      // Arrêter le guidage
      stopNavigation();
    }
  };

  const startNavigation = async () => {
    setIsTracking(true);

    // Démarrer l'enregistrement du trajet dans Redux
    dispatch(
      startTrip({
        destination: destinationCoords
          ? {
              name: destination,
              latitude: destinationCoords.latitude,
              longitude: destinationCoords.longitude,
            }
          : null,
        routeCoordinates: routeCoordinates.map((coord) => ({
          ...coord,
          timestamp: Date.now(),
        })),
      }),
    );

    Alert.alert("Guidage démarré", "Navigation en cours vers votre destination.");

    // Démarrer le suivi en temps réel de la position
    locationSubscription.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1000, // Mise à jour toutes les secondes
        distanceInterval: 5, // Mise à jour tous les 5 mètres
      },
      (newLocation) => {
        setLocation(newLocation);

        // Enregistrer la position dans Redux
        dispatch(
          addCoordinate({
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
          }),
        );

        // Calculer la distance restante
        if (destinationCoords) {
          const distance = calculateDistance(
            newLocation.coords.latitude,
            newLocation.coords.longitude,
            destinationCoords.latitude,
            destinationCoords.longitude,
          );
          setDistanceRemaining(distance);

          // Estimer le temps restant (vitesse moyenne : 50 km/h)
          const timeInMinutes = (distance / 50) * 60;
          setTimeRemaining(timeInMinutes);

          // Vérifier si on est arrivé (moins de 50 mètres)
          if (distance < 0.05) {
            stopNavigation();
            Alert.alert("Arrivée", "Vous êtes arrivé à destination !");
          }

          // Centrer la carte sur la position actuelle
          if (mapRef.current) {
            mapRef.current.animateToRegion({
              latitude: newLocation.coords.latitude,
              longitude: newLocation.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
          }
        }
      },
    );
  };

  const stopNavigation = async () => {
    setIsTracking(false);
    setDistanceRemaining(null);
    setTimeRemaining(null);

    // Terminer l'enregistrement du trajet
    dispatch(endTrip());

    // Sauvegarder le trajet dans la base de données
    if (currentTrip) {
      try {
        await dispatch(saveTripToAPI({
          ...currentTrip,
          endTime: Date.now(),
          isActive: false
        }) as any);
        Alert.alert("Guidage arrêté", "Trajet enregistré avec succès dans la base de données !");
      } catch (error) {
        Alert.alert("Erreur", "Impossible de sauvegarder le trajet dans la base de données");
      }
    }

    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }
  };

  // Calculer la distance entre deux points (formule Haversine)
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance en km
  };

  const centerOnUser = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  // Recherche de lieux avec OpenRouteService Geocoding
  const searchPlaces = async (text: string) => {
    setDestination(text);

    if (text.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await fetch(
        `https://api.openrouteservice.org/geocode/autocomplete?api_key=${OPENROUTE_API_KEY}&text=${encodeURIComponent(
          text,
        )}&boundary.country=FR&size=5`,
        {
          headers: {
            Accept: "application/json",
          },
        },
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        setSuggestions(data.features);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      Alert.alert("Erreur", "Impossible de rechercher des adresses.");
    }
  };

  // Sélection d'un lieu
  const selectPlace = async (place: PlaceSuggestion) => {
    setDestination(place.properties.label);
    setShowSuggestions(false);
    Keyboard.dismiss();

    const coords = {
      latitude: place.geometry.coordinates[1],
      longitude: place.geometry.coordinates[0],
    };

    setDestinationCoords(coords);

    // Calculer l'itinéraire
    if (location) {
      await calculateRoute(
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        coords,
      );
    }

    // Centrer la carte pour afficher l'itinéraire
    if (mapRef.current && location) {
      mapRef.current.fitToCoordinates(
        [
          {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          coords,
        ],
        {
          edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
          animated: true,
        },
      );
    }
  };

  // Calculer l'itinéraire avec OpenRouteService Directions
  const calculateRoute = async (origin: Coordinate, destination: Coordinate) => {
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
              [destination.longitude, destination.latitude],
            ],
          }),
        },
      );

      const data = await response.json();

      if (data.error) {
        console.error("Erreur API:", data.error);
        Alert.alert("Erreur API", JSON.stringify(data.error));
        return;
      }

      if (data.features && data.features.length > 0) {
        const route = data.features[0].geometry.coordinates;

        const routeCoords: Coordinate[] = route.map(
          (coord: [number, number]) => ({
            latitude: coord[1],
            longitude: coord[0],
          }),
        );
        setRouteCoordinates(routeCoords);

        // Afficher les informations sur l'itinéraire
        const distance = (
          data.features[0].properties.summary.distance / 1000
        ).toFixed(1);
        const duration = Math.round(
          data.features[0].properties.summary.duration / 60,
        );
        Alert.alert(
          "Itinéraire calculé",
          `Distance: ${distance} km\nDurée estimée: ${duration} min`,
        );
      } else {
        console.error("Pas de route trouvée dans la réponse");
        Alert.alert("Erreur", "Aucun itinéraire trouvé.");
      }
    } catch (error) {
      console.error("Erreur lors du calcul de l'itinéraire:", error);
      Alert.alert("Erreur", `Impossible de calculer l'itinéraire: ${error}`);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsMyLocationButton={false}
        followsUserLocation={true}
        userLocationPriority="high"
        userInterfaceStyle="dark"
        initialRegion={{
          latitude: 48.8566,
          longitude: 2.3522,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* Marqueur de destination */}
        {destinationCoords && (
          <Marker
            coordinate={destinationCoords}
            title="Destination"
            pinColor={colors.accentPrimary}
          />
        )}

        {/* Tracé de l'itinéraire */}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor={colors.accentPrimary}
            strokeWidth={4}
          />
        )}
      </MapView>

      {/* Barre de recherche d'itinéraire */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color={colors.textTertiary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Où voulez-vous aller ?"
            placeholderTextColor={colors.textTertiary}
            value={destination}
            onChangeText={searchPlaces}
            returnKeyType="search"
          />
          {destination.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setDestination("");
                setSuggestions([]);
                setShowSuggestions(false);
                setDestinationCoords(null);
                setRouteCoordinates([]);
              }}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={colors.textTertiary}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Liste des suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <FlatList
              data={suggestions}
              keyExtractor={(item) => item.properties.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => selectPlace(item)}
                >
                  <Ionicons
                    name="location-outline"
                    size={20}
                    color={colors.textTertiary}
                    style={styles.suggestionIcon}
                  />
                  <View style={styles.suggestionText}>
                    <Text style={styles.suggestionMainText}>
                      {item.properties.name}
                    </Text>
                    <Text style={styles.suggestionSecondaryText}>
                      {item.properties.locality
                        ? `${item.properties.locality}, ${item.properties.country}`
                        : item.properties.country}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              style={styles.suggestionsList}
            />
          </View>
        )}
      </View>

      {/* Bouton pour centrer sur l'utilisateur */}
      <TouchableOpacity style={styles.centerButton} onPress={centerOnUser}>
        <Ionicons name="locate" size={24} color={colors.textPrimary} />
      </TouchableOpacity>

      {/* Informations de navigation */}
      {isTracking && distanceRemaining !== null && timeRemaining !== null && (
        <View style={styles.navigationInfo}>
          <View style={styles.infoRow}>
            <Ionicons name="navigate" size={20} color={colors.accentPrimary} />
            <Text style={styles.infoText}>
              {distanceRemaining < 1
                ? `${(distanceRemaining * 1000).toFixed(0)} m`
                : `${distanceRemaining.toFixed(1)} km`}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="time" size={20} color={colors.accentPrimary} />
            <Text style={styles.infoText}>
              {timeRemaining < 1
                ? "< 1 min"
                : `${Math.round(timeRemaining)} min`}
            </Text>
          </View>
        </View>
      )}

      {/* Bouton Play/Stop */}
      <TouchableOpacity
        style={[styles.playButton, isTracking && styles.playButtonActive]}
        onPress={handlePlayPress}
      >
        <Ionicons
          name={isTracking ? "stop" : "play"}
          size={32}
          color={colors.textPrimary}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  map: {
    flex: 1,
  },
  centerButton: {
    position: "absolute",
    top: 60,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  playButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.accentPrimary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playButtonActive: {
    backgroundColor: colors.danger,
  },
  navigationInfo: {
    position: "absolute",
    bottom: 130,
    alignSelf: "center",
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: "row",
    gap: spacing.lg,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  infoText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
  searchWrapper: {
    position: "absolute",
    top: 60,
    left: 16,
    right: 72,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    color: colors.textPrimary,
    fontSize: 16,
  },
  suggestionsContainer: {
    marginTop: spacing.xs,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: 300,
  },
  suggestionsList: {
    flexGrow: 0,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.backgroundPrimary,
  },
  suggestionIcon: {
    marginRight: spacing.sm,
  },
  suggestionText: {
    flex: 1,
  },
  suggestionMainText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "500",
  },
  suggestionSecondaryText: {
    color: colors.textTertiary,
    fontSize: 14,
    marginTop: 2,
  },
});
