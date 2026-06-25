import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import api from "@/src/services/api";
import type { RootState } from "../index";
import { POI as POIConfig } from "@/src/config/constants";

export interface POI {
  poi_id: string;
  name: string;
  type: 'col' | 'route_panoramique' | 'virage' | 'spot_photo' | 'monument' | 'autre';
  description: string;
  location: {
    latitude: number;
    longitude: number;
  };
  rating: number;
  image_url?: string;
  created_by?: string;
  is_verified: boolean;
  created_at: string;
  distance_meters?: number;
  visited?: boolean;
  visit_date?: string;
}

interface POIsState {
  allPOIs: POI[];
  nearbyPOIs: POI[];
  visitedPOIs: POI[];
  selectedPOI: POI | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    types: string[];
    showVisitedOnly: boolean;
    maxDistance: number;
  };
}

const initialState: POIsState = {
  allPOIs: [],
  nearbyPOIs: [],
  visitedPOIs: [],
  selectedPOI: null,
  isLoading: false,
  error: null,
  filters: {
    types: [],
    showVisitedOnly: false,
    maxDistance: POIConfig.DEFAULT_MAX_DISTANCE_M
  }
};

const poisSlice = createSlice({
  name: "pois",
  initialState,
  reducers: {
    setAllPOIs: (state, action: PayloadAction<POI[]>) => {
      state.allPOIs = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setNearbyPOIs: (state, action: PayloadAction<POI[]>) => {
      state.nearbyPOIs = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setVisitedPOIs: (state, action: PayloadAction<POI[]>) => {
      state.visitedPOIs = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setSelectedPOI: (state, action: PayloadAction<POI | null>) => {
      state.selectedPOI = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setFilters: (state, action: PayloadAction<Partial<POIsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    markPOIAsVisitedLocal: (state, action: PayloadAction<{ poiId: string; visitDate: string }>) => {
      const { poiId, visitDate } = action.payload;

      const nearbyIndex = state.nearbyPOIs.findIndex(poi => poi.poi_id === poiId);
      if (nearbyIndex !== -1) {
        state.nearbyPOIs[nearbyIndex].visited = true;
        state.nearbyPOIs[nearbyIndex].visit_date = visitDate;
      }

      const allIndex = state.allPOIs.findIndex(poi => poi.poi_id === poiId);
      if (allIndex !== -1) {
        state.allPOIs[allIndex].visited = true;
        state.allPOIs[allIndex].visit_date = visitDate;
      }
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const {
  setAllPOIs,
  setNearbyPOIs,
  setVisitedPOIs,
  setSelectedPOI,
  setLoading,
  setError,
  setFilters,
  markPOIAsVisitedLocal,
  clearError
} = poisSlice.actions;

export const loadAllPOIs = () => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const response = await api.get("/api/pois");
    dispatch(setAllPOIs(response.data.pois));
  } catch (error: any) {
    dispatch(setError(error.response?.data?.error || "Erreur lors du chargement des POIs"));
  }
};

export const loadNearbyPOIs = (
  latitude: number,
  longitude: number,
  radius: number = POIConfig.DEFAULT_MAX_DISTANCE_M
) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const response = await api.get("/api/pois/nearby", {
      params: { latitude, longitude, radius }
    });
    dispatch(setNearbyPOIs(response.data.pois));
  } catch (error: any) {
    dispatch(setError(error.response?.data?.error || "Erreur lors du chargement des POIs"));
  }
};

export const loadVisitedPOIs = () => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const response = await api.get("/api/pois/visited");
    dispatch(setVisitedPOIs(response.data.pois));
  } catch (error: any) {
    dispatch(setError(error.response?.data?.error || "Erreur lors du chargement des POIs visités"));
  }
};

export const markPOIAsVisited = (poiId: string, rideId: string) => async (dispatch: any) => {
  try {
    const response = await api.post(`/api/pois/${poiId}/visit`, { rideId });

    dispatch(markPOIAsVisitedLocal({
      poiId,
      visitDate: new Date().toISOString()
    }));

    return response.data;
  } catch (error: any) {
    dispatch(setError(error.response?.data?.error || "Erreur lors du marquage du POI"));
    throw error;
  }
};

export const createPOI = (poiData: {
  name: string;
  type: string;
  description: string;
  latitude: number;
  longitude: number;
  rating: number;
  image_url?: string;
}) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const response = await api.post("/api/pois", poiData);
    dispatch(loadAllPOIs());
    return response.data;
  } catch (error: any) {
    dispatch(setError(error.response?.data?.error || "Erreur lors de la création du POI"));
    throw error;
  }
};

export const getFilteredPOIs = createSelector(
  [(state: RootState) => state.pois.nearbyPOIs, (state: RootState) => state.pois.filters],
  (nearbyPOIs, filters) => {
    return nearbyPOIs.filter(poi => {
      if (filters.types.length > 0 && !filters.types.includes(poi.type)) {
        return false;
      }
      if (filters.showVisitedOnly && !poi.visited) {
        return false;
      }
      if (poi.distance_meters && poi.distance_meters > filters.maxDistance) {
        return false;
      }
      return true;
    });
  }
);

export default poisSlice.reducer;
