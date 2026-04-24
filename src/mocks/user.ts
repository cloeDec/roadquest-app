/**
 * Données mockées pour l'utilisateur (développement uniquement)
 * @module mocks/user
 */

export interface MockUser {
  user_id: string;
  email: string;
  username: string;
  avatar_url?: string;
  xp: number;
  level: number;
  motorcycle?: {
    brand: string;
    model: string;
    year: number;
    photo_url?: string;
  };
  total_distance: number;
  total_trips: number;
  regions_explored: number;
  pois_discovered: number;
  achievements_count: number;
}

export const mockUser: MockUser = {
  user_id: "demo-user-id",
  email: "demo@roadquest.com",
  username: "DemoRider",
  xp: 1250,
  level: 8,
  motorcycle: {
    brand: "Yamaha",
    model: "MT-07",
    year: 2023,
    photo_url: undefined,
  },
  total_distance: 2340,
  total_trips: 42,
  regions_explored: 5,
  pois_discovered: 28,
  achievements_count: 12,
};
