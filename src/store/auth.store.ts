"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi, type UserProfile } from "@/lib/api/auth";
import { apiClient } from "@/lib/api/client";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  setUser: (user: UserProfile) => void;
  clearError: () => void;
}

// ─── Token helpers ────────────────────────────────────────────────────────────

function saveTokens(access: string, refresh: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("pathfind_access_token", access);
  localStorage.setItem("pathfind_refresh_token", refresh);
  // Keep axios default header in sync so non-intercepted calls also work
  apiClient.defaults.headers.common["Authorization"] = `Bearer ${access}`;
}

function clearTokens() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("pathfind_access_token");
  localStorage.removeItem("pathfind_refresh_token");
  delete apiClient.defaults.headers.common["Authorization"];
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isSaving: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const { access, refresh, user } = await authApi.login({ email, password });
          saveTokens(access, refresh);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (err: unknown) {
          const message =
            err instanceof Error ? err.message : "Login failed. Please check your credentials.";
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const { access, refresh, user } = await authApi.register({ full_name: name, email, password });
          saveTokens(access, refresh);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (err: unknown) {
          const message =
            err instanceof Error ? err.message : "Registration failed. Please try again.";
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      logout: () => {
        clearTokens();
        set({ user: null, isAuthenticated: false, error: null });
        // Broadcast so the axios client interceptor can also react
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("auth:logout"));
        }
      },

      fetchMe: async () => {
        set({ isLoading: true, error: null });
        try {
          const user = await authApi.getMe();
          set({ user, isAuthenticated: true, isLoading: false });
        } catch {
          // Token is invalid – force a clean logout
          clearTokens();
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      updateProfile: async (data: Partial<UserProfile>) => {
        set({ isSaving: true, error: null });
        try {
          const updated = await authApi.patchMe(data);
          set({ user: updated, isSaving: false });
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "Failed to save profile.";
          set({ isSaving: false, error: message });
          throw err;
        }
      },

      setUser: (user: UserProfile) => set({ user }),

      clearError: () => set({ error: null }),
    }),
    {
      name: "pathfind-auth",
      // Only persist user data – tokens live in localStorage separately
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// ─── Auth event listener (logout on token expiry) ────────────────────────────

if (typeof window !== "undefined") {
  window.addEventListener("auth:logout", () => {
    useAuthStore.getState().logout();
  });
}
