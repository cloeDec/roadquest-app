import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Card, Text , colors, spacing } from "@/src/ui";

import { Trip } from "@/src/store/slices/tripsSlice";

interface TripCardProps {
  trip: Trip;
  onPress: () => void;
  onDelete: () => void;
}

export function TripCard({ trip, onPress, onDelete }: TripCardProps) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.container}>
      <Card variant="elevated" padding="md">
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="motorbike" size={24} color={colors.accentPrimary} />
          </View>
          <View style={styles.info}>
            <Text variant="body" bold numberOfLines={1}>
              {trip.destination?.name || "Destination inconnue"}
            </Text>
            <Text variant="small" color="textTertiary">
              {formatDate(trip.startTime)} à {formatTime(trip.startTime)}
            </Text>
          </View>
          <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
            <MaterialCommunityIcons name="delete-outline" size={20} color={colors.danger} />
          </TouchableOpacity>
        </View>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="map-marker-distance" size={16} color={colors.textTertiary} />
            <Text variant="small" bold style={styles.statText}>
              {trip.distance.toFixed(1)} km
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="clock-outline" size={16} color={colors.textTertiary} />
            <Text variant="small" bold style={styles.statText}>
              {formatDuration(trip.duration)}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="map-marker" size={16} color={colors.textTertiary} />
            <Text variant="small" bold style={styles.statText}>
              {trip.coordinates.length} pts
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.backgroundPrimary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  info: {
    flex: 1,
  },
  deleteButton: {
    padding: spacing.sm,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.backgroundPrimary,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  statText: {
    marginLeft: spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: colors.textTertiary,
    opacity: 0.2,
  },
});
