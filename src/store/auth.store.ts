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

function getStoredAuth(): { token: string | null; user: User | null } {
  if (typeof window === "undefined") return { token: null, user: null };
  const token = localStorage.getItem("pathfind_token");
  const userJson = localStorage.getItem("pathfind_user");
  const user = userJson ? (JSON.parse(userJson) as User) : null;
  return { token, user };
}

export const useAuthStore = create<AuthState>((set) => {
  const { token: storedToken, user: storedUser } = getStoredAuth();
  return {
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
  };
});
