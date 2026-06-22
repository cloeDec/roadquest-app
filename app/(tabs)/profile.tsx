import { StyleSheet, ScrollView, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Caption, Section, MenuItem, MenuList, Icon } from "@/src/ui";
import { colors, spacing } from "@/src/ui/theme";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { logoutUser } from "@/src/store/slices/authSlice";
import { loadAchievements, loadUserAchievements } from "@/src/store/slices/achievementsSlice";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  ProfileHeader,
  MotorcycleCard,
  RankCard,
  StatsGrid,
} from "@/src/components/profile";
import { mockUser } from "@/src/mocks";

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user: reduxUser } = useAppSelector((state) => state.auth);
  const { stats: achievementStats } = useAppSelector((state) => state.achievements);

  // Mode démo explicite : si personne n'est connecté, on affiche un profil
  // fictif clairement signalé par le bandeau "Mode démo" plus bas, plutôt
  // que de bloquer l'écran. Dès qu'un vrai utilisateur est connecté, aucune
  // valeur de cet objet mockUser n'est plus utilisée.
  const user = reduxUser || mockUser;

  // Ne recharger les achievements que si on a un vrai utilisateur connecté
  // et qu'ils n'ont pas déjà été chargés (ex: depuis l'onglet Trophées).
  useEffect(() => {
    if (reduxUser) {
      dispatch(loadAchievements() as any);
      dispatch(loadUserAchievements() as any);
    }
  }, [reduxUser, dispatch]);

  const currentLevel = user.level || 8;
  const currentXP = user.xp || 1250;
  // Le backend attribue le niveau via le trigger SQL update_user_level :
  // level = floor(xp / 1000) + 1. On reste cohérent avec cette formule
  // (1000 XP par niveau) pour que la barre de progression corresponde au
  // niveau réellement stocké, plutôt qu'une formule exponentielle divergente.
  const XP_PER_LEVEL = 1000;
  const nextLevelXP = currentLevel * XP_PER_LEVEL;

  // pois_discovered vient maintenant réellement de l'API (/api/user/profile)
  // pour un utilisateur connecté ; plus de valeur figée à 12.
  const poisDiscovered = reduxUser
    ? (reduxUser as any).pois_discovered ?? 0
    : mockUser.pois_discovered;

  const trophiesUnlocked = reduxUser ? achievementStats.unlocked : 3;

  const stats = [
    { icon: "road-variant" as const, iconColor: "success" as const, value: user.total_distance || 2340, label: "km totaux" },
    { icon: "map-marker-path" as const, iconColor: "brandPrimary" as const, value: user.total_trips || 42, label: "trajets" },
    { icon: "map" as const, iconColor: "error" as const, value: user.regions_explored || 5, label: "régions" },
    { icon: "map-marker-star" as const, iconColor: "warning" as const, value: poisDiscovered, label: "POIs" },
    { icon: "trophy" as const, iconColor: "rankDiamond" as const, value: trophiesUnlocked, label: "trophées" },
    { icon: "star" as const, iconColor: "warning" as const, value: currentXP, label: "XP total" },
  ];

  const handleLogout = () => {
    if (!reduxUser) {
      Alert.alert("Mode démo", "Vous utilisez le mode démo. Connectez-vous pour accéder à votre vrai profil.");
      return;
    }

    Alert.alert(
      "Déconnexion",
      "Voulez-vous vraiment vous déconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
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
        <ProfileHeader
          username={user.username}
          email={user.email}
          avatarUrl={user.avatar_url}
          level={currentLevel}
          currentXP={currentXP}
          nextLevelXP={nextLevelXP}
        />

        {user.motorcycle && (
          <Section title="🏍️ Ma Moto">
            <MotorcycleCard
              motorcycle={user.motorcycle}
              onEdit={handleEditMotorcycle}
            />
          </Section>
        )}

        <Section title="📊 Statistiques Globales">
          <StatsGrid stats={stats} />
        </Section>

        <Section title="🎖️ Rang de Rider">
          <RankCard level={currentLevel} xp={currentXP} />
        </Section>

        <Section title="⚙️ Paramètres">
          <MenuList>
            <MenuItem icon="account-edit" label="Modifier le profil" onPress={handleEditProfile} />
            <MenuItem icon="motorbike" label="Ma moto" onPress={handleEditMotorcycle} />
            <MenuItem icon="cog" label="Préférences" />
            <MenuItem icon="bell" label="Notifications" />
            <MenuItem icon="shield-check" label="Confidentialité" />
          </MenuList>
        </Section>

        <View style={styles.logoutSection}>
          <Button variant="outline" onPress={handleLogout} style={styles.logoutButton}>
            <View style={styles.logoutContent}>
              <Icon name={reduxUser ? "logout" : "login"} size={20} color="error" />
              <Caption color="error">
                {reduxUser ? "Déconnexion" : "Se connecter"}
              </Caption>
            </View>
          </Button>
        </View>

        {!reduxUser && (
          <View style={styles.demoNotice}>
            <Icon name="information" size={16} color="warning" />
            <Caption color="textSecondary">
              Mode démo - Connectez-vous pour voir vos vraies données
            </Caption>
          </View>
        )}

        <View style={styles.footer}>
          <Caption color="textTertiary">RoadQuest v1.0.0</Caption>
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
  logoutSection: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  logoutButton: {
    borderColor: colors.error,
  },
  logoutContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
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
