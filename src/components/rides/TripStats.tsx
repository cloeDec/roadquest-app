import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Text , colors, spacing } from "@/src/ui";


interface TripStatsProps {
  totalTrips: number;
  totalDistance: number;
  totalDuration: number;
}

export function TripStats({ totalTrips, totalDistance, totalDuration }: TripStatsProps) {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  return (
    <Card variant="default" padding="lg" style={styles.container}>
      <Text variant="h2" bold style={styles.title}>
        Mes trajets
      </Text>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text variant="h3" color="accentPrimary" bold>
            {totalTrips}
          </Text>
          <Text variant="caption" color="textTertiary" style={styles.statLabel}>
            Trajets
          </Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text variant="h3" color="accentPrimary" bold>
            {totalDistance.toFixed(0)} km
          </Text>
          <Text variant="caption" color="textTertiary" style={styles.statLabel}>
            Total
          </Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text variant="h3" color="accentPrimary" bold>
            {formatDuration(totalDuration)}
          </Text>
          <Text variant="caption" color="textTertiary" style={styles.statLabel}>
            Durée
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  title: {
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    marginTop: spacing.xs,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.textTertiary,
    opacity: 0.2,
  },
});
