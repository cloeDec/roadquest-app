import { StyleSheet, ScrollView, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader, TabBar, EmptyState, FAB, Column } from "@/src/ui";
import { colors, spacing } from "@/src/ui/theme";
import { PostCard } from "@/src/components/social";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { toggleLike } from "@/src/store/slices/socialSlice";
import { useState } from "react";
import { mockFeed } from "@/src/mocks";

const TABS = [
  { key: "feed", label: "Fil d'actualité", icon: "home" as const },
  { key: "routes", label: "Routes partagées", icon: "map-marker-path" as const },
];

export default function SocialScreen() {
  const dispatch = useAppDispatch();
  const { feed } = useAppSelector((state) => state.social);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("feed");

  const displayFeed = feed.length > 0 ? feed : mockFeed;

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleLike = (postId: string) => {
    dispatch(toggleLike(postId));
  };

  const handleComment = (postId: string) => {
  };

  const handleProfilePress = (userId: string) => {
  };

  const handleCreatePost = () => {
  };

  const renderFeedContent = () => {
    if (displayFeed.length === 0) {
      return (
        <EmptyState
          icon="account-group-outline"
          title="Aucune publication"
          description="Suivez d'autres riders pour voir leurs balades"
        />
      );
    }

    return displayFeed.map((post) => (
      <PostCard
        key={post.post_id}
        post={post}
        onLike={handleLike}
        onComment={handleComment}
        onProfilePress={handleProfilePress}
      />
    ));
  };

  const renderRoutesContent = () => (
    <EmptyState
      icon="map-marker-path"
      title="Routes partagées"
      description="Découvrez les meilleures routes des autres riders (Fonctionnalité à venir)"
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

      {activeTab === "feed" && <FAB icon="plus" onPress={handleCreatePost} />}
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
