import React from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Text, Caption } from "@/src/ui/components/Text";
import { Card } from "@/src/ui/components/Card";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, spacing, borderRadius } from "@/src/ui/theme";

interface POIFilterBarProps {
  selectedTypes: string[];
  onTypeToggle: (type: string) => void;
  showVisitedOnly: boolean;
  onVisitedOnlyToggle: () => void;
  poiCount: number;
}

const POI_TYPES = [
  {
    type: "col",
    label: "Cols",
    icon: "image-filter-hdr" as const,
    color: "#4A90E2"
  },
  {
    type: "route_panoramique",
    label: "Routes",
    icon: "road-variant" as const,
    color: "#F5A623"
  },
  {
    type: "virage",
    label: "Virages",
    icon: "chart-timeline-variant" as const,
    color: "#E91E63"
  },
  {
    type: "spot_photo",
    label: "Photos",
    icon: "camera" as const,
    color: "#9C27B0"
  },
  {
    type: "monument",
    label: "Monuments",
    icon: "castle" as const,
    color: "#795548"
  },
  {
    type: "autre",
    label: "Autres",
    icon: "star" as const,
    color: "#00BCD4"
  }
];

export function POIFilterBar({
  selectedTypes,
  onTypeToggle,
  showVisitedOnly,
  onVisitedOnlyToggle,
  poiCount
}: POIFilterBarProps) {
  return (
    <Card variant="elevated" padding="sm" style={styles.container}>
      <View style={styles.header}>
        <View style={styles.countContainer}>
          <MaterialCommunityIcons
            name="map-marker"
            size={18}
            color={colors.brandPrimary}
          />
          <Text variant="small" bold>
            {poiCount} POI{poiCount > 1 ? "s" : ""}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.visitedToggle,
            showVisitedOnly && styles.visitedToggleActive
          ]}
          onPress={onVisitedOnlyToggle}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name={showVisitedOnly ? "check-circle" : "check-circle-outline"}
            size={16}
            color={showVisitedOnly ? colors.success : colors.textSecondary}
          />
          <Caption
            style={[
              styles.visitedToggleText,
              showVisitedOnly && styles.visitedToggleTextActive
            ]}
          >
            Visités uniquement
          </Caption>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {POI_TYPES.map((poiType) => {
          const isSelected = selectedTypes.includes(poiType.type);

          return (
            <TouchableOpacity
              key={poiType.type}
              style={[
                styles.filterChip,
                isSelected && {
                  backgroundColor: poiType.color,
                  borderColor: poiType.color
                }
              ]}
              onPress={() => onTypeToggle(poiType.type)}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name={poiType.icon}
                size={18}
                color={isSelected ? "#FFFFFF" : poiType.color}
              />
              <Caption
                style={[
                  styles.filterChipText,
                  { color: isSelected ? "#FFFFFF" : poiType.color }
                ]}
              >
                {poiType.label}
              </Caption>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.xs
  },
  countContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs
  },
  visitedToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.backgroundSecondary
  },
  visitedToggleActive: {
    backgroundColor: "#E8F5E9"
  },
  visitedToggleText: {
    color: colors.textSecondary
  },
  visitedToggleTextActive: {
    color: colors.success,
    fontWeight: "600"
  },
  filterScroll: {
    marginLeft: -spacing.xs
  },
  filterContent: {
    paddingHorizontal: spacing.xs,
    gap: spacing.sm
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.backgroundSecondary
  },
  filterChipText: {
    fontWeight: "600"
  }
});
