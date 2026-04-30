import { create } from "zustand";
import { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

const storedToken = typeof window !== "undefined" ? localStorage.getItem("pathfind_token") : null;
const storedUserJson = typeof window !== "undefined" ? localStorage.getItem("pathfind_user") : null;
const storedUser = storedUserJson ? (JSON.parse(storedUserJson) as User) : null;

export const useAuthStore = create<AuthState>((set) => ({
  user: storedUser,
  token: storedToken,
  isAuthenticated: Boolean(storedToken && storedUser),
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const user: User = {
        id: "user-1",
        name: "Alex Johnson",
        email,
        avatar: "",
        onboardingComplete: true,
      };
      if (typeof window !== "undefined") {
        localStorage.setItem("pathfind_token", "demo-token");
        localStorage.setItem("pathfind_user", JSON.stringify(user));
      }
      set({
        user,
        token: "demo-token",
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (name: string, email: string, password: string) => {
    set({ isLoading: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const user: User = {
        id: "user-1",
        name,
        email,
        avatar: "",
        onboardingComplete: false,
      };
      if (typeof window !== "undefined") {
        localStorage.setItem("pathfind_token", "demo-token");
        localStorage.setItem("pathfind_user", JSON.stringify(user));
      }
      set({
        user,
        token: "demo-token",
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("pathfind_token");
      localStorage.removeItem("pathfind_user");
    }
    set({ user: null, token: null, isAuthenticated: false });
  },

  setUser: (user: User) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("pathfind_user", JSON.stringify(user));
    }
    set({ user });
  },
}));
