import React from "react";
import { StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Card, Text } from "@/src/ui";
import { colors, spacing } from "@/src/ui";

interface TripInfoCardProps {
  destinationName: string;
  date: string;
  time: string;
}

export function TripInfoCard({ destinationName, date, time }: TripInfoCardProps) {
  return (
    <Card variant="default" padding="lg" style={styles.container}>
      <View style={styles.row}>
        <MaterialCommunityIcons
          name="map-marker"
          size={24}
          color={colors.accentPrimary}
          style={styles.icon}
        />
        <View style={styles.info}>
          <Text variant="body" bold>
            {destinationName}
          </Text>
          <Text variant="small" color="textTertiary">
            {date} à {time}
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: spacing.md,
  },
  info: {
    flex: 1,
  },
});
