import React from "react";
import { View, StyleSheet } from "react-native";
import { StatCard } from "@/src/ui";
import { spacing } from "@/src/ui/theme";
import type { IconName } from "@/src/ui/components/Icon";
import type { ColorName } from "@/src/ui/theme";

interface Stat {
  icon: IconName;
  iconColor: ColorName;
  value: string | number;
  label: string;
}

interface StatsGridProps {
  stats: Stat[];
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <View style={styles.grid}>
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          icon={stat.icon}
          iconColor={stat.iconColor}
          value={stat.value}
          label={stat.label}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
});
