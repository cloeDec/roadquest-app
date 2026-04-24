import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { colors, spacing } from "../theme";
import { Card } from "./Card";
import { Text, Caption } from "./Text";
import { Icon, type IconName } from "./Icon";
import type { ColorName } from "../theme";

interface StatCardProps {
  icon: IconName;
  iconColor: ColorName;
  value: string | number;
  label: string;
  style?: ViewStyle;
}

export function StatCard({ icon, iconColor, value, label, style }: StatCardProps) {
  return (
    <Card variant="outlined" padding="md" style={[styles.card, style]}>
      <Icon name={icon} size={32} color={iconColor} />
      <Text variant="h2" style={styles.value}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </Text>
      <Caption color="textSecondary">{label}</Caption>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: "30%",
    alignItems: "center",
    gap: spacing.xs,
  },
  value: {
    marginTop: spacing.xs,
  },
});
