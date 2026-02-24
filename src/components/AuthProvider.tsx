import { useRouter, useSegments, useRootNavigationState } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { checkAuthToken } from "../store/slices/authSlice";
import { SplashScreen } from "./SplashScreen";
import { colors } from "../ui";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();
  const [appReady, setAppReady] = useState(false);
  const [splashAnimationDone, setSplashAnimationDone] = useState(false);
  const authCheckedRef = useRef(false);
  const navigationDoneRef = useRef(false);

  // Vérifier l'auth au démarrage (une seule fois)
  useEffect(() => {
    if (authCheckedRef.current) return;
    authCheckedRef.current = true;

    dispatch(checkAuthToken()).finally(() => {
      // Auth vérifiée, on peut continuer
    });
  }, []);

  // Navigation après que le splash soit fini et l'auth vérifiée
  useEffect(() => {
    if (!navigationState?.key || !splashAnimationDone || navigationDoneRef.current || isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inTabsGroup = segments[0] === "(tabs)";

    if (isAuthenticated && !inTabsGroup) {
      router.replace("/(tabs)");
    } else if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/login");
    }

    navigationDoneRef.current = true;

    // Petit délai pour laisser la navigation se faire
    setTimeout(() => setAppReady(true), 100);
  }, [navigationState?.key, splashAnimationDone, isAuthenticated, segments, isLoading]);

  // Afficher le splash tant que l'app n'est pas prête
  if (!appReady) {
    return (
      <SplashScreen
        onFinish={() => {
          setSplashAnimationDone(true);
        }}
      />
    );
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.brandPrimary} />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.backgroundPrimary,
  },
});
