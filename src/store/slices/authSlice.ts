import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as SecureStore from "expo-secure-store";
import { authService } from "../../services/auth";

interface User {
  user_id: string;
  email: string;
  username: string;
  avatar_url?: string;
  xp: number;
  level: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
};

// Actions asynchrones
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authService.login({ email, password });
      await SecureStore.setItemAsync("authToken", response.token);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Connexion impossible");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ email, username, password }: { email: string; username: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authService.register({ email, username, password });
      await SecureStore.setItemAsync("authToken", response.token);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Inscription impossible");
    }
  }
);

export const checkAuthToken = createAsyncThunk(
  "auth/checkToken",
  async (_, { rejectWithValue }) => {
    try {
      const token = await SecureStore.getItemAsync("authToken");
      if (!token) {
        return rejectWithValue("No token found");
      }
      const response = await authService.getProfile();
      return { user: response.user, token };
    } catch (error: any) {
      await SecureStore.deleteItemAsync("authToken");
      return rejectWithValue(error.response?.data?.error || "Session expirée");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async () => {
    await SecureStore.deleteItemAsync("authToken");
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Check Token
    builder
      .addCase(checkAuthToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuthToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(checkAuthToken.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      });
  },
});

export const { setUser, setToken, setLoading, clearError } = authSlice.actions;
export default authSlice.reducer;
