import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { colors, spacing } from "../theme";
import { Text } from "./Text";

interface SectionProps {
  title: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Section({ title, children, style }: SectionProps) {
  return (
    <View style={[styles.section, style]}>
      <Text variant="h3" style={styles.title}>
        {title}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  title: {
    marginBottom: spacing.md,
  },
});
