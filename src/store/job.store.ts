import { create } from "zustand";
import { Job, JobFilter } from "@/types";
import { sampleJobs } from "@/lib/data/jobs";

interface JobState {
  jobs: Job[];
  filteredJobs: Job[];
  savedJobs: string[];
  filters: JobFilter;
  isLoading: boolean;
  setJobs: (jobs: Job[]) => void;
  setFilters: (filters: Partial<JobFilter>) => void;
  resetFilters: () => void;
  toggleSaveJob: (jobId: string) => void;
  applyFilters: () => void;
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

export const useJobStore = create<JobState>((set, get) => ({
  jobs: sampleJobs,
  filteredJobs: sampleJobs,
  savedJobs: ["5", "9"],
  filters: defaultFilters,
  isLoading: false,

  setJobs: (jobs) => set({ jobs, filteredJobs: jobs }),

  setFilters: (newFilters) => {
    const filters = { ...get().filters, ...newFilters };
    set({ filters });
    get().applyFilters();
  },

  resetFilters: () => {
    set({ filters: defaultFilters, filteredJobs: get().jobs });
  },

  toggleSaveJob: (jobId) => {
    const saved = get().savedJobs;
    if (saved.includes(jobId)) {
      set({ savedJobs: saved.filter((id) => id !== jobId) });
    } else {
      set({ savedJobs: [...saved, jobId] });
    }
  },

  applyFilters: () => {
    const { jobs, filters } = get();
    let filtered = [...jobs];

    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase();
      filtered = filtered.filter(
        (j) =>
          j.title.toLowerCase().includes(kw) ||
          j.company.toLowerCase().includes(kw) ||
          j.skills.some((s) => s.toLowerCase().includes(kw))
      );
    }

    if (filters.location) {
      const loc = filters.location.toLowerCase();
      filtered = filtered.filter((j) =>
        j.location.toLowerCase().includes(loc)
      );
    }

    if (filters.experienceLevel) {
      filtered = filtered.filter(
        (j) => j.experienceLevel === filters.experienceLevel
      );
    }

    if (filters.industry) {
      filtered = filtered.filter((j) => j.industry === filters.industry);
    }

    if (filters.remote) {
      filtered = filtered.filter((j) => j.remote);
    }

    set({ filteredJobs: filtered });
  },
}));
