import { create } from "zustand";
import { User } from "@/types";
import { authApi, AuthResponse } from "@/lib/api";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  clearError: () => void;
}

function getStoredAuth(): { token: string | null; user: User | null } {
  if (typeof window === "undefined") return { token: null, user: null };
  const token = localStorage.getItem("pathfind_token");
  const userJson = localStorage.getItem("pathfind_user");
  const user = userJson ? (JSON.parse(userJson) as User) : null;
  return { token, user };
}

/** Map backend AuthResponse → frontend User shape */
function toUser(res: AuthResponse): User {
  return {
    id: res.user.id,
    name: res.user.full_name ?? "",
    email: res.user.email,
    avatar: res.user.avatar_url ?? "",
    onboardingComplete:
      res.user.profile?.job_preferences?.onboarding_complete ?? false,
  };
}

function persistAuth(token: string, user: User) {
  if (typeof window === "undefined") return;
  localStorage.setItem("pathfind_token", token);
  localStorage.setItem("pathfind_user", JSON.stringify(user));
}

export const useAuthStore = create<AuthState>((set) => {
  const { token: storedToken, user: storedUser } = getStoredAuth();
  return {
    user: storedUser,
    token: storedToken,
    isAuthenticated: Boolean(storedToken && storedUser),
    isLoading: false,
    error: null,

    login: async (email: string, password: string) => {
      set({ isLoading: true, error: null });
      try {
        const res = await authApi.login({ email, password });
        const user = toUser(res);
        persistAuth(res.access, user);
        set({ user, token: res.access, isAuthenticated: true, isLoading: false });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Login failed.";
        set({ isLoading: false, error: message });
        throw error;
      }
    },

    register: async (name: string, email: string, password: string) => {
      set({ isLoading: true, error: null });
      try {
        const res = await authApi.register({ full_name: name, email, password });
        const user = toUser(res);
        persistAuth(res.access, user);
        set({ user, token: res.access, isAuthenticated: true, isLoading: false });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Registration failed.";
        set({ isLoading: false, error: message });
        throw error;
      }
    },

    logout: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("pathfind_token");
        localStorage.removeItem("pathfind_user");
      }
      set({ user: null, token: null, isAuthenticated: false, error: null });
    },

    setUser: (user: User) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("pathfind_user", JSON.stringify(user));
      }
      set({ user });
    },

    clearError: () => set({ error: null }),
  };
});

