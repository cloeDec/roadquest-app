import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, type ColorName } from "../theme";

export type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

interface IconProps {
  name: IconName;
  size?: number;
  color?: ColorName;
}

export function Icon({ name, size = 24, color = "textPrimary" }: IconProps) {
  return (
    <MaterialCommunityIcons
      name={name}
      size={size}
      color={colors[color]}
    />
  );
}
