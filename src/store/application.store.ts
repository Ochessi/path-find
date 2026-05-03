"use client";

import { create } from "zustand";
import { applicationsApi, type ApplicationPayload } from "@/lib/api/applications";
import { type Application, type ApplicationStatus } from "@/types";

interface ApplicationState {
  applications: Application[];
  currentApplication: Application | null;
  isLoading: boolean;
  error: string | null;

  fetchApplications: (status?: ApplicationStatus) => Promise<void>;
  getApplication: (id: string) => Promise<Application | null>;
  addApplication: (payload: ApplicationPayload) => Promise<void>;
  updateStatus: (id: string, status: ApplicationStatus) => Promise<void>;
  updateNotes: (id: string, notes: string) => Promise<void>;
  setCurrentApplication: (app: Application | null) => void;
  getByStatus: (status: ApplicationStatus) => Application[];
}

export const useApplicationStore = create<ApplicationState>()((set, get) => ({
  applications: [],
  currentApplication: null,
  isLoading: false,
  error: null,

  fetchApplications: async (status?: ApplicationStatus) => {
    set({ isLoading: true, error: null });
    try {
      const data = await applicationsApi.list({ status });
      set({ applications: data.results, isLoading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load applications.";
      set({ isLoading: false, error: message });
    }
  },

  getApplication: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const app = await applicationsApi.get(id);
      set({ currentApplication: app, isLoading: false });
      return app;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load application.";
      set({ isLoading: false, error: message });
      return null;
    }
  },

  addApplication: async (payload: ApplicationPayload) => {
    set({ isLoading: true, error: null });
    try {
      const newApp = await applicationsApi.create(payload);
      set({ applications: [newApp, ...get().applications], isLoading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to add application.";
      set({ isLoading: false, error: message });
      throw err;
    }
  },

  updateStatus: async (id: string, status: ApplicationStatus) => {
    // Optimistic UI update
    const prevApps = get().applications;
    const optimisticApps = prevApps.map((a) =>
      a.id === id ? { ...a, status } : a
    );
    set({ applications: optimisticApps });

    try {
      await applicationsApi.patch(id, { status });
    } catch (err: unknown) {
      // Revert on failure
      set({ applications: prevApps });
      const message = err instanceof Error ? err.message : "Failed to update status.";
      set({ error: message });
    }
  },

  updateNotes: async (id: string, notes: string) => {
    // Optimistic UI update
    const prevApps = get().applications;
    const optimisticApps = prevApps.map((a) =>
      a.id === id ? { ...a, notes } : a
    );
    set({ applications: optimisticApps });

    try {
      await applicationsApi.patch(id, { notes });
    } catch (err: unknown) {
      // Revert on failure
      set({ applications: prevApps });
      const message = err instanceof Error ? err.message : "Failed to update notes.";
      set({ error: message });
    }
  },

  setCurrentApplication: (app) => set({ currentApplication: app }),

  getByStatus: (status) => {
    return get().applications.filter((a) => a.status === status);
  },
}));
