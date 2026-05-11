import { View, ViewStyle, StyleSheet } from "react-native";
import { spacing, SpacingSize } from "../theme/spacing";

interface RowProps {
  children: React.ReactNode;
  gap?: SpacingSize;
  align?: "flex-start" | "center" | "flex-end" | "stretch";
  justify?: "flex-start" | "center" | "flex-end" | "space-between" | "space-around";
  wrap?: boolean;
  style?: ViewStyle;
}

export function Row({
  children,
  gap = "sm",
  align = "center",
  justify = "flex-start",
  wrap = false,
  style,
}: RowProps) {
  return (
    <View
      style={[
        styles.row,
        { gap: spacing[gap], alignItems: align, justifyContent: justify },
        wrap && styles.wrap,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  wrap: {
    flexWrap: "wrap",
  },
});
