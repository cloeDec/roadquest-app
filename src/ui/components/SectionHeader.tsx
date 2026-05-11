import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Caption } from "./Text";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onAction,
}: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text variant="h3">{title}</Text>
        {subtitle && (
          <Caption color="textSecondary">{subtitle}</Caption>
        )}
      </View>
      {actionLabel && onAction && (
        <TouchableOpacity onPress={onAction}>
          <Text variant="body" style={styles.action}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  titleContainer: {
    gap: spacing.xs,
  },
  action: {
    color: colors.brandPrimary,
  },
});
