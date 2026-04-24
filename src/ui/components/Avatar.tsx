import React from "react";
import { View, Image, StyleSheet, ViewStyle } from "react-native";
import { colors, spacing } from "../theme";
import { Icon } from "./Icon";

type AvatarSize = "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  uri?: string;
  size?: AvatarSize;
  showBorder?: boolean;
  style?: ViewStyle;
}

const SIZES: Record<AvatarSize, number> = {
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
};

const ICON_SIZES: Record<AvatarSize, number> = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
};

export function Avatar({ uri, size = "md", showBorder = false, style }: AvatarProps) {
  const dimension = SIZES[size];
  const iconSize = ICON_SIZES[size];

  return (
    <View
      style={[
        styles.container,
        {
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
        },
        showBorder && styles.border,
        style,
      ]}
    >
      {uri ? (
        <Image source={{ uri }} style={styles.image} />
      ) : (
        <Icon name="account" size={iconSize} color="white" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.overlayMedium,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  border: {
    borderWidth: 4,
    borderColor: colors.white,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
