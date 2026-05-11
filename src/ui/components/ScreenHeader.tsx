import { View, StyleSheet } from "react-native";
import { Text } from "./Text";
import { spacing } from "../theme/spacing";

interface ScreenHeaderProps {
  title: string;
  children?: React.ReactNode;
}

export function ScreenHeader({ title, children }: ScreenHeaderProps) {
  return (
    <View style={styles.container}>
      <Text variant="h2">{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.md,
  },
});
