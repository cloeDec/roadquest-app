import React from "react";
import { View, ViewProps, StyleSheet, SafeAreaView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, spacing, gradients, type GradientName } from "../theme";

interface ContainerProps extends ViewProps {
  gradient?: GradientName;
  padding?: keyof typeof spacing;
  safe?: boolean;
  centered?: boolean;
  children: React.ReactNode;
}

export function Container({
  gradient,
  padding = "md",
  safe = false,
  centered = false,
  style,
  children,
  ...props
}: ContainerProps) {
  const containerStyles = [
    styles.base,
    { padding: spacing[padding] },
    centered && styles.centered,
    style,
  ];

  const content = <View style={containerStyles} {...props}>{children}</View>;

  if (gradient) {
    return (
      <LinearGradient
        colors={gradients[gradient]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      >
        {safe ? <SafeAreaView style={styles.safeArea}>{content}</SafeAreaView> : content}
      </LinearGradient>
    );
  }

  if (safe) {
    return (
      <SafeAreaView style={[styles.base, { backgroundColor: colors.backgroundPrimary }]}>
        {content}
      </SafeAreaView>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
});
