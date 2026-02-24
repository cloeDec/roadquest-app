import api from "@/src/services/api";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { logoutUser } from "@/src/store/slices/authSlice";
import { colors } from "@/src/ui";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function TabOneScreen() {
  const [status, setStatus] = useState("Connecting to backend...");
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    checkBackend();
  }, []);

  const checkBackend = async () => {
    try {
      const { data } = await api.get("/health");
      setStatus(`✅ ${data.service} - ${data.status}`);
    } catch (error) {
      setStatus("❌ Backend unreachable");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏍️ RoadQuest</Text>

      {user && (
        <View style={styles.userInfo}>
          <Text style={styles.welcomeText}>Bienvenue, {user.username} !</Text>
          <Text style={styles.levelText}>
            Niveau {user.level} • {user.xp} XP
          </Text>
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color={colors.brandPrimary} />
      ) : (
        <Text style={styles.status}>{status}</Text>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.backgroundPrimary,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 20,
  },
  userInfo: {
    alignItems: "center",
    marginBottom: 30,
    padding: 20,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    width: "100%",
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  levelText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  status: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 40,
  },
  logoutButton: {
    backgroundColor: colors.danger,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  logoutButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
});
