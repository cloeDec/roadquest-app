import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { colors, spacing } from "../theme";
import { Text } from "./Text";
import { Icon, type IconName } from "./Icon";

interface MenuItemProps {
  icon: IconName;
  label: string;
  onPress?: () => void;
  showChevron?: boolean;
}

export function MenuItem({
  icon,
  label,
  onPress,
  showChevron = true,
}: MenuItemProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.left}>
        <Icon name={icon} size={24} color="textPrimary" />
        <Text variant="body">{label}</Text>
      </View>
      {showChevron && (
        <Icon name="chevron-right" size={24} color="textTertiary" />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.md,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
});
