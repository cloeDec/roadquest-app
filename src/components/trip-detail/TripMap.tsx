import React from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import { colors, borderRadius, spacing } from "@/src/ui";
import { Coordinate } from "@/src/store/slices/tripsSlice";

interface TripMapProps {
  coordinates: Coordinate[];
  destination: {
    name: string;
    latitude: number;
    longitude: number;
  } | null;
  routeCoordinates: Coordinate[];
}

export function TripMap({ coordinates, destination, routeCoordinates }: TripMapProps) {
  const mapRegion =
    coordinates.length > 0
      ? {
          latitude: coordinates[0].latitude,
          longitude: coordinates[0].longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }
      : undefined;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={mapRegion}
        userInterfaceStyle="dark"
      >
        {coordinates.length > 0 && (
          <Marker
            coordinate={{
              latitude: coordinates[0].latitude,
              longitude: coordinates[0].longitude,
            }}
            title="Départ"
            pinColor={colors.success}
          />
        )}

        {destination && (
          <Marker
            coordinate={{
              latitude: destination.latitude,
              longitude: destination.longitude,
            }}
            title="Destination"
            description={destination.name}
            pinColor={colors.accentPrimary}
          />
        )}

        {coordinates.length > 1 && (
          <Polyline
            coordinates={coordinates.map((coord) => ({
              latitude: coord.latitude,
              longitude: coord.longitude,
            }))}
            strokeColor={colors.accentPrimary}
            strokeWidth={4}
          />
        )}

        {routeCoordinates.length > 1 && (
          <Polyline
            coordinates={routeCoordinates.map((coord) => ({
              latitude: coord.latitude,
              longitude: coord.longitude,
            }))}
            strokeColor={colors.textTertiary}
            strokeWidth={2}
            lineDashPattern={[10, 5]}
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    margin: spacing.lg,
    borderRadius: borderRadius.md,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  map: {
    flex: 1,
  },
});
