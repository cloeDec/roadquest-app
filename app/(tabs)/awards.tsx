import { View, StyleSheet, Text } from "react-native";
import { colors } from "@/src/ui";

export default function AwardsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Awards Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.backgroundPrimary,
  },
  text: {
    color: colors.textPrimary,
    fontSize: 18,
  },
});
