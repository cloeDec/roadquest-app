import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/src/ui";
import { colors, spacing, borderRadius } from "@/src/ui/theme";

interface NavigationInfoProps {
  distanceRemaining: number;
  timeRemaining: number;
}

export function NavigationInfo({ distanceRemaining, timeRemaining }: NavigationInfoProps) {
  const formatDistance = (km: number) => {
    if (km < 1) {
      return `${(km * 1000).toFixed(0)} m`;
    }
    return `${km.toFixed(1)} km`;
  };

  const formatTime = (minutes: number) => {
    if (minutes < 1) {
      return "< 1 min";
    }
    return `${Math.round(minutes)} min`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Ionicons name="navigate" size={20} color={colors.accentPrimary} />
        <Text variant="body" bold style={styles.text}>
          {formatDistance(distanceRemaining)}
        </Text>
      </View>
      <View style={styles.row}>
        <Ionicons name="time" size={20} color={colors.accentPrimary} />
        <Text variant="body" bold style={styles.text}>
          {formatTime(timeRemaining)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 130,
    alignSelf: "center",
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: "row",
    gap: spacing.lg,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  text: {
    fontSize: 16,
  },
});
