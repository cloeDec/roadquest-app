import { TextStyle } from "react-native";

export const typography = {
  // Headings
  h1: {
    fontFamily: "Poppins",
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 40,
  } as TextStyle,

  h2: {
    fontFamily: "Poppins",
    fontSize: 24,
    fontWeight: "semibold",
    lineHeight: 30,
  } as TextStyle,

  h3: {
    fontFamily: "Poppins",
    fontSize: 20,
    fontWeight: "semibold",
    lineHeight: 26,
  } as TextStyle,

  h4: {
    fontFamily: "Poppins",
    fontSize: 18,
    fontWeight: "medium",
    lineHeight: 22,
  } as TextStyle,

  // Body text
  body: {
    fontFamily: "Poppins",
    fontSize: 14,
    fontWeight: "regular",
    lineHeight: 22,
  } as TextStyle,

  bodyLarge: {
    fontFamily: "Poppins",
    fontSize: 16,
    fontWeight: "regular",
    lineHeight: 26,
  } as TextStyle,

  small: {
    fontFamily: "Poppins",
    fontSize: 10,
    fontWeight: "medium",
    lineHeight: 18,
  } as TextStyle,

  // Caption
  caption: {
    fontFamily: "Poppins",
    fontSize: 12,
    fontWeight: "medium",
    lineHeight: 16,
  } as TextStyle,
} as const;

export type TypographyVariant = keyof typeof typography;
