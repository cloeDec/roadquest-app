import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { colors, spacing, borderRadius, type ColorName } from "../theme";

interface ProgressBarProps {
  progress: number; // 0-100
  height?: number;
  backgroundColor?: ColorName;
  fillColor?: ColorName;
  style?: ViewStyle;
}

export function ProgressBar({
  progress,
  height = 8,
  backgroundColor = "overlayStrong",
  fillColor = "white",
  style,
}: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <View
      style={[
        styles.container,
        { height, backgroundColor: colors[backgroundColor] },
        style,
      ]}
    >
      <View
        style={[
          styles.fill,
          {
            width: `${clampedProgress}%`,
            backgroundColor: colors[fillColor],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.sm,
    overflow: "hidden",
    width: "100%",
  },
  fill: {
    height: "100%",
    borderRadius: borderRadius.sm,
  },
});
