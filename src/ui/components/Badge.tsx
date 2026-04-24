import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { colors, spacing, borderRadius, type ColorName } from "../theme";
import { Text } from "./Text";
import { Icon, type IconName } from "./Icon";

interface BadgeProps {
  value: string | number;
  icon?: IconName;
  iconColor?: ColorName;
  backgroundColor?: ColorName;
  style?: ViewStyle;
}

export function Badge({
  value,
  icon,
  iconColor = "warning",
  backgroundColor = "white",
  style,
}: BadgeProps) {
  return (
    <View style={[styles.container, { backgroundColor: colors[backgroundColor] }, style]}>
      {icon && <Icon name={icon} size={12} color={iconColor} />}
      <Text variant="caption" bold style={styles.text}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.lg,
    gap: spacing.xs,
  },
  text: {
    color: colors.black,
    fontSize: 12,
  },
});
