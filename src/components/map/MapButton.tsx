import React from "react";
import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/ui/theme";

type IoniconsName = keyof typeof Ionicons.glyphMap;

interface MapButtonProps {
  icon: IoniconsName;
  onPress: () => void;
  variant?: "default" | "primary" | "danger";
  size?: "small" | "large";
  style?: ViewStyle;
}

export function MapButton({
  icon,
  onPress,
  variant = "default",
  size = "small",
  style,
}: MapButtonProps) {
  const buttonSize = size === "large" ? 72 : 48;
  const iconSize = size === "large" ? 32 : 24;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          width: buttonSize,
          height: buttonSize,
          borderRadius: buttonSize / 2,
        },
        variant === "primary" && styles.primary,
        variant === "danger" && styles.danger,
        style,
      ]}
      onPress={onPress}
    >
      <Ionicons name={icon} size={iconSize} color={colors.textPrimary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  primary: {
    backgroundColor: colors.accentPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  danger: {
    backgroundColor: colors.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
