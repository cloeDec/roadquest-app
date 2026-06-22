import { colors, spacing, Card, Text, Button } from "@/src/ui";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import {
  deleteTripFromAPI,
  Trip,
} from "@/src/store/slices/tripsSlice";
import { sharePost } from "@/src/store/slices/socialSlice";
import {
  TripMap,
  TripHeader,
  TripInfoCard,
  TripDetailRow,
  MapLegend,
} from "@/src/components/trip-detail";
import { StatCard } from "@/src/components/rides";

export default function TripDetailScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const params = useLocalSearchParams();
  const tripId = params.tripId as string;

  const trips = useAppSelector((state) => state.trips.trips);
  const [trip, setTrip] = useState<Trip | null>(null);

  useEffect(() => {
    const foundTrip = trips.find((t) => t.id === tripId);
    if (foundTrip) {
      setTrip(foundTrip);
    } else {
      Alert.alert("Erreur", "Trajet introuvable");
      router.back();
    }
  }, [tripId, trips]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
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

  const calculateAverageSpeed = () => {
    if (!trip || trip.duration === 0) return "0";
    return (trip.distance / (trip.duration / 3600)).toFixed(1);
  };

  const handleShareTrip = () => {
    if (!trip) return;

    Alert.alert(
      "Partager ce trajet",
      "Publier ce trajet sur le fil d'actualité de la communauté ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Partager",
          onPress: async () => {
            try {
              const title = trip.destination?.name
                ? `Balade vers ${trip.destination.name}`
                : "Nouvelle balade";
              await dispatch(
                sharePost(
                  trip.id,
                  title,
                  `${trip.distance.toFixed(1)} km parcourus`
                ) as any
              );
              Alert.alert("Succès", "Trajet partagé sur le fil !");
            } catch (error) {
              Alert.alert("Erreur", "Impossible de partager ce trajet.");
            }
          },
        },
      ]
    );
  };

  const handleDeleteTrip = () => {
    Alert.alert(
      "Supprimer le trajet",
      "Êtes-vous sûr de vouloir supprimer ce trajet ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            if (trip) {
              try {
                await dispatch(deleteTripFromAPI(trip.id) as any);
                router.back();
                Alert.alert("Succès", "Trajet supprimé avec succès");
              } catch (error) {
                Alert.alert("Erreur", "Impossible de supprimer le trajet");
              }
            }
          },
        },
      ],
    );
  };

  if (!trip) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text variant="body" color="textSecondary">
            Chargement...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <TripHeader onBack={() => router.back()} onDelete={handleDeleteTrip} />

        <TripMap
          coordinates={trip.coordinates}
          destination={trip.destination}
          routeCoordinates={trip.routeCoordinates}
        />

        <TripInfoCard
          destinationName={trip.destination?.name || "Destination inconnue"}
          date={formatDate(trip.startTime)}
          time={formatTime(trip.startTime)}
        />

        <View style={styles.shareButtonContainer}>
          <Button variant="primary" onPress={handleShareTrip}>
            <View style={styles.shareButtonContent}>
              <MaterialCommunityIcons name="share-variant" size={20} color={colors.textPrimary} />
              <Text variant="body" bold color="textPrimary">Partager sur le fil</Text>
            </View>
          </Button>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            icon={
              <MaterialCommunityIcons
                name="map-marker-distance"
                size={24}
                color={colors.accentPrimary}
              />
            }
            value={`${trip.distance.toFixed(2)} km`}
            label="Distance"
          />
          <StatCard
            icon={
              <MaterialCommunityIcons
                name="clock-outline"
                size={24}
                color={colors.accentPrimary}
              />
            }
            value={formatDuration(trip.duration)}
            label="Durée"
          />
          <StatCard
            icon={
              <MaterialCommunityIcons
                name="speedometer"
                size={24}
                color={colors.accentPrimary}
              />
            }
            value={`${calculateAverageSpeed()} km/h`}
            label="Vitesse moy."
          />
          <StatCard
            icon={
              <MaterialCommunityIcons
                name="map-marker"
                size={24}
                color={colors.accentPrimary}
              />
            }
            value={`${trip.coordinates.length}`}
            label="Points GPS"
          />
        </View>

        <Card variant="default" padding="lg" style={styles.detailsCard}>
          <Text variant="body" bold style={styles.sectionTitle}>
            Informations détaillées
          </Text>

          <TripDetailRow
            icon={
              <MaterialCommunityIcons
                name="play-circle"
                size={20}
                color={colors.success}
              />
            }
            label="Heure de départ"
            value={formatTime(trip.startTime)}
          />

          <TripDetailRow
            icon={
              <MaterialCommunityIcons
                name="stop-circle"
                size={20}
                color={colors.danger}
              />
            }
            label="Heure d'arrivée"
            value={trip.endTime ? formatTime(trip.endTime) : "En cours"}
          />

          {trip.destination && (
            <>
              <TripDetailRow
                icon={
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={20}
                    color={colors.accentPrimary}
                  />
                }
                label="Latitude"
                value={`${trip.destination.latitude.toFixed(6)}°`}
              />

              <TripDetailRow
                icon={
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={20}
                    color={colors.accentPrimary}
                  />
                }
                label="Longitude"
                value={`${trip.destination.longitude.toFixed(6)}°`}
              />
            </>
          )}

          <TripDetailRow
            icon={
              <MaterialCommunityIcons
                name="chart-line"
                size={20}
                color={colors.accentPrimary}
              />
            }
            label="Précision GPS"
            value={trip.coordinates.length > 0 ? "Haute" : "Faible"}
          />

          {trip.routeCoordinates.length > 0 && (
            <TripDetailRow
              icon={
                <MaterialCommunityIcons
                  name="map-marker-path"
                  size={20}
                  color={colors.accentPrimary}
                />
              }
              label="Points d'itinéraire"
              value={`${trip.routeCoordinates.length}`}
            />
          )}
        </Card>

        <MapLegend hasRouteCoordinates={trip.routeCoordinates.length > 0} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  shareButtonContainer: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  shareButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  detailsCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
});
