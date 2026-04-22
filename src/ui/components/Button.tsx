import React from "react";
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "./Text";
import { colors, gradients, spacing, borderRadius, type GradientName } from "../theme";

interface ButtonProps extends TouchableOpacityProps {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "small" | "medium" | "large";
  gradient?: GradientName;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "medium",
  gradient,
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  disabled,
  style,
  children,
  ...props
}: ButtonProps) {
  const buttonStyles = [
    styles.base,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const textColor = variant === "outline" || variant === "ghost" ? "brandPrimary" : "textPrimary";

  const content = (
    <>
      {loading ? (
        <ActivityIndicator color={colors[textColor]} size="small" />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text
            variant={size === "small" ? "small" : size === "large" ? "bodyLarge" : "body"}
            color={textColor}
            bold
            style={[
              leftIcon ? styles.textWithLeftIcon : undefined,
              rightIcon ? styles.textWithRightIcon : undefined,
            ]}
          >
            {children}
          </Text>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </>
  );

  if (gradient && variant === "primary") {
    return (
      <TouchableOpacity {...props} disabled={disabled || loading} activeOpacity={0.8}>
        <LinearGradient
          colors={gradients[gradient]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={buttonStyles}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity {...props} disabled={disabled || loading} style={buttonStyles} activeOpacity={0.8}>
      {content}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: borderRadius.md,
  },
  primary: {
    backgroundColor: colors.brandPrimary,
  },
  secondary: {
    backgroundColor: colors.accentPrimary,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: colors.brandPrimary,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  danger: {
    backgroundColor: colors.danger,
  },
  small: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  medium: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  large: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  fullWidth: {
    width: "100%",
  },
  disabled: {
    opacity: 0.5,
  },
  textWithLeftIcon: {
    marginLeft: spacing.sm,
  },
  textWithRightIcon: {
    marginRight: spacing.sm,
  },
});
