import { View, ViewStyle, StyleSheet } from "react-native";
import { spacing, SpacingSize } from "../theme/spacing";

interface ColumnProps {
  children: React.ReactNode;
  gap?: SpacingSize;
  align?: "flex-start" | "center" | "flex-end" | "stretch";
  justify?: "flex-start" | "center" | "flex-end" | "space-between" | "space-around";
  style?: ViewStyle;
}

export function Column({
  children,
  gap = "sm",
  align = "stretch",
  justify = "flex-start",
  style,
}: ColumnProps) {
  return (
    <View
      style={[
        styles.column,
        { gap: spacing[gap], alignItems: align, justifyContent: justify },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    flexDirection: "column",
  },
});
