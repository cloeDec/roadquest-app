import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

interface FABProps {
  icon?: IconName;
  onPress: () => void;
  style?: ViewStyle;
  size?: "sm" | "md" | "lg";
  color?: string;
}

export function FAB({
  icon = "plus",
  onPress,
  style,
  size = "md",
  color = colors.brandPrimary,
}: FABProps) {
  const sizes = {
    sm: { button: 40, icon: 20 },
    md: { button: 56, icon: 28 },
    lg: { button: 72, icon: 36 },
  };

  const { button, icon: iconSize } = sizes[size];

  return (
    <TouchableOpacity
      style={[
        styles.fab,
        { width: button, height: button, borderRadius: button / 2, backgroundColor: color },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <MaterialCommunityIcons name={icon} size={iconSize} color={colors.white} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: spacing.xl,
    right: spacing.xl,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
