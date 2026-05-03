"use client";

import { create } from "zustand";
import { jobsApi, type JobListParams } from "@/lib/api/jobs";
import { type Job } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface JobFilter {
  keyword: string;
  location: string;
  experienceLevel: string;
  industry: string;
  salaryMin: number;
  salaryMax: number;
  remote: boolean;
  jobType: string;
}

interface JobState {
  // Data
  jobs: Job[];
  feedJobs: Job[];
  totalCount: number;
  feedTotalCount: number;
  savedJobs: string[];

  // Pagination
  currentPage: number;

  // Filters (kept in store so filter sidebar stays in sync across re-renders)
  filters: JobFilter;

  // UI state
  isLoading: boolean;
  isFeedLoading: boolean;
  error: string | null;

  // Actions
  fetchJobs: (params?: JobListParams) => Promise<void>;
  fetchFeed: (page?: number) => Promise<void>;
  setFilters: (filters: Partial<JobFilter>) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
  toggleSaveJob: (id: string) => void;
}

const defaultFilters: JobFilter = {
  keyword: "",
  location: "",
  experienceLevel: "",
  industry: "",
  salaryMin: 0,
  salaryMax: 500000,
  remote: false,
  jobType: "",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Map frontend filter keys → Django query param names */
function filtersToParams(filters: JobFilter, page: number): JobListParams {
  return {
    keyword: filters.keyword || undefined,
    location: filters.location || undefined,
    experience_level: filters.experienceLevel || undefined,
    industry: filters.industry || undefined,
    salary_min: filters.salaryMin > 0 ? filters.salaryMin : undefined,
    salary_max: filters.salaryMax < 500000 ? filters.salaryMax : undefined,
    remote: filters.remote || undefined,
    job_type: filters.jobType || undefined,
    page,
  };
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useJobStore = create<JobState>()((set, get) => ({
  jobs: [],
  feedJobs: [],
  totalCount: 0,
  feedTotalCount: 0,
  currentPage: 1,
  filters: defaultFilters,
  isLoading: false,
  isFeedLoading: false,
  error: null,
  savedJobs: [],

  fetchJobs: async (overrideParams?: JobListParams) => {
    set({ isLoading: true, error: null });
    try {
      const { filters, currentPage } = get();
      const params = overrideParams ?? filtersToParams(filters, currentPage);
      const data = await jobsApi.list(params);
      set({
        jobs: data.results,
        totalCount: data.count,
        isLoading: false,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load jobs.";
      set({ isLoading: false, error: message });
    }
  },

  fetchFeed: async (page = 1) => {
    set({ isFeedLoading: true, error: null });
    try {
      const data = await jobsApi.feed({ page });
      set({
        feedJobs: data.results,
        feedTotalCount: data.count,
        isFeedLoading: false,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load job feed.";
      set({ isFeedLoading: false, error: message });
    }
  },

  setFilters: (newFilters: Partial<JobFilter>) => {
    const filters = { ...get().filters, ...newFilters };
    set({ filters, currentPage: 1 });
    // Re-fetch with new filters
    get().fetchJobs(filtersToParams(filters, 1));
  },

  resetFilters: () => {
    set({ filters: defaultFilters, currentPage: 1 });
    get().fetchJobs(filtersToParams(defaultFilters, 1));
  },

  setPage: (page: number) => {
    set({ currentPage: page });
    const { filters } = get();
    get().fetchJobs(filtersToParams(filters, page));
  },

  toggleSaveJob: (id: string) => {
    set((state) => ({
      savedJobs: state.savedJobs.includes(id)
        ? state.savedJobs.filter((savedId) => savedId !== id)
        : [...state.savedJobs, id],
    }));
  },
}));
