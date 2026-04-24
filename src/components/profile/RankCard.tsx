import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text, Caption, Icon } from "@/src/ui";
import { colors, spacing, type ColorName } from "@/src/ui/theme";

interface RankCardProps {
  level: number;
  xp: number;
}

function getRankInfo(level: number): { title: string; emoji: string; color: ColorName } {
  if (level <= 10) {
    return { title: "Débutant", emoji: "🌟", color: "rankBronze" };
  }
  if (level <= 25) {
    return { title: "Confirmé", emoji: "⭐", color: "rankSilver" };
  }
  if (level <= 50) {
    return { title: "Expert", emoji: "✨", color: "rankPlatinum" };
  }
  return { title: "Légende", emoji: "💫", color: "rankGold" };
}

export function RankCard({ level, xp }: RankCardProps) {
  const { title, emoji, color } = getRankInfo(level);

  return (
    <Card variant="elevated" padding="md">
      <View style={styles.container}>
        <Icon name="shield-star" size={48} color={color} />
        <View style={styles.info}>
          <Text variant="h3">
            {emoji} {title}
          </Text>
          <Caption color="textSecondary">
            Niveau {level} • {xp.toLocaleString()} XP
          </Caption>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  info: {
    flex: 1,
    gap: spacing.xs,
  },
});
