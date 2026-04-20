import React from "react";
import { StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button, Text } from "@/src/ui";
import { colors, spacing } from "@/src/ui";

interface EmptyTripsStateProps {
  onStartTrip: () => void;
}

export function EmptyTripsState({ onStartTrip }: EmptyTripsStateProps) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="map-marker-off" size={80} color={colors.textTertiary} />
      <Text variant="h3" bold style={styles.title}>
        Aucun trajet enregistré
      </Text>
      <Text variant="body" color="textTertiary" center style={styles.subtitle}>
        Démarrez votre premier trajet GPS pour le voir apparaître ici
      </Text>
      <Button
        variant="secondary"
        size="medium"
        onPress={onStartTrip}
        leftIcon={<MaterialCommunityIcons name="plus" size={20} color={colors.textPrimary} />}
        style={styles.button}
      >
        Commencer un trajet
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  title: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  subtitle: {
    marginBottom: spacing.xl,
  },
  button: {
    marginTop: spacing.md,
  },
});
