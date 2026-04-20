import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "@/src/ui";
import { colors, spacing } from "@/src/ui";

interface TripHeaderProps {
  onBack: () => void;
  onDelete: () => void;
}

export function TripHeader({ onBack, onDelete }: TripHeaderProps) {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.button} onPress={onBack}>
        <MaterialCommunityIcons name="arrow-left" size={24} color={colors.textPrimary} />
      </TouchableOpacity>
      <Text variant="body" bold style={styles.title}>
        Détails du trajet
      </Text>
      <TouchableOpacity style={styles.button} onPress={onDelete}>
        <MaterialCommunityIcons name="delete-outline" size={24} color={colors.danger} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.backgroundSecondary,
  },
  button: {
    padding: spacing.sm,
  },
  title: {
    flex: 1,
    textAlign: "center",
  },
});
