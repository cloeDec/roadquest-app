import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Card, Text, Caption, Icon } from "@/src/ui";
import { colors, spacing, borderRadius } from "@/src/ui/theme";

interface Motorcycle {
  brand: string;
  model: string;
  year: number;
  photo_url?: string;
}

interface MotorcycleCardProps {
  motorcycle: Motorcycle;
  onEdit?: () => void;
}

export function MotorcycleCard({ motorcycle, onEdit }: MotorcycleCardProps) {
  return (
    <Card variant="elevated" padding="md">
      <TouchableOpacity onPress={onEdit}>
        <View style={styles.container}>
          <View style={styles.photo}>
            {motorcycle.photo_url ? (
              <Image
                source={{ uri: motorcycle.photo_url }}
                style={styles.image}
              />
            ) : (
              <Icon name="motorbike" size={64} color="brandPrimary" />
            )}
          </View>
          <View style={styles.info}>
            <Text variant="h3">
              {motorcycle.brand} {motorcycle.model}
            </Text>
            <Caption color="textSecondary">
              Année {motorcycle.year}
            </Caption>
            <TouchableOpacity style={styles.editButton} onPress={onEdit}>
              <Icon name="pencil" size={16} color="brandPrimary" />
              <Text variant="caption" color="brandPrimary">
                Modifier
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: spacing.md,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  info: {
    flex: 1,
    justifyContent: "center",
    gap: spacing.xs,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
});
