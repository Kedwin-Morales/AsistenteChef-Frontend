import { create } from "zustand";

export interface AuthUser {
  id: string;
  user: string;
  role: string;
  nombre?: string;
}

export interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;

  setTokens: (access: string) => void;
  setUser: (user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: localStorage.getItem("accessToken"),
  user: JSON.parse(localStorage.getItem("authUser") || "null"), 
  isAuthenticated: !!localStorage.getItem("accessToken"),

  setTokens: (access) => {
    localStorage.setItem("accessToken", access);
    set({
      accessToken: access,
      isAuthenticated: true,
    });
  },

  setUser: (user) => {
    localStorage.setItem("authUser", JSON.stringify(user));
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.clear();
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
    });
  },
}));

