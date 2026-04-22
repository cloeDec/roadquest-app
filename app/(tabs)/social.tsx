import { View, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Caption } from "@/src/ui/components/Text";
import { colors, spacing } from "@/src/ui";
import { PostCard } from "@/src/components/social";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { toggleLike } from "@/src/store/slices/socialSlice";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { RidePost } from "@/src/store/slices/socialSlice";

export default function SocialScreen() {
  const dispatch = useAppDispatch();
  const { feed } = useAppSelector((state) => state.social);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"feed" | "routes">("feed");

  // Données mockées pour le feed
  const mockFeed: RidePost[] = [
    {
      post_id: "1",
      user_id: "user-1",
      author: {
        user_id: "user-1",
        username: "MaxRider",
        avatar_url: undefined,
        level: 15,
      },
      ride_id: "ride-1",
      title: "Balade dans les Vosges",
      description: "Superbe journée sur les routes des Vosges ! Les virages du Col de la Schlucht sont incroyables. Météo parfaite et vue magnifique sur les sapins.",
      distance_km: 145.8,
      duration_minutes: 180,
      photos: [],
      likes_count: 24,
      comments_count: 5,
      is_liked: false,
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      post_id: "2",
      user_id: "user-2",
      author: {
        user_id: "user-2",
        username: "BikerGirl",
        avatar_url: undefined,
        level: 22,
      },
      ride_id: "ride-2",
      title: "Tour de la Côte d'Opale",
      description: "Magnifique balade le long de la côte. Le Cap Blanc-Nez et le Cap Gris-Nez offrent des points de vue spectaculaires !",
      distance_km: 89.3,
      duration_minutes: 120,
      photos: [],
      likes_count: 42,
      comments_count: 12,
      is_liked: true,
      created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
      post_id: "3",
      user_id: "user-3",
      author: {
        user_id: "user-3",
        username: "SpeedDemon",
        avatar_url: undefined,
        level: 8,
      },
      ride_id: "ride-3",
      title: "Première sortie de l'année",
      description: "Enfin de retour sur la route ! Petit tour dans la campagne pour reprendre en main ma MT-07. Hâte de faire de plus longues balades.",
      distance_km: 52.7,
      duration_minutes: 75,
      photos: [],
      likes_count: 18,
      comments_count: 3,
      is_liked: false,
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

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
