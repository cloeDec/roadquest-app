import { View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, Caption } from "./Text";
import { colors, ColorName } from "../theme/colors";
import { spacing } from "../theme/spacing";

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

interface IconTextProps {
  icon: IconName;
  iconColor?: ColorName;
  iconSize?: number;
  value: string | number;
  label?: string;
  layout?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";
}

export function IconText({
  icon,
  iconColor = "brandPrimary",
  iconSize,
  value,
  label,
  layout = "horizontal",
  size = "md",
}: IconTextProps) {
  const sizes = {
    sm: { icon: 16, text: "caption" as const },
    md: { icon: 20, text: "body" as const },
    lg: { icon: 24, text: "h3" as const },
  };

  const finalIconSize = iconSize || sizes[size].icon;
  const textVariant = sizes[size].text;

  const isVertical = layout === "vertical";

  return (
    <View style={[styles.container, isVertical && styles.vertical]}>
      <MaterialCommunityIcons
        name={icon}
        size={finalIconSize}
        color={colors[iconColor]}
      />
      <View style={isVertical ? styles.textVertical : styles.textHorizontal}>
        <Text variant={textVariant}>{value}</Text>
        {label && <Caption color="textSecondary">{label}</Caption>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  vertical: {
    flexDirection: "column",
    alignItems: "center",
  },
  textHorizontal: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: spacing.xs,
  },
  textVertical: {
    alignItems: "center",
    gap: spacing.xs,
  },
});
