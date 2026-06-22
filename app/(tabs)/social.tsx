import { StyleSheet, ScrollView, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader, TabBar, EmptyState, Column } from "@/src/ui";
import { colors, spacing } from "@/src/ui/theme";
import { PostCard } from "@/src/components/social";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { loadFeed, likePost } from "@/src/store/slices/socialSlice";
import { useState, useEffect, useCallback } from "react";

const TABS = [
  { key: "feed", label: "Fil d'actualité", icon: "home" as const },
  { key: "routes", label: "Routes partagées", icon: "map-marker-path" as const },
];

export default function SocialScreen() {
  const dispatch = useAppDispatch();
  const { feed, isLoading } = useAppSelector((state) => state.social);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("feed");

  useEffect(() => {
    dispatch(loadFeed() as any);
  }, [dispatch]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(loadFeed() as any);
    setRefreshing(false);
  }, [dispatch]);

  const handleLike = (postId: string) => {
    dispatch(likePost(postId) as any);
  };

  // Le partage d'un trajet se fait depuis l'écran de détail d'un trajet
  // (bouton "Partager sur le fil"), car une publication est toujours liée à
  // un trajet précis. Le fil ne fait donc qu'afficher et liker les posts.

  const renderFeedContent = () => {
    if (feed.length === 0) {
      return (
        <EmptyState
          icon="account-group-outline"
          title={isLoading ? "Chargement..." : "Aucune publication"}
          description="Suivez d'autres riders pour voir leurs balades, ou terminez une sortie et partagez-la depuis son détail."
        />
      );
    }

    return feed.map((post) => (
      <PostCard
        key={post.post_id}
        post={post}
        onLike={handleLike}
      />
    ));
  };

  const renderRoutesContent = () => (
    <EmptyState
      icon="map-marker-path"
      title="Routes partagées"
      description="Découvrez les meilleures routes des autres riders (fonctionnalité à venir)"
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScreenHeader title="Social">
        <TabBar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
      </ScreenHeader>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Column gap="md">
          {activeTab === "feed" ? renderFeedContent() : renderRoutesContent()}
        </Column>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  scrollContent: {
    padding: spacing.md,
    flexGrow: 1,
  },
});
