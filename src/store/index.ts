import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import tripsReducer from "./slices/tripsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    trips: tripsReducer,
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
