import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { colors, spacing, type ColorName } from "../theme";

interface DividerProps {
  color?: ColorName;
  marginLeft?: number;
  style?: ViewStyle;
}

export function Divider({
  color = "border",
  marginLeft = 0,
  style,
}: DividerProps) {
  return (
    <View
      style={[
        styles.divider,
        { backgroundColor: colors[color], marginLeft },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
  },
});
