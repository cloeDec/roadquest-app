import { View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, Caption } from "./Text";
import { colors, ColorName } from "../theme/colors";
import { spacing } from "../theme/spacing";

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

interface StatItem {
  icon: IconName;
  iconColor?: ColorName;
  value: string | number;
  label: string;
}

interface StatsRowProps {
  stats: StatItem[];
}

export function StatsRow({ stats }: StatsRowProps) {
  return (
    <View style={styles.container}>
      {stats.map((stat, index) => (
        <View key={index} style={styles.statCard}>
          <MaterialCommunityIcons
            name={stat.icon}
            size={24}
            color={colors[stat.iconColor || "brandPrimary"]}
          />
          <Text variant="h3">{stat.value}</Text>
          <Caption color="textSecondary">{stat.label}</Caption>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: "center",
    gap: spacing.xs,
  },
});
