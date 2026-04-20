import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Text } from "@/src/ui";
import { colors, spacing } from "@/src/ui";

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
}

export function StatCard({ icon, value, label }: StatCardProps) {
  return (
    <Card variant="default" padding="lg" style={styles.card}>
      <View style={styles.iconContainer}>{icon}</View>
      <Text variant="h3" bold style={styles.value}>
        {value}
      </Text>
      <Text variant="caption" color="textTertiary" center>
        {label}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: "45%",
    alignItems: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.backgroundPrimary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  value: {
    marginBottom: spacing.xs,
  },
});
