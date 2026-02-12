import { Colors } from "@/src/constants/colors";
import api from "@/src/services/api";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function TabOneScreen() {
  const [status, setStatus] = useState("Connecting to backend...");
  const [loading, setLoading] = useState(true);

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏍️ RoadQuest</Text>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.dark.primary} />
      ) : (
        <Text style={styles.status}>{status}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.dark.background,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.dark.text,
    marginBottom: 20,
  },
  status: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
  },
});
