/**
 * Données mockées pour le système social (développement uniquement)
 * @module mocks/social
 */

import type { RidePost } from "@/src/store/slices/socialSlice";

export const mockFeed: RidePost[] = [
  {
    post_id: "1",
    user_id: "user-1",
    author: {
      user_id: "user-1",
      username: "MaxRider",
      avatar_url: undefined,
      level: 15,
    },
    ride_id: "ride-1",
    title: "Balade dans les Vosges",
    description:
      "Superbe journée sur les routes des Vosges ! Les virages du Col de la Schlucht sont incroyables. Météo parfaite et vue magnifique sur les sapins.",
    distance_km: 145.8,
    duration_minutes: 180,
    photos: [],
    likes_count: 24,
    comments_count: 5,
    is_liked: false,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    post_id: "2",
    user_id: "user-2",
    author: {
      user_id: "user-2",
      username: "BikerGirl",
      avatar_url: undefined,
      level: 22,
    },
    ride_id: "ride-2",
    title: "Tour de la Côte d'Opale",
    description:
      "Magnifique balade le long de la côte. Le Cap Blanc-Nez et le Cap Gris-Nez offrent des points de vue spectaculaires !",
    distance_km: 89.3,
    duration_minutes: 120,
    photos: [],
    likes_count: 42,
    comments_count: 12,
    is_liked: true,
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    post_id: "3",
    user_id: "user-3",
    author: {
      user_id: "user-3",
      username: "SpeedDemon",
      avatar_url: undefined,
      level: 8,
    },
    ride_id: "ride-3",
    title: "Première sortie de l'année",
    description:
      "Enfin de retour sur la route ! Petit tour dans la campagne pour reprendre en main ma MT-07. Hâte de faire de plus longues balades.",
    distance_km: 52.7,
    duration_minutes: 75,
    photos: [],
    likes_count: 18,
    comments_count: 3,
    is_liked: false,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
