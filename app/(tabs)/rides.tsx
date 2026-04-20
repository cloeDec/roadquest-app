import { colors, spacing } from "@/src/ui";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Alert, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import {
  deleteTripFromAPI,
  loadTripsFromAPI,
  Trip,
} from "@/src/store/slices/tripsSlice";
import {
  TripCard,
  TripStats,
  EmptyTripsState,
} from "@/src/components/rides";

export default function RidesScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const trips = useAppSelector((state) => state.trips.trips);

  useEffect(() => {
    dispatch(loadTripsFromAPI() as any);
  }, []);

  const handleDeleteTrip = (tripId: string) => {
    Alert.alert(
      "Supprimer le trajet",
      "Êtes-vous sûr de vouloir supprimer ce trajet ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await dispatch(deleteTripFromAPI(tripId) as any);
              Alert.alert("Succès", "Trajet supprimé avec succès");
            } catch (error) {
              Alert.alert("Erreur", "Impossible de supprimer le trajet");
            }
          },
        },
      ],
    );
  };

  const handleViewTrip = (trip: Trip) => {
    router.push({
      pathname: "/trip-detail",
      params: { tripId: trip.id },
    });
  };

  const renderTripCard = ({ item }: { item: Trip }) => (
    <TripCard
      trip={item}
      onPress={() => handleViewTrip(item)}
      onDelete={() => handleDeleteTrip(item.id)}
    />
  );

  const totalDistance = trips.reduce((sum, trip) => sum + trip.distance, 0);
  const totalDuration = trips.reduce((sum, trip) => sum + trip.duration, 0);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <FlatList
        data={trips}
        renderItem={renderTripCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          trips.length === 0 && styles.listContentEmpty,
        ]}
        ListHeaderComponent={
          trips.length > 0 ? (
            <TripStats
              totalTrips={trips.length}
              totalDistance={totalDistance}
              totalDuration={totalDuration}
            />
          ) : null
        }
        ListEmptyComponent={
          <EmptyTripsState onStartTrip={() => router.push("/(tabs)")} />
        }
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
  listContent: {
    padding: spacing.lg,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
});
