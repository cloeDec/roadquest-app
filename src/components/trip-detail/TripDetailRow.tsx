import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "@/src/ui";
import { colors, spacing } from "@/src/ui";

interface TripDetailRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export function TripDetailRow({ icon, label, value }: TripDetailRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.labelContainer}>
        {icon}
        <Text variant="small" color="textSecondary" style={styles.label}>
          {label}
        </Text>
      </View>
      <Text variant="small" bold>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.backgroundPrimary,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    marginLeft: spacing.sm,
  },
});
