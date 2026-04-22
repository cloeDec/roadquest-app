import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Caption } from "@/src/ui/components/Text";
import { Card } from "@/src/ui/components/Card";
import { Button } from "@/src/ui/components/Button";
import { colors, spacing, borderRadius } from "@/src/ui";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { logoutUser } from "@/src/store/slices/authSlice";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user: reduxUser } = useAppSelector((state) => state.auth);
  const { stats: achievementStats } = useAppSelector((state) => state.achievements);

  // Données de test si l'utilisateur n'est pas connecté
  const mockUser = {
    user_id: "test-id",
    email: "test@roadquest.com",
    username: "RiderTest",
    xp: 1250,
    level: 8,
    motorcycle: {
      brand: "Yamaha",
      model: "MT-07",
      year: 2023,
      photo_url: undefined
    },
    total_distance: 2340,
    total_trips: 42,
    regions_explored: 5
  };

  const user = reduxUser || mockUser;

  const stats = {
    totalTrips: user.total_trips || 42,
    totalDistance: user.total_distance || 2340,
    poisDiscovered: 12,
    regionsExplored: user.regions_explored || 5,
    achievements: achievementStats.unlocked || 3,
    currentLevel: user.level || 8,
    currentXP: user.xp || 1250,
    nextLevelXP: calculateXPForLevel((user.level || 8) + 1),
  };

  function calculateXPForLevel(level: number): number {
    return Math.floor(100 * Math.pow(level, 1.5));
  }

  const xpProgress = stats.nextLevelXP > 0
    ? Math.round((stats.currentXP / stats.nextLevelXP) * 100)
    : 0;

  const handleLogout = () => {
    if (!reduxUser) {
      Alert.alert("Mode démo", "Vous utilisez le mode démo. Connectez-vous pour accéder à votre vrai profil.");
      return;
    }

    Alert.alert(
      "Déconnexion",
      "Voulez-vous vraiment vous déconnecter ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Déconnexion",
          style: "destructive",
          onPress: async () => {
            await dispatch(logoutUser());
            router.replace("/(auth)/login");
          },
        },
      ]
    );
  };

  const handleEditMotorcycle = () => {
    Alert.alert("Modifier ma moto", "Cette fonctionnalité sera bientôt disponible");
  };

  const handleEditProfile = () => {
    Alert.alert("Modifier le profil", "Cette fonctionnalité sera bientôt disponible");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header avec avatar et niveau */}
        <View style={styles.header}>
          <LinearGradient
            colors={[colors.brandPrimary, colors.brandSecondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            {/* Avatar */}
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                {user.avatar_url ? (
                  <Image source={{ uri: user.avatar_url }} style={styles.avatarImage} />
                ) : (
                  <MaterialCommunityIcons
                    name="account"
                    size={48}
                    color={colors.white}
                  />
                )}
              </View>

              {/* Badge de niveau */}
              <View style={styles.levelBadge}>
                <MaterialCommunityIcons
                  name="star"
                  size={12}
                  color={colors.warning}
                />
                <Text variant="caption" bold style={styles.levelText}>
                  {stats.currentLevel}
                </Text>
              </View>
            </View>

            {/* Informations utilisateur */}
            <Text variant="h2" style={styles.username}>
              {user.username}
            </Text>
            <Caption style={styles.email}>{user.email}</Caption>

            {/* Barre de progression XP */}
            <View style={styles.xpContainer}>
              <View style={styles.xpHeader}>
                <Caption style={styles.xpLabel}>Niveau {stats.currentLevel}</Caption>
                <Caption style={styles.xpLabel}>
                  {stats.currentXP} / {stats.nextLevelXP} XP
                </Caption>
              </View>
              <View style={styles.xpBar}>
                <View
                  style={[styles.xpFill, { width: `${xpProgress}%` }]}
                />
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Ma Moto */}
        {user.motorcycle && (
          <View style={styles.section}>
            <Text variant="h3" style={styles.sectionTitle}>
              🏍️ Ma Moto
            </Text>

            <Card variant="elevated" padding="md">
              <TouchableOpacity onPress={handleEditMotorcycle}>
                <View style={styles.motorcycleContainer}>
                  <View style={styles.motorcyclePhoto}>
                    {user.motorcycle.photo_url ? (
                      <Image
                        source={{ uri: user.motorcycle.photo_url }}
                        style={styles.motorcycleImage}
                      />
                    ) : (
                      <MaterialCommunityIcons
                        name="motorbike"
                        size={64}
                        color={colors.brandPrimary}
                      />
                    )}
                  </View>
                  <View style={styles.motorcycleInfo}>
                    <Text variant="h3">
                      {user.motorcycle.brand} {user.motorcycle.model}
                    </Text>
                    <Caption color="textSecondary">
                      Année {user.motorcycle.year}
                    </Caption>
                    <TouchableOpacity style={styles.editButton}>
                      <MaterialCommunityIcons
                        name="pencil"
                        size={16}
                        color={colors.brandPrimary}
                      />
                      <Text variant="caption" style={styles.editButtonText}>
                        Modifier
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </Card>
          </View>
        )}

        {/* Statistiques globales */}
        <View style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>
            📊 Statistiques Globales
          </Text>

          <View style={styles.statsGrid}>
            <Card variant="outlined" padding="md" style={styles.statCard}>
              <MaterialCommunityIcons
                name="road-variant"
                size={32}
                color={colors.success}
              />
              <Text variant="h2" style={styles.statValue}>
                {stats.totalDistance.toLocaleString()}
              </Text>
              <Caption color="textSecondary">km totaux</Caption>
            </Card>

            <Card variant="outlined" padding="md" style={styles.statCard}>
              <MaterialCommunityIcons
                name="map-marker-path"
                size={32}
                color={colors.brandPrimary}
              />
              <Text variant="h2" style={styles.statValue}>
                {stats.totalTrips}
              </Text>
              <Caption color="textSecondary">trajets</Caption>
            </Card>

            <Card variant="outlined" padding="md" style={styles.statCard}>
              <MaterialCommunityIcons
                name="map"
                size={32}
                color={colors.error}
              />
              <Text variant="h2" style={styles.statValue}>
                {stats.regionsExplored}
              </Text>
              <Caption color="textSecondary">régions</Caption>
            </Card>

            <Card variant="outlined" padding="md" style={styles.statCard}>
              <MaterialCommunityIcons
                name="map-marker-star"
                size={32}
                color={colors.warning}
              />
              <Text variant="h2" style={styles.statValue}>
                {stats.poisDiscovered}
              </Text>
              <Caption color="textSecondary">POIs</Caption>
            </Card>

            <Card variant="outlined" padding="md" style={styles.statCard}>
              <MaterialCommunityIcons
                name="trophy"
                size={32}
                color="#9333EA"
              />
              <Text variant="h2" style={styles.statValue}>
                {stats.achievements}
              </Text>
              <Caption color="textSecondary">trophées</Caption>
            </Card>

            <Card variant="outlined" padding="md" style={styles.statCard}>
              <MaterialCommunityIcons
                name="star"
                size={32}
                color="#F59E0B"
              />
              <Text variant="h2" style={styles.statValue}>
                {stats.currentXP.toLocaleString()}
              </Text>
              <Caption color="textSecondary">XP total</Caption>
            </Card>
          </View>
        </View>

        {/* Rang de Rider */}
        <View style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>
            🎖️ Rang de Rider
          </Text>

          <Card variant="elevated" padding="md">
            <View style={styles.rankContainer}>
              <MaterialCommunityIcons
                name="shield-star"
                size={48}
                color={
                  stats.currentLevel <= 10 ? "#94A3B8" :
                  stats.currentLevel <= 25 ? "#3B82F6" :
                  stats.currentLevel <= 50 ? "#A855F7" : "#F59E0B"
                }
              />
              <View style={styles.rankInfo}>
                <Text variant="h3">
                  {stats.currentLevel <= 10 && "🌟 Débutant"}
                  {stats.currentLevel > 10 && stats.currentLevel <= 25 && "⭐ Confirmé"}
                  {stats.currentLevel > 25 && stats.currentLevel <= 50 && "✨ Expert"}
                  {stats.currentLevel > 50 && "💫 Légende"}
                </Text>
                <Caption color="textSecondary">
                  Niveau {stats.currentLevel} • {stats.currentXP.toLocaleString()} XP
                </Caption>
              </View>
            </View>
          </Card>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>
            ⚙️ Paramètres
          </Text>

          <Card variant="outlined" padding="none">
            <TouchableOpacity style={styles.menuItem} onPress={handleEditProfile}>
              <View style={styles.menuItemLeft}>
                <MaterialCommunityIcons
                  name="account-edit"
                  size={24}
                  color={colors.textPrimary}
                />
                <Text variant="body">Modifier le profil</Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color={colors.textTertiary}
              />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.menuItem} onPress={handleEditMotorcycle}>
              <View style={styles.menuItemLeft}>
                <MaterialCommunityIcons
                  name="motorbike"
                  size={24}
                  color={colors.textPrimary}
                />
                <Text variant="body">Ma moto</Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color={colors.textTertiary}
              />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <MaterialCommunityIcons
                  name="cog"
                  size={24}
                  color={colors.textPrimary}
                />
                <Text variant="body">Préférences</Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color={colors.textTertiary}
              />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <MaterialCommunityIcons
                  name="bell"
                  size={24}
                  color={colors.textPrimary}
                />
                <Text variant="body">Notifications</Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color={colors.textTertiary}
              />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <MaterialCommunityIcons
                  name="shield-check"
                  size={24}
                  color={colors.textPrimary}
                />
                <Text variant="body">Confidentialité</Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color={colors.textTertiary}
              />
            </TouchableOpacity>
          </Card>
        </View>

        {/* Bouton de déconnexion */}
        <View style={styles.logoutSection}>
          <Button
            variant="outlined"
            onPress={handleLogout}
            style={styles.logoutButton}
          >
            <View style={styles.logoutButtonContent}>
              <MaterialCommunityIcons
                name={reduxUser ? "logout" : "login"}
                size={20}
                color={colors.error}
              />
              <Text variant="body" style={styles.logoutButtonText}>
                {reduxUser ? "Déconnexion" : "Se connecter"}
              </Text>
            </View>
          </Button>
        </View>

        {!reduxUser && (
          <View style={styles.demoNotice}>
            <MaterialCommunityIcons
              name="information"
              size={16}
              color={colors.warning}
            />
            <Caption color="textSecondary">
              Mode démo - Connectez-vous pour voir vos vraies données
            </Caption>
          </View>
        )}

        <View style={styles.footer}>
          <Caption color="textTertiary">
            RoadQuest v1.0.0
          </Caption>
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
    paddingBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.lg,
  },
  headerGradient: {
    padding: spacing.xl,
    paddingTop: spacing.xxl,
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: spacing.md,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: colors.white,
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  levelBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    borderWidth: 2,
    borderColor: colors.warning,
  },
  levelText: {
    color: colors.textPrimary,
    fontSize: 12,
  },
  username: {
    color: colors.white,
    marginBottom: spacing.xs,
  },
  email: {
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: spacing.lg,
  },
  xpContainer: {
    width: "100%",
    gap: spacing.xs,
  },
  xpHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  xpLabel: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 11,
    fontWeight: "600",
  },
  xpBar: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: borderRadius.sm,
    overflow: "hidden",
  },
  xpFill: {
    height: "100%",
    backgroundColor: colors.white,
    borderRadius: borderRadius.sm,
  },
  section: {
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  motorcycleContainer: {
    flexDirection: "row",
    gap: spacing.md,
  },
  motorcyclePhoto: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  motorcycleImage: {
    width: "100%",
    height: "100%",
  },
  motorcycleInfo: {
    flex: 1,
    justifyContent: "center",
    gap: spacing.xs,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  editButtonText: {
    color: colors.brandPrimary,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    minWidth: "30%",
    alignItems: "center",
    gap: spacing.xs,
  },
  statValue: {
    marginTop: spacing.xs,
  },
  rankContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  rankInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.md,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: spacing.md + 24 + spacing.md,
  },
  logoutSection: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  logoutButton: {
    borderColor: colors.error,
  },
  logoutButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  logoutButtonText: {
    color: colors.error,
  },
  demoNotice: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  footer: {
    alignItems: "center",
    marginTop: spacing.xl,
  },
});
