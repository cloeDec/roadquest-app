import React, { useState } from "react";
import {
  TextInput,
  TextInputProps,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Text } from "./Text";
import { colors, spacing, borderRadius } from "../theme";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  fullWidth = true,
  style,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, fullWidth && styles.fullWidth]}>
      {label && (
        <Text variant="small" color="textSecondary" style={styles.label}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          error && styles.inputContainerError,
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          {...props}
          style={[styles.input, leftIcon && styles.inputWithLeftIcon, rightIcon && styles.inputWithRightIcon, style]}
          placeholderTextColor={colors.textTertiary}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
        />
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
      {error && (
        <Text variant="caption" color="danger" style={styles.errorText}>
          {error}
        </Text>
      )}
      {hint && !error && (
        <Text variant="caption" color="textTertiary" style={styles.hintText}>
          {hint}
        </Text>
      )}
    </View>
  );
}

export function PasswordInput(props: Omit<InputProps, "secureTextEntry" | "rightIcon">) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input
      {...props}
      secureTextEntry={!showPassword}
      rightIcon={
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Text color="brandPrimary">{showPassword ? "Cacher" : "Voir"}</Text>
        </TouchableOpacity>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  fullWidth: {
    width: "100%",
  },
  label: {
    marginBottom: spacing.xs,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: "transparent",
  },
  inputContainerFocused: {
    borderColor: colors.brandPrimary,
  },
  inputContainerError: {
    borderColor: colors.danger,
  },
  input: {
    flex: 1,
    padding: spacing.md,
    color: colors.textPrimary,
    fontSize: 16,
  },
  inputWithLeftIcon: {
    paddingLeft: spacing.sm,
  },
  inputWithRightIcon: {
    paddingRight: spacing.sm,
  },
  leftIcon: {
    paddingLeft: spacing.md,
  },
  rightIcon: {
    paddingRight: spacing.md,
  },
  errorText: {
    marginTop: spacing.xs,
  },
  hintText: {
    marginTop: spacing.xs,
  },
});
