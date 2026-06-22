import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Caption } from "@/src/ui/components/Text";
import { ScreenHeader } from "@/src/ui";
import { colors, spacing } from "@/src/ui/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function SocialScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScreenHeader title="Social" />
      <View style={styles.content}>
        <MaterialCommunityIcons
          name="account-group-outline"
          size={80}
          color={colors.textTertiary}
        />
        <Text variant="h2" style={styles.title}>
          Arrive bientôt
        </Text>
        <Caption style={styles.description}>
          Partagez vos balades, suivez d'autres riders et découvrez les meilleurs itinéraires de la communauté.
        </Caption>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  title: {
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  description: {
    textAlign: "center",
    color: colors.textSecondary,
    lineHeight: 22,
  },
});
