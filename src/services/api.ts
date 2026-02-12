import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour le token JWT (à compléter plus tard)
api.interceptors.request.use(
  async (config) => {
    // TODO: Récupérer token depuis SecureStore
    return config;
  },
  (error) => Promise.reject(error),
);

// Intercepteur de réponse
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  },
);

export default api;
