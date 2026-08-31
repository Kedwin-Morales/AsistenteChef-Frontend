import axios from "axios";
import { useAuthStore } from "@/features/auth/store/auth.store";

//Instancia de axios
const api = axios.create({
  baseURL: "https://localhost:7256/api", //URL de API en C#
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

// Interceptor para inyectar el token automaticamente
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
