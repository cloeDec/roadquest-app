import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "@/src/services/api";

export interface Coordinate {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export interface Trip {
  id: string;
  startTime: number;
  endTime: number | null;
  distance: number; // en km
  duration: number; // en secondes
  coordinates: Coordinate[];
  destination: {
    name: string;
    latitude: number;
    longitude: number;
  } | null;
  routeCoordinates: Coordinate[];
  isActive: boolean;
}

interface TripsState {
  trips: Trip[];
  currentTrip: Trip | null;
}

const initialState: TripsState = {
  trips: [],
  currentTrip: null,
};

const tripsSlice = createSlice({
  name: "trips",
  initialState,
  reducers: {
    startTrip: (
      state,
      action: PayloadAction<{
        destination: { name: string; latitude: number; longitude: number } | null;
        routeCoordinates: Coordinate[];
      }>,
    ) => {
      const newTrip: Trip = {
        id: Date.now().toString(),
        startTime: Date.now(),
        endTime: null,
        distance: 0,
        duration: 0,
        coordinates: [],
        destination: action.payload.destination,
        routeCoordinates: action.payload.routeCoordinates,
        isActive: true,
      };
      state.currentTrip = newTrip;
    },

    addCoordinate: (
      state,
      action: PayloadAction<{ latitude: number; longitude: number }>,
    ) => {
      if (state.currentTrip) {
        const newCoord: Coordinate = {
          latitude: action.payload.latitude,
          longitude: action.payload.longitude,
          timestamp: Date.now(),
        };
        state.currentTrip.coordinates.push(newCoord);

        // Calculer la distance totale
        if (state.currentTrip.coordinates.length > 1) {
          const coords = state.currentTrip.coordinates;
          const lastTwo = coords.slice(-2);
          const distance = calculateDistance(
            lastTwo[0].latitude,
            lastTwo[0].longitude,
            lastTwo[1].latitude,
            lastTwo[1].longitude,
          );
          state.currentTrip.distance += distance;
        }

        // Calculer la durée
        state.currentTrip.duration = Math.floor(
          (Date.now() - state.currentTrip.startTime) / 1000,
        );
      }
    },

    endTrip: (state) => {
      if (state.currentTrip) {
        state.currentTrip.endTime = Date.now();
        state.currentTrip.isActive = false;
        state.trips.push(state.currentTrip);
        state.currentTrip = null;
      }
    },

    loadTrips: (state, action: PayloadAction<Trip[]>) => {
      state.trips = action.payload;
    },

    deleteTrip: (state, action: PayloadAction<string>) => {
      state.trips = state.trips.filter((trip) => trip.id !== action.payload);
    },
  },
});

// Fonction helper pour calculer la distance
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Actions asynchrones pour communiquer avec l'API
export const saveTripToAPI = (trip: Trip) => async (dispatch: any) => {
  try {
    // Calculer la vitesse moyenne
    const avgSpeed = trip.duration > 0 ? (trip.distance / (trip.duration / 3600)) : 0;

    const response = await api.post("/api/rides", {
      start_location: trip.coordinates.length > 0 ? {
        latitude: trip.coordinates[0].latitude,
        longitude: trip.coordinates[0].longitude
      } : {
        latitude: trip.destination?.latitude || 0,
        longitude: trip.destination?.longitude || 0
      },
      end_location: trip.destination ? {
        latitude: trip.destination.latitude,
        longitude: trip.destination.longitude
      } : undefined,
      route: trip.coordinates,
      distance: trip.distance,
      duration: trip.duration,
      avg_speed: avgSpeed,
      destination_name: trip.destination?.name,
      is_public: true
    });

    console.log("✅ Trajet sauvegardé dans la BDD:", response.data);

    // Recharger tous les trajets depuis l'API
    dispatch(loadTripsFromAPI());
  } catch (error: any) {
    console.error("❌ Erreur lors de la sauvegarde du trajet:", error.response?.data || error.message);
    throw error;
  }
};

export const loadTripsFromAPI = () => async (dispatch: any) => {
  try {
    const response = await api.get("/api/rides");

    // Convertir les trajets de l'API au format du store
    const trips: Trip[] = response.data.rides.map((ride: any) => ({
      id: ride.ride_id,
      startTime: new Date(ride.created_at).getTime(),
      endTime: new Date(ride.created_at).getTime() + (ride.duration * 1000),
      distance: ride.distance,
      duration: ride.duration,
      coordinates: ride.route.map((coord: any) => ({
        latitude: coord.latitude,
        longitude: coord.longitude,
        timestamp: new Date(ride.created_at).getTime()
      })),
      destination: ride.end_location ? {
        name: ride.destination_name || "Destination",
        latitude: ride.end_location.latitude,
        longitude: ride.end_location.longitude
      } : null,
      routeCoordinates: ride.route || [],
      isActive: false
    }));

    dispatch(loadTrips(trips));
    console.log("✅ Trajets chargés depuis la BDD:", trips.length);
  } catch (error: any) {
    console.error("❌ Erreur lors du chargement des trajets:", error.response?.data || error.message);
  }
};

export const deleteTripFromAPI = (tripId: string) => async (dispatch: any) => {
  try {
    await api.delete(`/api/rides/${tripId}`);
    dispatch(deleteTrip(tripId));
    console.log("✅ Trajet supprimé de la BDD");
  } catch (error: any) {
    console.error("❌ Erreur lors de la suppression du trajet:", error.response?.data || error.message);
    throw error;
  }
};

// Garder pour la compatibilité (ne fait rien maintenant)
export const saveTripsToStorage = (trips: Trip[]) => async () => {
  console.log("⚠️ saveTripsToStorage is deprecated, use saveTripToAPI instead");
};

export const loadTripsFromStorage = loadTripsFromAPI;

export const { startTrip, addCoordinate, endTrip, loadTrips, deleteTrip } =
  tripsSlice.actions;

export default tripsSlice.reducer;
