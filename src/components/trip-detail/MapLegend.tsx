import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Text , colors, spacing } from "@/src/ui";


interface LegendItemProps {
  color: string;
  text: string;
  isDashed?: boolean;
}

function LegendItem({ color, text, isDashed = false }: LegendItemProps) {
  return (
    <View style={styles.item}>
      <View
        style={[
          isDashed ? styles.line : styles.color,
          { backgroundColor: color },
          isDashed && styles.lineDashed,
        ]}
      />
      <Text variant="small" color="textSecondary">
        {text}
      </Text>
    </View>
  );
}

interface MapLegendProps {
  hasRouteCoordinates: boolean;
}

export function MapLegend({ hasRouteCoordinates }: MapLegendProps) {
  return (
    <Card variant="default" padding="lg" style={styles.container}>
      <Text variant="body" bold style={styles.title}>
        Légende
      </Text>
      <LegendItem color={colors.success} text="Point de départ" />
      <LegendItem color={colors.accentPrimary} text="Point d'arrivée / Destination" />
      <LegendItem color={colors.accentPrimary} text="Trajet réellement parcouru" isDashed />
      {hasRouteCoordinates && (
        <LegendItem color={colors.textTertiary} text="Itinéraire prévu" isDashed />
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
  },
  title: {
    marginBottom: spacing.md,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.sm,
  },
  color: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: spacing.md,
  },
  line: {
    width: 30,
    height: 4,
    borderRadius: 2,
    marginRight: spacing.md,
  },
  lineDashed: {
    opacity: 0.6,
  },
});
