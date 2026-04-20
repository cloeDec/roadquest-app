import React from "react";
import { View, StyleSheet, Modal, TouchableOpacity, ScrollView, Image } from "react-native";
import { Text, H3, Caption } from "@/src/ui/components/Text";
import { Card } from "@/src/ui/components/Card";
import { Button } from "@/src/ui/components/Button";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { POI } from "@/src/store/slices/poisSlice";
import { colors, spacing, borderRadius } from "@/src/ui/theme";

interface POIDetailModalProps {
  poi: POI | null;
  visible: boolean;
  onClose: () => void;
  onVisit?: () => void;
  onNavigate?: () => void;
}

const POI_TYPE_CONFIG = {
  col: { icon: "image-filter-hdr" as const, color: "#4A90E2", label: "Col" },
  route_panoramique: { icon: "road-variant" as const, color: "#F5A623", label: "Route panoramique" },
  virage: { icon: "chart-timeline-variant" as const, color: "#E91E63", label: "Virage" },
  spot_photo: { icon: "camera" as const, color: "#9C27B0", label: "Spot photo" },
  monument: { icon: "castle" as const, color: "#795548", label: "Monument" },
  autre: { icon: "map-marker" as const, color: "#607D8B", label: "Autre" }
};

export function POIDetailModal({
  poi,
  visible,
  onClose,
  onVisit,
  onNavigate
}: POIDetailModalProps) {
  if (!poi) return null;

  const config = POI_TYPE_CONFIG[poi.type];
  const isVisited = poi.visited || false;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.modalContainer}>
          <Card variant="elevated" style={styles.card}>
            {/* Header avec image ou gradient */}
            <View style={[styles.header, { backgroundColor: config.color }]}>
              {poi.image_url ? (
                <Image
                  source={{ uri: poi.image_url }}
                  style={styles.headerImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.headerPlaceholder}>
                  <MaterialCommunityIcons
                    name={config.icon}
                    size={64}
                    color="#FFFFFF"
                  />
                </View>
              )}

              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color="#FFFFFF"
                />
              </TouchableOpacity>

              {isVisited && (
                <View style={styles.visitedBadge}>
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={20}
                    color="#FFFFFF"
                  />
                  <Text variant="small" style={styles.visitedBadgeText}>
                    Visité
                  </Text>
                </View>
              )}
            </View>

            <ScrollView style={styles.content}>
              {/* Titre et type */}
              <View style={styles.titleSection}>
                <View style={styles.titleRow}>
                  <MaterialCommunityIcons
                    name={config.icon}
                    size={28}
                    color={config.color}
                  />
                  <H3 style={styles.title}>{poi.name}</H3>
                </View>

                <View style={styles.typeTag}>
                  <Caption style={[styles.typeTagText, { color: config.color }]}>
                    {config.label}
                  </Caption>
                </View>
              </View>

              {/* Statistiques */}
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <MaterialCommunityIcons
                    name="star"
                    size={20}
                    color={colors.warning}
                  />
                  <Text variant="bodyLarge" bold>
                    {poi.rating.toFixed(1)}
                  </Text>
                  <Caption color="textSecondary">/ 5</Caption>
                </View>

                {poi.distance_meters !== undefined && (
                  <View style={styles.statItem}>
                    <MaterialCommunityIcons
                      name="map-marker-distance"
                      size={20}
                      color={colors.brandPrimary}
                    />
                    <Text variant="bodyLarge" bold>
                      {(poi.distance_meters / 1000).toFixed(1)}
                    </Text>
                    <Caption color="textSecondary">km</Caption>
                  </View>
                )}

                {poi.is_verified && (
                  <View style={styles.statItem}>
                    <MaterialCommunityIcons
                      name="check-decagram"
                      size={20}
                      color={colors.success}
                    />
                    <Caption color="textSecondary">Vérifié</Caption>
                  </View>
                )}
              </View>

              {/* Description */}
              <View style={styles.descriptionSection}>
                <Text variant="h4" style={styles.sectionTitle}>
                  Description
                </Text>
                <Text variant="body" color="textSecondary">
                  {poi.description}
                </Text>
              </View>

              {/* Date de visite si visité */}
              {isVisited && poi.visit_date && (
                <View style={styles.visitInfo}>
                  <MaterialCommunityIcons
                    name="calendar-check"
                    size={20}
                    color={colors.success}
                  />
                  <Caption color="textSecondary">
                    Visité le {new Date(poi.visit_date).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}
                  </Caption>
                </View>
              )}

              {/* Actions */}
              <View style={styles.actionsSection}>
                {onNavigate && (
                  <Button
                    variant="primary"
                    fullWidth
                    leftIcon={
                      <MaterialCommunityIcons
                        name="navigation"
                        size={20}
                        color="#FFFFFF"
                      />
                    }
                    onPress={onNavigate}
                  >
                    Naviguer vers ce POI
                  </Button>
                )}

                {!isVisited && onVisit && (
                  <Button
                    variant="outline"
                    fullWidth
                    leftIcon={
                      <MaterialCommunityIcons
                        name="check-circle-outline"
                        size={20}
                        color={colors.brandPrimary}
                      />
                    }
                    onPress={onVisit}
                  >
                    Marquer comme visité
                  </Button>
                )}
              </View>
            </ScrollView>
          </Card>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end"
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  modalContainer: {
    maxHeight: "85%"
  },
  card: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    padding: 0
  },
  header: {
    height: 200,
    position: "relative",
    overflow: "hidden"
  },
  headerImage: {
    width: "100%",
    height: "100%"
  },
  headerPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  closeButton: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center"
  },
  visitedBadge: {
    position: "absolute",
    top: spacing.md,
    left: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.success,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full
  },
  visitedBadgeText: {
    color: "#FFFFFF",
    fontWeight: "600"
  },
  content: {
    padding: spacing.lg
  },
  titleSection: {
    marginBottom: spacing.lg
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm
  },
  title: {
    flex: 1
  },
  typeTag: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.backgroundTertiary
  },
  typeTagText: {
    fontWeight: "600"
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: spacing.lg,
    marginBottom: spacing.lg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border
  },
  statItem: {
    alignItems: "center",
    gap: spacing.xs
  },
  descriptionSection: {
    marginBottom: spacing.lg
  },
  sectionTitle: {
    marginBottom: spacing.sm
  },
  visitInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: "#E8F5E9",
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg
  },
  actionsSection: {
    gap: spacing.md,
    marginTop: spacing.md
  }
});
