import { useEffect, useRef, useState, useCallback } from "react";
import { Alert, StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { colors, spacing } from "@/src/ui/theme";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { loadTripsFromAPI } from "@/src/store/slices/tripsSlice";
import {
  loadNearbyPOIs,
  setSelectedPOI,
  setFilters,
  getFilteredPOIs,
  POI,
} from "@/src/store/slices/poisSlice";
import {
  POIMarker,
  POIFilterBar,
  POIDetailModal,
  SearchBar,
  NavigationInfo,
  MapButton,
} from "@/src/components/map";
import { usePOIDetection, useNavigation, useRouteSearch } from "@/src/hooks";

const DEFAULT_REGION = {
  latitude: 48.8566,
  longitude: 2.3522,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const MAP_PADDING = { top: 100, right: 50, bottom: 100, left: 50 };

export default function MapScreen() {
  const dispatch = useAppDispatch();
  const { filters, selectedPOI } = useAppSelector((state) => state.pois);
  const filteredPOIs = useAppSelector(getFilteredPOIs);

  const mapRef = useRef<MapView>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [showPOIModal, setShowPOIModal] = useState(false);

  const {
    destination,
    suggestions,
    showSuggestions,
    destinationCoords,
    routeCoordinates,
    searchPlaces,
    selectPlace,
    setDestinationDirect,
    clearSearch,
  } = useRouteSearch();

  const animateToLocation = useCallback((lat: number, lng: number) => {
    mapRef.current?.animateToRegion({
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  }, []);

  const handleLocationUpdate = useCallback((newLocation: Location.LocationObject) => {
    setLocation(newLocation);
    animateToLocation(newLocation.coords.latitude, newLocation.coords.longitude);
  }, [animateToLocation]);

  const handleArrival = useCallback(() => {
    stopNavigation();
    Alert.alert("Arrivée", "Vous êtes arrivé à destination !");
  }, []);

  const {
    isTracking,
    distanceRemaining,
    timeRemaining,
    startNavigation,
    stopNavigation,
  } = useNavigation(location, destinationCoords, handleLocationUpdate, handleArrival);

  usePOIDetection(
    location?.coords.latitude || null,
    location?.coords.longitude || null,
    isTracking
  );

  useEffect(() => {
    requestLocationPermission();
    dispatch(loadTripsFromAPI() as any);
  }, []);

  useEffect(() => {
    if (location) {
      dispatch(loadNearbyPOIs(
        location.coords.latitude,
        location.coords.longitude,
        filters.maxDistance
      ) as any);
    }
  }, [location, filters.maxDistance]);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission refusée", "L'accès à la localisation est nécessaire.");
      return;
    }

    const currentLocation = await Location.getCurrentPositionAsync({});
    setLocation(currentLocation);
    animateToLocation(currentLocation.coords.latitude, currentLocation.coords.longitude);
  };

  const handlePlayPress = async () => {
    if (!location) {
      Alert.alert("Localisation requise", "Veuillez activer la localisation.");
      return;
    }

    if (!destinationCoords) {
      Alert.alert("Destination requise", "Veuillez sélectionner une destination.");
      return;
    }

    if (!isTracking) {
      await startNavigation(destination, destinationCoords, routeCoordinates);
    } else {
      await stopNavigation();
    }
  };

  const centerOnUser = () => {
    if (location) {
      animateToLocation(location.coords.latitude, location.coords.longitude);
    }
  };

  const fitToCoordinates = (coords: { latitude: number; longitude: number }[]) => {
    mapRef.current?.fitToCoordinates(coords, { edgePadding: MAP_PADDING, animated: true });
  };

  const handlePlaceSelect = async (place: any) => {
    if (!location) return;

    const origin = { latitude: location.coords.latitude, longitude: location.coords.longitude };
    await selectPlace(place, origin);

    fitToCoordinates([
      origin,
      { latitude: place.geometry.coordinates[1], longitude: place.geometry.coordinates[0] },
    ]);
  };

  const handleTypeToggle = (type: string) => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter((t) => t !== type)
      : [...filters.types, type];
    dispatch(setFilters({ types: newTypes }));
  };

  const handleVisitedOnlyToggle = () => {
    dispatch(setFilters({ showVisitedOnly: !filters.showVisitedOnly }));
  };

  const handlePOIPress = (poi: POI) => {
    dispatch(setSelectedPOI(poi));
    setShowPOIModal(true);
  };

  const handleNavigateToPOI = async () => {
    if (!selectedPOI || !location) return;

    const poiCoords = {
      latitude: selectedPOI.location.latitude,
      longitude: selectedPOI.location.longitude,
    };
    const origin = { latitude: location.coords.latitude, longitude: location.coords.longitude };

    await setDestinationDirect(selectedPOI.name, poiCoords, origin);
    setShowPOIModal(false);
    fitToCoordinates([origin, poiCoords]);
  };

  const handleClosePOIModal = () => {
    setShowPOIModal(false);
    dispatch(setSelectedPOI(null));
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        showsMyLocationButton={false}
        followsUserLocation
        userLocationPriority="high"
        userInterfaceStyle="dark"
        initialRegion={DEFAULT_REGION}
      >
        {destinationCoords && (
          <Marker
            coordinate={destinationCoords}
            title="Destination"
            pinColor={colors.accentPrimary}
          />
        )}

        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor={colors.accentPrimary}
            strokeWidth={4}
          />
        )}

        {filteredPOIs.map((poi) => (
          <POIMarker
            key={poi.poi_id}
            poi={poi}
            onPress={() => handlePOIPress(poi)}
          />
        ))}
      </MapView>

      <View style={styles.filterWrapper}>
        <POIFilterBar
          selectedTypes={filters.types}
          onTypeToggle={handleTypeToggle}
          showVisitedOnly={filters.showVisitedOnly}
          onVisitedOnlyToggle={handleVisitedOnlyToggle}
          poiCount={filteredPOIs.length}
        />
      </View>

      <SearchBar
        value={destination}
        onChangeText={searchPlaces}
        suggestions={suggestions}
        showSuggestions={showSuggestions}
        onSelectPlace={handlePlaceSelect}
        onClear={clearSearch}
      />

      <MapButton
        icon="locate"
        onPress={centerOnUser}
        style={styles.centerButton}
      />

      {isTracking && distanceRemaining !== null && timeRemaining !== null && (
        <NavigationInfo
          distanceRemaining={distanceRemaining}
          timeRemaining={timeRemaining}
        />
      )}

      <MapButton
        icon={isTracking ? "stop" : "play"}
        onPress={handlePlayPress}
        variant={isTracking ? "danger" : "primary"}
        size="large"
        style={styles.playButton}
      />

      <POIDetailModal
        poi={selectedPOI}
        visible={showPOIModal}
        onClose={handleClosePOIModal}
        onNavigate={handleNavigateToPOI}
      />
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
  filterWrapper: {
    position: "absolute",
    top: 120,
    left: spacing.md,
    right: spacing.md,
  },
  centerButton: {
    position: "absolute",
    top: 60,
    right: spacing.md,
  },
  playButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
  },
});
