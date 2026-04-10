import { borderRadius, colors, spacing } from "@/src/ui";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import {
  deleteTrip,
  loadTripsFromStorage,
  saveTripsToStorage,
  Trip,
} from "@/src/store/slices/tripsSlice";

export default function RidesScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const trips = useAppSelector((state) => state.trips.trips);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  useEffect(() => {
    // Charger les trajets au montage
    dispatch(loadTripsFromStorage() as any);
  }, []);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  const handleDeleteTrip = (tripId: string) => {
    Alert.alert(
      "Supprimer le trajet",
      "Êtes-vous sûr de vouloir supprimer ce trajet ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            dispatch(deleteTrip(tripId));
            const updatedTrips = trips.filter((t) => t.id !== tripId);
            dispatch(saveTripsToStorage(updatedTrips) as any);
          },
        },
      ],
    );
  };

  const handleViewTrip = (trip: Trip) => {
    // TODO: Navigate to trip detail page with map
    setSelectedTrip(trip);
    Alert.alert(
      "Trajet",
      `Destination: ${trip.destination?.name || "Aucune"}\nDistance: ${trip.distance.toFixed(1)} km\nDurée: ${formatDuration(trip.duration)}`,
    );
  };

  const renderTripCard = ({ item }: { item: Trip }) => (
    <TouchableOpacity
      style={styles.tripCard}
      onPress={() => handleViewTrip(item)}
      activeOpacity={0.7}
    >
      <View style={styles.tripHeader}>
        <View style={styles.tripIconContainer}>
          <Ionicons name="navigate" size={24} color={colors.accentPrimary} />
        </View>
        <View style={styles.tripInfo}>
          <Text style={styles.tripDestination} numberOfLines={1}>
            {item.destination?.name || "Destination inconnue"}
          </Text>
          <Text style={styles.tripDate}>
            {formatDate(item.startTime)} à {formatTime(item.startTime)}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteTrip(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color={colors.danger} />
        </TouchableOpacity>
      </View>

      <View style={styles.tripStats}>
        <View style={styles.statItem}>
          <Ionicons name="navigate" size={16} color={colors.textTertiary} />
          <Text style={styles.statValue}>{item.distance.toFixed(1)} km</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Ionicons name="time" size={16} color={colors.textTertiary} />
          <Text style={styles.statValue}>{formatDuration(item.duration)}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Ionicons name="location" size={16} color={colors.textTertiary} />
          <Text style={styles.statValue}>{item.coordinates.length} pts</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="car-outline" size={80} color={colors.textTertiary} />
      <Text style={styles.emptyTitle}>Aucun trajet enregistré</Text>
      <Text style={styles.emptySubtitle}>
        Démarrez votre premier trajet GPS pour le voir apparaître ici
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => router.push("/(tabs)")}
      >
        <Ionicons name="add" size={20} color={colors.textPrimary} />
        <Text style={styles.emptyButtonText}>Commencer un trajet</Text>
      </TouchableOpacity>
    </View>
  );

  const totalDistance = trips.reduce((sum, trip) => sum + trip.distance, 0);
  const totalDuration = trips.reduce((sum, trip) => sum + trip.duration, 0);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header with stats */}
      {trips.length > 0 && (
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mes trajets</Text>
          <View style={styles.headerStats}>
            <View style={styles.headerStatItem}>
              <Text style={styles.headerStatValue}>{trips.length}</Text>
              <Text style={styles.headerStatLabel}>Trajets</Text>
            </View>
            <View style={styles.headerStatDivider} />
            <View style={styles.headerStatItem}>
              <Text style={styles.headerStatValue}>
                {totalDistance.toFixed(0)} km
              </Text>
              <Text style={styles.headerStatLabel}>Total</Text>
            </View>
            <View style={styles.headerStatDivider} />
            <View style={styles.headerStatItem}>
              <Text style={styles.headerStatValue}>
                {formatDuration(totalDuration)}
              </Text>
              <Text style={styles.headerStatLabel}>Durée</Text>
            </View>
          </View>
        </View>
      )}

      {/* Trips list */}
      <FlatList
        data={trips}
        renderItem={renderTripCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          trips.length === 0 && styles.listContentEmpty,
        ]}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.backgroundSecondary,
    borderBottomLeftRadius: borderRadius.lg,
    borderBottomRightRadius: borderRadius.lg,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  headerStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: spacing.md,
    backgroundColor: colors.backgroundPrimary,
    borderRadius: borderRadius.md,
  },
  headerStatItem: {
    alignItems: "center",
  },
  headerStatValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.accentPrimary,
  },
  headerStatLabel: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  headerStatDivider: {
    width: 1,
    backgroundColor: colors.textTertiary,
    opacity: 0.2,
  },
  listContent: {
    padding: spacing.lg,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  tripCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tripHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  tripIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.backgroundPrimary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  tripInfo: {
    flex: 1,
  },
  tripDestination: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  tripDate: {
    fontSize: 14,
    color: colors.textTertiary,
  },
  deleteButton: {
    padding: spacing.sm,
  },
  tripStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.backgroundPrimary,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textPrimary,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: colors.textTertiary,
    opacity: 0.2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textTertiary,
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.accentPrimary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
  },
});
