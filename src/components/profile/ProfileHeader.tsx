import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Avatar, Badge, ProgressBar, Text, Caption } from "@/src/ui";
import { colors, spacing } from "@/src/ui/theme";

interface ProfileHeaderProps {
  username: string;
  email: string;
  avatarUrl?: string;
  level: number;
  currentXP: number;
  nextLevelXP: number;
}

export function ProfileHeader({
  username,
  email,
  avatarUrl,
  level,
  currentXP,
  nextLevelXP,
}: ProfileHeaderProps) {
  const xpProgress = nextLevelXP > 0
    ? Math.round((currentXP / nextLevelXP) * 100)
    : 0;

  return (
    <View style={styles.header}>
      <LinearGradient
        colors={[colors.brandPrimary, colors.brandSecondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.avatarContainer}>
          <Avatar uri={avatarUrl} size="xl" showBorder />
          <View style={styles.badgePosition}>
            <Badge
              value={level}
              icon="star"
              iconColor="warning"
              style={styles.badge}
            />
          </View>
        </View>

        <Text variant="h2" style={styles.username}>
          {username}
        </Text>
        <Caption style={styles.email}>{email}</Caption>

        <View style={styles.xpContainer}>
          <View style={styles.xpHeader}>
            <Caption style={styles.xpLabel}>Niveau {level}</Caption>
            <Caption style={styles.xpLabel}>
              {currentXP} / {nextLevelXP} XP
            </Caption>
          </View>
          <ProgressBar progress={xpProgress} />
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.lg,
  },
  gradient: {
    padding: spacing.xl,
    paddingTop: spacing.xxl,
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: spacing.md,
  },
  badgePosition: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  badge: {
    borderWidth: 2,
    borderColor: colors.warning,
  },
  username: {
    color: colors.white,
    marginBottom: spacing.xs,
  },
  email: {
    color: colors.overlayStrong,
    marginBottom: spacing.lg,
  },
  xpContainer: {
    width: "100%",
    gap: spacing.xs,
  },
  xpHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  xpLabel: {
    color: colors.overlayStrong,
    fontSize: 11,
    fontWeight: "600",
  },
});
