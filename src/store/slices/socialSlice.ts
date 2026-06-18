import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../index";
import api from "../../services/api";

export interface Author {
  user_id: string;
  username: string;
  avatar_url?: string;
  level: number;
}

export interface RidePost {
  post_id: string;
  user_id: string;
  author: Author;
  ride_id: string;
  title: string;
  description?: string;
  distance_km: number;
  duration_minutes: number;
  photos: string[];
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  created_at: string;
  route_data?: any; // GeoJSON pour les routes partagées
}

export interface Comment {
  comment_id: string;
  post_id: string;
  user_id: string;
  author: Author;
  content: string;
  created_at: string;
}

export interface SharedRoute {
  route_id: string;
  user_id: string;
  author: Author;
  title: string;
  description: string;
  distance_km: number;
  route_data: any; // GeoJSON
  difficulty?: "easy" | "medium" | "hard";
  rating?: number;
  downloads_count: number;
  created_at: string;
}

export interface PublicProfile {
  user_id: string;
  username: string;
  avatar_url?: string;
  level: number;
  xp: number;
  motorcycle?: {
    brand: string;
    model: string;
    year: number;
    photo_url?: string;
  };
  stats: {
    total_distance: number;
    total_trips: number;
    achievements: number;
    followers: number;
    following: number;
  };
  is_following: boolean;
  recent_rides: RidePost[];
}

interface SocialState {
  feed: RidePost[];
  comments: { [postId: string]: Comment[] };
  sharedRoutes: SharedRoute[];
  following: string[];
  followers: string[];
  publicProfile: PublicProfile | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: SocialState = {
  feed: [],
  comments: {},
  sharedRoutes: [],
  following: [],
  followers: [],
  publicProfile: null,
  isLoading: false,
  error: null,
};

const socialSlice = createSlice({
  name: "social",
  initialState,
  reducers: {
    setFeed: (state, action: PayloadAction<RidePost[]>) => {
      state.feed = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addPost: (state, action: PayloadAction<RidePost>) => {
      state.feed.unshift(action.payload);
    },
    toggleLike: (state, action: PayloadAction<string>) => {
      const post = state.feed.find((p) => p.post_id === action.payload);
      if (post) {
        post.is_liked = !post.is_liked;
        post.likes_count += post.is_liked ? 1 : -1;
      }
    },
    setComments: (
      state,
      action: PayloadAction<{ postId: string; comments: Comment[] }>
    ) => {
      state.comments[action.payload.postId] = action.payload.comments;
    },
    addComment: (state, action: PayloadAction<Comment>) => {
      const postId = action.payload.post_id;
      if (!state.comments[postId]) {
        state.comments[postId] = [];
      }
      state.comments[postId].push(action.payload);

      const post = state.feed.find((p) => p.post_id === postId);
      if (post) {
        post.comments_count++;
      }
    },
    setSharedRoutes: (state, action: PayloadAction<SharedRoute[]>) => {
      state.sharedRoutes = action.payload;
    },
    setFollowing: (state, action: PayloadAction<string[]>) => {
      state.following = action.payload;
    },
    setFollowers: (state, action: PayloadAction<string[]>) => {
      state.followers = action.payload;
    },
    followUser: (state, action: PayloadAction<string>) => {
      if (!state.following.includes(action.payload)) {
        state.following.push(action.payload);
      }
      if (state.publicProfile?.user_id === action.payload) {
        state.publicProfile.is_following = true;
        state.publicProfile.stats.followers++;
      }
    },
    unfollowUser: (state, action: PayloadAction<string>) => {
      state.following = state.following.filter((id) => id !== action.payload);
      if (state.publicProfile?.user_id === action.payload) {
        state.publicProfile.is_following = false;
        state.publicProfile.stats.followers--;
      }
    },
    setPublicProfile: (state, action: PayloadAction<PublicProfile>) => {
      state.publicProfile = action.payload;
      state.isLoading = false;
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
    },
  },
});

export const {
  setFeed,
  addPost,
  toggleLike,
  setComments,
  addComment,
  setSharedRoutes,
  setFollowing,
  setFollowers,
  followUser,
  unfollowUser,
  setPublicProfile,
  setLoading,
  setError,
  clearError,
} = socialSlice.actions;

// Thunks pour les appels API

export const loadFeed = () => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));

    const response = await api.get("/api/social/feed");
    dispatch(setFeed(response.data.posts));
  } catch (error: any) {
    dispatch(setError("Erreur lors du chargement du feed"));
  }
};

export const sharePost = (rideId: string, title: string, description?: string) => async (dispatch: any) => {
  try {
    const response = await api.post("/api/social/posts", {
      ride_id: rideId,
      title,
      description,
    });
    dispatch(addPost(response.data.post));
    return response.data.post;
  } catch (error: any) {
    dispatch(setError("Erreur lors du partage du trajet"));
    throw error;
  }
};

export const likePost = (postId: string) => async (dispatch: any) => {
  // Optimistic update : on bascule l'UI tout de suite, et on resynchronise
  // silencieusement si l'appel serveur échoue.
  dispatch(toggleLike(postId));
  try {
    await api.post(`/api/social/posts/${postId}/like`);
  } catch (error: any) {
    dispatch(toggleLike(postId)); // rollback
    dispatch(setError("Erreur lors du like"));
  }
};

export const loadComments = (postId: string) => async (dispatch: any) => {
  try {
    const response = await api.get(`/api/social/posts/${postId}/comments`);
    dispatch(setComments({ postId, comments: response.data.comments }));
  } catch (error: any) {
    dispatch(setError("Erreur lors du chargement des commentaires"));
  }
};

export const postComment = (postId: string, content: string) => async (dispatch: any) => {
  try {
    const response = await api.post(`/api/social/posts/${postId}/comments`, { content });
    dispatch(addComment(response.data.comment));
  } catch (error: any) {
    dispatch(setError("Erreur lors de l'ajout du commentaire"));
  }
};

export const follow = (userId: string) => async (dispatch: any) => {
  try {
    await api.post(`/api/social/users/${userId}/follow`);
    dispatch(followUser(userId));
  } catch (error: any) {
    dispatch(setError("Erreur lors du follow"));
  }
};

export const unfollow = (userId: string) => async (dispatch: any) => {
  try {
    await api.delete(`/api/social/users/${userId}/follow`);
    dispatch(unfollowUser(userId));
  } catch (error: any) {
    dispatch(setError("Erreur lors du unfollow"));
  }
};

export const loadPublicProfile = (userId: string) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));

    const response = await api.get(`/api/social/users/${userId}`);
    dispatch(setPublicProfile(response.data.profile));
  } catch (error: any) {
    dispatch(setError("Erreur lors du chargement du profil"));
  }
};

export const loadSharedRoutes = () => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));

    const response = await api.get("/api/social/routes");
    dispatch(setSharedRoutes(response.data.routes));
    dispatch(setLoading(false));
  } catch (error: any) {
    dispatch(setError("Erreur lors du chargement des routes"));
  }
};

export default socialSlice.reducer;
