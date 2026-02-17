import React from "react";
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from "react-native";
import { colors, typography, type TypographyVariant } from "../theme";

interface TextProps extends RNTextProps {
  variant?: TypographyVariant;
  color?: keyof typeof colors;
  center?: boolean;
  bold?: boolean;
  italic?: boolean;
}

export function Text({
  variant = "body",
  color = "textPrimary",
  center = false,
  bold = false,
  italic = false,
  style,
  children,
  ...props
}: TextProps) {
  return (
    <RNText
      style={[
        typography[variant],
        { color: colors[color] },
        center && styles.center,
        bold && styles.bold,
        italic && styles.italic,
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
}

// Composants de titre raccourcis
export function H1(props: Omit<TextProps, "variant">) {
  return <Text variant="h1" {...props} />;
}

export function H2(props: Omit<TextProps, "variant">) {
  return <Text variant="h2" {...props} />;
}

export function H3(props: Omit<TextProps, "variant">) {
  return <Text variant="h3" {...props} />;
}

export function H4(props: Omit<TextProps, "variant">) {
  return <Text variant="h4" {...props} />;
}

export function Body(props: Omit<TextProps, "variant">) {
  return <Text variant="body" {...props} />;
}

export function BodyLarge(props: Omit<TextProps, "variant">) {
  return <Text variant="bodyLarge" {...props} />;
}

export function Small(props: Omit<TextProps, "variant">) {
  return <Text variant="small" {...props} />;
}

export function Caption(props: Omit<TextProps, "variant">) {
  return <Text variant="caption" {...props} />;
}

const styles = StyleSheet.create({
  center: {
    textAlign: "center",
  },
  bold: {
    fontWeight: "bold",
  },
  italic: {
    fontStyle: "italic",
  },
});
