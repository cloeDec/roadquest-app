import React from "react";
import { Marker, Callout } from "react-native-maps";
import { View, StyleSheet } from "react-native";
import { Text, Caption } from "@/src/ui/components/Text";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { POI } from "@/src/store/slices/poisSlice";
import { colors, spacing } from "@/src/ui/theme";

interface POIMarkerProps {
  poi: POI;
  onPress?: () => void;
}

const POI_TYPE_CONFIG = {
  col: {
    icon: "image-filter-hdr" as const,
    color: "#4A90E2",
    label: "Col"
  },
  route_panoramique: {
    icon: "road-variant" as const,
    color: "#F5A623",
    label: "Route panoramique"
  },
  virage: {
    icon: "chart-timeline-variant" as const,
    color: "#E91E63",
    label: "Virage"
  },
  spot_photo: {
    icon: "camera" as const,
    color: "#9C27B0",
    label: "Spot photo"
  },
  monument: {
    icon: "castle" as const,
    color: "#795548",
    label: "Monument"
  },
  autre: {
    icon: "map-marker" as const,
    color: "#607D8B",
    label: "Autre"
  }
};

export function POIMarker({ poi, onPress }: POIMarkerProps) {
  const config = POI_TYPE_CONFIG[poi.type];
  const isVisited = poi.visited || false;

  return (
    <Marker
      coordinate={{
        latitude: poi.location.latitude,
        longitude: poi.location.longitude
      }}
      pinColor={isVisited ? colors.success : config.color}
      onPress={onPress}
      opacity={isVisited ? 0.7 : 1}
    >
      <View style={[
        styles.markerContainer,
        { backgroundColor: isVisited ? colors.success : config.color }
      ]}>
        <MaterialCommunityIcons
          name={config.icon}
          size={20}
          color="#FFFFFF"
        />
        {isVisited && (
          <View style={styles.visitedBadge}>
            <MaterialCommunityIcons
              name="check-circle"
              size={12}
              color="#FFFFFF"
            />
          </View>
        )}
      </View>

      <Callout>
        <View style={styles.calloutContainer}>
          <View style={styles.calloutHeader}>
            <MaterialCommunityIcons
              name={config.icon}
              size={24}
              color={config.color}
            />
            <Text variant="h4" style={styles.calloutTitle}>
              {poi.name}
            </Text>
          </View>

          <View style={styles.calloutInfo}>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons
                name="tag"
                size={16}
                color={colors.textSecondary}
              />
              <Caption style={styles.infoText}>
                {config.label}
              </Caption>
            </View>

            <View style={styles.infoRow}>
              <MaterialCommunityIcons
                name="star"
                size={16}
                color={colors.warning}
              />
              <Caption style={styles.infoText}>
                {poi.rating.toFixed(1)} / 5
              </Caption>
            </View>

            {poi.distance_meters !== undefined && (
              <View style={styles.infoRow}>
                <MaterialCommunityIcons
                  name="map-marker-distance"
                  size={16}
                  color={colors.textSecondary}
                />
                <Caption style={styles.infoText}>
                  {(poi.distance_meters / 1000).toFixed(1)} km
                </Caption>
              </View>
            )}

            {isVisited && (
              <View style={styles.visitedTag}>
                <MaterialCommunityIcons
                  name="check-circle"
                  size={16}
                  color={colors.success}
                />
                <Caption style={styles.visitedText}>
                  Visité
                </Caption>
              </View>
            )}
          </View>

          <Caption
            style={styles.description}
            numberOfLines={2}
            color="textSecondary"
          >
            {poi.description}
          </Caption>
        </View>
      </Callout>
    </Marker>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  visitedBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: colors.success,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF"
  },
  calloutContainer: {
    width: 250,
    padding: spacing.md
  },
  calloutHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm
  },
  calloutTitle: {
    flex: 1,
  },
  calloutInfo: {
    gap: spacing.xs,
    marginBottom: spacing.sm
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs
  },
  infoText: {
    color: colors.textSecondary
  },
  visitedTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: "#E8F5E9",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    alignSelf: "flex-start"
  },
  visitedText: {
    color: colors.success,
    fontWeight: "600"
  },
  description: {
    lineHeight: 18
  }
});
