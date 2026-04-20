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

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    id: "1",
    name: "Alex Johnson",
    email: "alex@pathfind.ai",
    avatar: "",
    onboardingComplete: true,
  },
  token: "demo-token",
  isAuthenticated: true,
  isLoading: false,

  login: async (email: string, _password: string) => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 1000));
    set({
      user: {
        id: "1",
        name: "Alex Johnson",
        email,
        avatar: "",
        onboardingComplete: true,
      },
      token: "demo-token",
      isAuthenticated: true,
      isLoading: false,
    });
  },

  register: async (name: string, email: string, _password: string) => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 1000));
    set({
      user: {
        id: "1",
        name,
        email,
        avatar: "",
        onboardingComplete: false,
      },
      token: "demo-token",
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: () => {
    set({ user: null, token: null, isAuthenticated: false });
  },

  setUser: (user: User) => set({ user }),
}));
