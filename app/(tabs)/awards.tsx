import { StyleSheet, ScrollView, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader, SectionHeader, StatsRow, EmptyState, Column } from "@/src/ui";
import { colors, spacing } from "@/src/ui/theme";
import { AchievementCard } from "@/src/components/achievements";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { loadAchievements, loadUserAchievements } from "@/src/store/slices/achievementsSlice";
import { useState, useMemo, useEffect, useCallback } from "react";

export default function AwardsScreen() {
  const dispatch = useAppDispatch();
  const { userAchievements, isLoading } = useAppSelector((state) => state.achievements);
  const [refreshing, setRefreshing] = useState(false);

  const loadAll = useCallback(() => {
    dispatch(loadAchievements() as any);
    dispatch(loadUserAchievements() as any);
  }, [dispatch]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const achievements = userAchievements;

  const { unlocked, inProgress, stats } = useMemo(() => {
    const unlocked = achievements
      .filter((a) => a.is_unlocked)
      .sort((a, b) => new Date(b.unlocked_at || 0).getTime() - new Date(a.unlocked_at || 0).getTime());

    const inProgress = achievements
      .filter((a) => !a.is_unlocked)
      .sort((a, b) => {
        const progressA = a.condition_value > 0 ? a.progress / a.condition_value : 0;
        const progressB = b.condition_value > 0 ? b.progress / b.condition_value : 0;
        return progressB - progressA;
      });

    const xpEarned = unlocked.reduce((sum, a) => sum + a.xp_reward, 0);
    const progressPercentage = achievements.length > 0
      ? Math.round((unlocked.length / achievements.length) * 100)
      : 0;

    return {
      unlocked,
      inProgress,
      stats: [
        { icon: "trophy" as const, iconColor: "brandPrimary" as const, value: unlocked.length + "/" + achievements.length, label: "Débloqués" },
        { icon: "chart-line" as const, iconColor: "success" as const, value: progressPercentage + "%", label: "Progression" },
        { icon: "star" as const, iconColor: "warning" as const, value: xpEarned, label: "XP Gagnés" },
      ],
    };
  }, [achievements]);

  const onRefresh = async () => {
    setRefreshing(true);
    loadAll();
    setRefreshing(false);
  };

  const unlockedTitle = "🏆 Débloqués (" + unlocked.length + ")";
  const inProgressTitle = "🎯 En cours (" + inProgress.length + ")";

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <ScreenHeader title="Trophées">
          <StatsRow stats={stats} />
        </ScreenHeader>

        <Column gap="xl" style={styles.sections}>
          {achievements.length === 0 ? (
            <EmptyState
              icon="trophy-outline"
              title={isLoading ? "Chargement..." : "Aucun achievement"}
              description="Partez en balade pour en gagner !"
            />
          ) : (
            <>
              <Column gap="md">
                <SectionHeader title={unlockedTitle} />
                {unlocked.length > 0 ? (
                  unlocked.map((achievement) => (
                    <AchievementCard key={achievement.achievement_id} achievement={achievement} />
                  ))
                ) : (
                  <EmptyState
                    icon="trophy-outline"
                    title="Aucun trophée"
                    description="Partez en balade pour en gagner !"
                  />
                )}
              </Column>

              <Column gap="md">
                <SectionHeader title={inProgressTitle} />
                {inProgress.map((achievement) => (
                  <AchievementCard key={achievement.achievement_id} achievement={achievement} />
                ))}
              </Column>
            </>
          )}
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
    paddingBottom: spacing.xl,
  },
  sections: {
    padding: spacing.md,
  },
});
