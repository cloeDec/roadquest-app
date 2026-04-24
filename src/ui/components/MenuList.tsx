import React, { Children, isValidElement, cloneElement } from "react";
import { View, StyleSheet } from "react-native";
import { Card } from "./Card";
import { Divider } from "./Divider";
import { spacing } from "../theme";

interface MenuListProps {
  children: React.ReactNode;
}

export function MenuList({ children }: MenuListProps) {
  const items = Children.toArray(children).filter(isValidElement);

  return (
    <Card variant="outlined" style={styles.card}>
      {items.map((child, index) => (
        <View key={index}>
          {child}
          {index < items.length - 1 && (
            <Divider marginLeft={spacing.md + 24 + spacing.md} />
          )}
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 0,
  },
});
