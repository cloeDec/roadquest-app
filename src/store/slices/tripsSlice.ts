import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

// Actions asynchrones pour sauvegarder dans AsyncStorage
export const saveTripsToStorage = (trips: Trip[]) => async () => {
  try {
    await AsyncStorage.setItem("@trips", JSON.stringify(trips));
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des trajets:", error);
  }
};

export const loadTripsFromStorage = () => async (dispatch: any) => {
  try {
    const tripsJson = await AsyncStorage.getItem("@trips");
    if (tripsJson) {
      const trips = JSON.parse(tripsJson);
      dispatch(loadTrips(trips));
    }
  } catch (error) {
    console.error("Erreur lors du chargement des trajets:", error);
  }
};

export const { startTrip, addCoordinate, endTrip, loadTrips, deleteTrip } =
  tripsSlice.actions;

export default tripsSlice.reducer;
