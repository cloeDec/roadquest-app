import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/src/ui/components/Text";
import { colors, spacing } from "@/src/ui";
import { AchievementCard } from "@/src/components/achievements";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { loadUserAchievements } from "@/src/store/slices/achievementsSlice";
import { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function AwardsScreen() {
  const dispatch = useAppDispatch();
  const { userAchievements, stats, isLoading } = useAppSelector((state) => state.achievements);
  const [refreshing, setRefreshing] = useState(false);

  // Données de test pour l'affichage immédiat
  const mockAchievements = [
    {
      achievement_id: "1",
      achievement_key: "first_ride",
      name: "Premier Trajet",
      description: "Effectuer votre premier trajet moto",
      xp_reward: 100,
      badge_icon: "flag-checkered",
      category: "distance" as const,
      requirement_type: "count" as const,
      requirement_value: 1,
      rarity: "common" as const,
      progress: 1,
      is_unlocked: true,
      unlocked_at: "2024-01-15T10:30:00Z"
    },
    {
      achievement_id: "2",
      achievement_key: "poi_hunter",
      name: "Chasseur de POI",
      description: "Découvrir votre premier point d'intérêt",
      xp_reward: 100,
      badge_icon: "map-marker-star",
      category: "pois" as const,
      requirement_type: "count" as const,
      requirement_value: 1,
      rarity: "common" as const,
      progress: 1,
      is_unlocked: true,
      unlocked_at: "2024-01-16T14:20:00Z"
    },
    {
      achievement_id: "3",
      achievement_key: "century_rider",
      name: "Centurion",
      description: "Parcourir 100 km en une seule sortie",
      xp_reward: 200,
      badge_icon: "highway",
      category: "distance" as const,
      requirement_type: "total" as const,
      requirement_value: 100,
      rarity: "rare" as const,
      progress: 45,
      is_unlocked: false
    },
    {
      achievement_id: "4",
      achievement_key: "col_beginner",
      name: "Grimpeur Débutant",
      description: "Franchir votre premier col",
      xp_reward: 150,
      badge_icon: "image-filter-hdr",
      category: "cols" as const,
      requirement_type: "count" as const,
      requirement_value: 1,
      rarity: "common" as const,
      progress: 0,
      is_unlocked: false
    },
    {
      achievement_id: "5",
      achievement_key: "poi_collector",
      name: "Collectionneur",
      description: "Découvrir 10 POIs différents",
      xp_reward: 300,
      badge_icon: "trophy",
      category: "pois" as const,
      requirement_type: "unique" as const,
      requirement_value: 10,
      rarity: "rare" as const,
      progress: 3,
      is_unlocked: false
    },
    {
      achievement_id: "6",
      achievement_key: "explorer",
      name: "Explorateur",
      description: "Débloquer votre première région",
      xp_reward: 200,
      badge_icon: "map",
      category: "regions" as const,
      requirement_type: "count" as const,
      requirement_value: 1,
      rarity: "epic" as const,
      progress: 1,
      is_unlocked: true,
      unlocked_at: "2024-01-20T09:15:00Z"
    },
    {
      achievement_id: "7",
      achievement_key: "marathon",
      name: "Marathon",
      description: "Parcourir 1000 km au total",
      xp_reward: 500,
      badge_icon: "road",
      category: "distance" as const,
      requirement_type: "total" as const,
      requirement_value: 1000,
      rarity: "epic" as const,
      progress: 234,
      is_unlocked: false
    },
    {
      achievement_id: "8",
      achievement_key: "col_master",
      name: "Maître des Cols",
      description: "Franchir 20 cols différents",
      xp_reward: 1500,
      badge_icon: "trophy-award",
      category: "cols" as const,
      requirement_type: "unique" as const,
      requirement_value: 20,
      rarity: "legendary" as const,
      progress: 0,
      is_unlocked: false
    }
  ];

  // Utiliser les données mockées ou les vraies données
  const achievements = userAchievements.length > 0 ? userAchievements : mockAchievements;

  const unlockedCount = achievements.filter(a => a.is_unlocked).length;
  const totalCount = achievements.length;
  const progressPercentage = Math.round((unlockedCount / totalCount) * 100);

  useEffect(() => {
    // Charger les achievements réels depuis l'API
    // dispatch(loadUserAchievements() as any);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // await dispatch(loadUserAchievements() as any);
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header avec statistiques */}
        <View style={styles.header}>
          <Text variant="h2">Trophées</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="trophy" size={24} color={colors.brandPrimary} />
              <Text variant="h3">{unlockedCount}/{totalCount}</Text>
              <Text variant="caption" color="textSecondary">Débloqués</Text>
            </View>

            <View style={styles.statCard}>
              <MaterialCommunityIcons name="chart-line" size={24} color={colors.success} />
              <Text variant="h3">{progressPercentage}%</Text>
              <Text variant="caption" color="textSecondary">Progression</Text>
            </View>

            <View style={styles.statCard}>
              <MaterialCommunityIcons name="star" size={24} color={colors.warning} />
              <Text variant="h3">
                {achievements.filter(a => a.is_unlocked).reduce((sum, a) => sum + a.xp_reward, 0)}
              </Text>
              <Text variant="caption" color="textSecondary">XP Gagnés</Text>
            </View>
          </View>
        </View>

        {/* Liste des achievements débloqués */}
        <View style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>
            🏆 Débloqués ({unlockedCount})
          </Text>
          {achievements
            .filter(a => a.is_unlocked)
            .sort((a, b) => {
              const dateA = new Date(a.unlocked_at || 0).getTime();
              const dateB = new Date(b.unlocked_at || 0).getTime();
              return dateB - dateA;
            })
            .map(achievement => (
              <AchievementCard
                key={achievement.achievement_id}
                achievement={achievement}
              />
            ))}
          {unlockedCount === 0 && (
            <Text variant="body" color="textSecondary" style={styles.emptyText}>
              Aucun trophée débloqué pour le moment.
              Partez en balade pour en gagner !
            </Text>
          )}
        </View>

        {/* Liste des achievements en cours */}
        <View style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>
            🎯 En cours ({totalCount - unlockedCount})
          </Text>
          {achievements
            .filter(a => !a.is_unlocked)
            .sort((a, b) => {
              // Trier par progression (les plus proches d'être débloqués en premier)
              const progressA = a.requirement_value > 0 ? a.progress / a.requirement_value : 0;
              const progressB = b.requirement_value > 0 ? b.progress / b.requirement_value : 0;
              return progressB - progressA;
            })
            .map(achievement => (
              <AchievementCard
                key={achievement.achievement_id}
                achievement={achievement}
              />
            ))}
        </View>
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
  },
  header: {
    marginBottom: spacing.lg,
  },
  statsContainer: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: "center",
    gap: spacing.xs,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  emptyText: {
    textAlign: "center",
    padding: spacing.xl,
  },
});
