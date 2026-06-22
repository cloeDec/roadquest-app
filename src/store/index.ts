import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import tripsReducer from "./slices/tripsSlice";
import poisReducer from "./slices/poisSlice";
import achievementsReducer from "./slices/achievementsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    trips: tripsReducer,
    pois: poisReducer,
    achievements: achievementsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
