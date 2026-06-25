import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "@/src/services/api";

export interface Achievement {
  achievement_id: string;
  name: string;
  description: string;
  xp_reward: number;
  icon_url: string;
  condition_type: string;
  condition_value: number;
  rarity: string;
}

export interface UserAchievement extends Achievement {
  unlocked_at?: string;
  progress: number;
  is_unlocked: boolean;
}

interface AchievementsState {
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  isLoading: boolean;
  error: string | null;
  stats: {
    total: number;
    unlocked: number;
    progress_percentage: number;
  };
}

const initialState: AchievementsState = {
  achievements: [],
  userAchievements: [],
  isLoading: false,
  error: null,
  stats: {
    total: 0,
    unlocked: 0,
    progress_percentage: 0
  }
};

const calculateProgressPercentage = (unlocked: number, total: number) => {
  return total > 0 ? Math.round((unlocked / total) * 100) : 0;
};

const achievementsSlice = createSlice({
  name: "achievements",
  initialState,
  reducers: {
    setAchievements: (state, action: PayloadAction<Achievement[]>) => {
      state.achievements = action.payload;
      state.stats.total = action.payload.length;
      state.isLoading = false;
      state.error = null;
    },
    setUserAchievements: (state, action: PayloadAction<UserAchievement[]>) => {
      state.userAchievements = action.payload;
      state.stats.unlocked = action.payload.filter(a => a.is_unlocked).length;
      state.stats.progress_percentage = calculateProgressPercentage(state.stats.unlocked, state.stats.total);
      state.isLoading = false;
      state.error = null;
    },
    unlockAchievement: (state, action: PayloadAction<{ achievement_id: string }>) => {
      const achievement = state.userAchievements.find(
        a => a.achievement_id === action.payload.achievement_id
      );
      if (achievement && !achievement.is_unlocked) {
        achievement.is_unlocked = true;
        achievement.unlocked_at = new Date().toISOString();
        achievement.progress = achievement.condition_value;
        state.stats.unlocked++;
        state.stats.progress_percentage = calculateProgressPercentage(state.stats.unlocked, state.stats.total);
      }
    },
    updateAchievementProgress: (state, action: PayloadAction<{ achievement_id: string; progress: number }>) => {
      const achievement = state.userAchievements.find(
        a => a.achievement_id === action.payload.achievement_id
      );
      if (achievement && !achievement.is_unlocked) {
        achievement.progress = action.payload.progress;

        if (achievement.progress >= achievement.condition_value) {
          achievement.is_unlocked = true;
          achievement.unlocked_at = new Date().toISOString();
          state.stats.unlocked++;
          state.stats.progress_percentage = calculateProgressPercentage(state.stats.unlocked, state.stats.total);
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const {
  setAchievements,
  setUserAchievements,
  unlockAchievement,
  updateAchievementProgress,
  setLoading,
  setError,
  clearError
} = achievementsSlice.actions;

export const loadAchievements = () => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const response = await api.get("/api/achievements");
    dispatch(setAchievements(response.data.achievements));
  } catch (error: any) {
    dispatch(setError(error.response?.data?.error || "Erreur lors du chargement des achievements"));
  }
};

export const loadUserAchievements = () => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const response = await api.get("/api/achievements/user");
    dispatch(setUserAchievements(response.data.achievements));
  } catch (error: any) {
    dispatch(setError(error.response?.data?.error || "Erreur lors du chargement des achievements"));
  }
};

export const loadAchievementStats = () => async () => {
  const response = await api.get("/api/achievements/stats");
  return response.data;
};

export default achievementsSlice.reducer;
