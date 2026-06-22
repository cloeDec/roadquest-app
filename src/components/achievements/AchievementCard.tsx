import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Caption } from "@/src/ui/components/Text";
import { Card } from "@/src/ui/components/Card";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, spacing, borderRadius } from "@/src/ui/theme";
import { UserAchievement } from "@/src/store/slices/achievementsSlice";
import { LinearGradient } from "expo-linear-gradient";

interface AchievementCardProps {
  achievement: UserAchievement;
  onPress?: () => void;
}

const RARITY_COLORS: Record<string, { gradient: [string, string]; glow: string }> = {
  bronze: { gradient: ["#CD7F32", "#8B5A2B"], glow: "#D4A574" },
  silver: { gradient: ["#C0C0C0", "#A8A8A8"], glow: "#D3D3D3" },
  gold: { gradient: ["#FFD700", "#DAA520"], glow: "#FFE55C" },
  platinum: { gradient: ["#E5E4E2", "#A0B2C6"], glow: "#B8C5D6" }
};

const CATEGORY_ICONS: Record<string, string> = {
  distance: "road",
  pois: "map-marker-star",
  cols: "image-filter-hdr",
  regions: "map",
  social: "account-group",
  general: "trophy"
};

export function AchievementCard({ achievement, onPress }: AchievementCardProps) {
  const isUnlocked = achievement.is_unlocked;
  const progressPercentage = achievement.requirement_value > 0
    ? Math.round((achievement.progress / achievement.requirement_value) * 100)
    : 0;

  const rarity = achievement.rarity || "bronze";
  const rarityColor = RARITY_COLORS[rarity] || RARITY_COLORS.bronze;
  const icon = achievement.badge_icon || CATEGORY_ICONS[achievement.category] || "trophy";

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} disabled={!onPress}>
      <Card
        variant={isUnlocked ? "elevated" : "outlined"}
        padding="md"
        style={[styles.container, !isUnlocked && styles.lockedContainer]}
      >
        {isUnlocked && (
          <LinearGradient
            colors={rarityColor.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.rarityBorder}
          />
        )}

        <View style={styles.content}>
          <View style={[
            styles.iconContainer,
            isUnlocked
              ? { backgroundColor: rarityColor.glow + "20", borderColor: rarityColor.glow }
              : styles.lockedIcon
          ]}>
            <MaterialCommunityIcons
              name={icon as any}
              size={32}
              color={isUnlocked ? rarityColor.gradient[1] : colors.textTertiary}
            />
            {isUnlocked && (
              <View style={[styles.checkmark, { backgroundColor: rarityColor.gradient[1] }]}>
                <MaterialCommunityIcons name="check" size={12} color="#FFFFFF" />
              </View>
            )}
          </View>

          <View style={styles.info}>
            <Text variant="body" bold style={!isUnlocked && styles.lockedText}>
              {achievement.name}
            </Text>
            <Caption style={[styles.description, !isUnlocked && styles.lockedText]}>
              {achievement.description}
            </Caption>

            {!isUnlocked && achievement.requirement_value > 0 && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${progressPercentage}%`, backgroundColor: colors.brandPrimary }
                    ]}
                  />
                </View>
                <Caption style={styles.progressText}>
                  {achievement.progress} / {achievement.requirement_value}
                </Caption>
              </View>
            )}

            <View style={styles.reward}>
              <MaterialCommunityIcons
                name="star"
                size={14}
                color={isUnlocked ? colors.warning : colors.textTertiary}
              />
              <Caption style={[styles.xpText, !isUnlocked && styles.lockedText]}>
                +{achievement.xp_reward} XP
              </Caption>
            </View>
          </View>
        </View>

        {isUnlocked && achievement.unlocked_at && (
          <Caption style={styles.unlockedDate}>
            Débloqué le {new Date(achievement.unlocked_at).toLocaleDateString("fr-FR")}
          </Caption>
        )}
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    overflow: "hidden"
  },
  lockedContainer: {
    opacity: 0.6
  },
  rarityBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4
  },
  content: {
    flexDirection: "row",
    gap: spacing.md
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    position: "relative"
  },
  lockedIcon: {
    backgroundColor: colors.backgroundSecondary,
    borderColor: colors.border
  },
  checkmark: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.backgroundPrimary
  },
  info: {
    flex: 1,
    gap: spacing.xs
  },
  description: {
    color: colors.textSecondary
  },
  lockedText: {
    color: colors.textTertiary
  },
  progressContainer: {
    gap: spacing.xs,
    marginTop: spacing.xs
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.sm,
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    borderRadius: borderRadius.sm
  },
  progressText: {
    fontSize: 11,
    color: colors.textTertiary
  },
  reward: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.xs
  },
  xpText: {
    fontWeight: "600",
    color: colors.warning
  },
  unlockedDate: {
    marginTop: spacing.sm,
    color: colors.textTertiary,
    fontSize: 11
  }
});
