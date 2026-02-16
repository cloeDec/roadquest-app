import api from "./api";

interface RegisterData {
  email: string;
  password: string;
  username: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  message: string;
  user: {
    user_id: string;
    email: string;
    username: string;
    xp: number;
    level: number;
  };
  token: string;
}

export const authService = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post("/api/auth/register", data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post("/api/auth/login", data);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get("/api/user/profile");
    return response.data;
  },
};
