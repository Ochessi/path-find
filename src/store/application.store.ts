import { create } from "zustand";
import { Application, ApplicationStatus } from "@/types";
import { sampleApplications } from "@/lib/data/applications";

interface ApplicationState {
  applications: Application[];
  currentApplication: Application | null;
  isLoading: boolean;
  setApplications: (apps: Application[]) => void;
  setCurrentApplication: (app: Application | null) => void;
  updateStatus: (appId: string, status: ApplicationStatus) => void;
  addApplication: (app: Application) => void;
  updateNotes: (appId: string, notes: string) => void;
  getByStatus: (status: ApplicationStatus) => Application[];
}

export const useApplicationStore = create<ApplicationState>((set, get) => ({
  applications: sampleApplications,
  currentApplication: null,
  isLoading: false,

  setApplications: (applications) => set({ applications }),

  setCurrentApplication: (app) => set({ currentApplication: app }),

  updateStatus: (appId, status) => {
    const apps = get().applications.map((a) =>
      a.id === appId ? { ...a, status } : a
    );
    set({ applications: apps });
  },

  addApplication: (app) => {
    set({ applications: [app, ...get().applications] });
  },

  updateNotes: (appId, notes) => {
    const apps = get().applications.map((a) =>
      a.id === appId ? { ...a, notes } : a
    );
    set({ applications: apps });
  },

  getByStatus: (status) => {
    return get().applications.filter((a) => a.status === status);
  },
}));
