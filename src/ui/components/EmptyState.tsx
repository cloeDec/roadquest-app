import { View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, Caption } from "./Text";
import { Button } from "./Button";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

interface EmptyStateProps {
  icon: IconName;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name={icon} size={64} color={colors.textTertiary} />
      <Text variant="h3" style={styles.title}>{title}</Text>
      {description && (
        <Caption color="textSecondary" style={styles.description}>
          {description}
        </Caption>
      )}
      {actionLabel && onAction && (
        <Button onPress={onAction} style={styles.button}>
          {actionLabel}
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxl * 2,
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  title: {
    marginTop: spacing.md,
    textAlign: "center",
  },
  description: {
    textAlign: "center",
  },
  button: {
    marginTop: spacing.md,
  },
});
