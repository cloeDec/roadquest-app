import { View, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Caption } from "@/src/ui/components/Text";
import { colors, spacing } from "@/src/ui";
import { PostCard } from "@/src/components/social";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { toggleLike } from "@/src/store/slices/socialSlice";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { mockFeed } from "@/src/mocks";

export default function SocialScreen() {
  const dispatch = useAppDispatch();
  const { feed } = useAppSelector((state) => state.social);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"feed" | "routes">("feed");

  const displayFeed = feed.length > 0 ? feed : mockFeed;

  const onRefresh = async () => {
    setRefreshing(true);
    // TODO: dispatch(loadFeed());
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleLike = (postId: string) => {
    dispatch(toggleLike(postId));
  };

  const handleComment = (postId: string) => {
    console.log("Open comments for post:", postId);
    // TODO: Navigate to comments screen
  };

  const handleProfilePress = (userId: string) => {
    console.log("Open profile:", userId);
    // TODO: Navigate to public profile screen
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header avec onglets */}
      <View style={styles.header}>
        <Text variant="h2">Social</Text>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "feed" && styles.tabActive]}
            onPress={() => setActiveTab("feed")}
          >
            <MaterialCommunityIcons
              name="home"
              size={20}
              color={activeTab === "feed" ? colors.brandPrimary : colors.textSecondary}
            />
            <Text
              variant="body"
              style={[
                styles.tabText,
                activeTab === "feed" && styles.tabTextActive,
              ]}
            >
              Fil d&apos;actualité
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "routes" && styles.tabActive]}
            onPress={() => setActiveTab("routes")}
          >
            <MaterialCommunityIcons
              name="map-marker-path"
              size={20}
              color={activeTab === "routes" ? colors.brandPrimary : colors.textSecondary}
            />
            <Text
              variant="body"
              style={[
                styles.tabText,
                activeTab === "routes" && styles.tabTextActive,
              ]}
            >
              Routes partagées
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {activeTab === "feed" ? (
          <>
            {displayFeed.length > 0 ? (
              displayFeed.map((post) => (
                <PostCard
                  key={post.post_id}
                  post={post}
                  onLike={handleLike}
                  onComment={handleComment}
                  onProfilePress={handleProfilePress}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons
                  name="account-group-outline"
                  size={64}
                  color={colors.textTertiary}
                />
                <Text variant="h3" style={styles.emptyTitle}>
                  Aucune publication
                </Text>
                <Caption color="textSecondary" style={styles.emptyText}>
                  Suivez d&apos;autres riders pour voir leurs balades
                </Caption>
              </View>
            )}
          </>
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="map-marker-path"
              size={64}
              color={colors.textTertiary}
            />
            <Text variant="h3" style={styles.emptyTitle}>
              Routes partagées
            </Text>
            <Caption color="textSecondary" style={styles.emptyText}>
              Découvrez les meilleures routes des autres riders
            </Caption>
            <Caption color="textSecondary" style={styles.emptyText}>
              (Fonctionnalité à venir)
            </Caption>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      {activeTab === "feed" && (
        <TouchableOpacity style={styles.fab}>
          <MaterialCommunityIcons name="plus" size={28} color={colors.white} />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.md,
  },
  tabs: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.backgroundSecondary,
  },
  tabActive: {
    backgroundColor: colors.brandPrimary + "20",
  },
  tabText: {
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.brandPrimary,
    fontWeight: "600",
  },
  scrollContent: {
    padding: spacing.md,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxl * 2,
    gap: spacing.md,
  },
  emptyTitle: {
    marginTop: spacing.md,
  },
  emptyText: {
    textAlign: "center",
    paddingHorizontal: spacing.xl,
  },
  fab: {
    position: "absolute",
    bottom: spacing.xl,
    right: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.brandPrimary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
