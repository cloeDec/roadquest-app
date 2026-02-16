import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { checkAuthToken } from "../store/slices/authSlice";
import { Colors } from "../constants/colors";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    dispatch(checkAuthToken());
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, segments, isLoading]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.dark.primary} />
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
    backgroundColor: Colors.dark.background,
  },
});
