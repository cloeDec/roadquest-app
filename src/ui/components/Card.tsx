import React from "react";
import { View, ViewProps, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, spacing, borderRadius, gradients, type GradientName } from "../theme";

interface CardProps extends ViewProps {
  variant?: "default" | "elevated" | "outlined";
  gradient?: GradientName;
  padding?: keyof typeof spacing;
  children: React.ReactNode;
}

export function Card({
  variant = "default",
  gradient,
  padding = "md",
  style,
  children,
  ...props
}: CardProps) {
  const cardStyles = [
    styles.base,
    styles[variant],
    { padding: spacing[padding] },
    style,
  ];

  if (gradient) {
    return (
      <LinearGradient
        colors={gradients[gradient]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={cardStyles}
        {...props}
      >
        {children}
      </LinearGradient>
    );
  }

  return (
    <View style={cardStyles} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.md,
  },
  default: {
    backgroundColor: colors.backgroundSecondary,
  },
  elevated: {
    backgroundColor: colors.backgroundSecondary,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  outlined: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.border,
  },
});
