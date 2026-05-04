import { apiClient } from "./client";
import { Job } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface JobListingResponse {
  id: string;
  title: string;
  company: string;
  company_logo: string | null;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  skills: string[];
  match_score: number;
  posted_date: string;
  industry: string;
  experience_level: string;
  remote: boolean;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface JobListParams {
  keyword?: string;
  location?: string;
  industry?: string;
  experience_level?: string;
  job_type?: string;
  salary_min?: number;
  salary_max?: number;
  remote?: boolean;
  page?: number;
  page_size?: number;
}

export interface TaskAccepted {
  task_id: string;
  status: string;
  message?: string;
}

export interface FetchJobsPayload {
  keyword?: string;
  location?: string;
  sources?: string[];
}

// ─── Transformer ──────────────────────────────────────────────────────────────

export function mapJobListing(data: JobListingResponse): Job {
  return {
    id: data.id,
    title: data.title,
    company: data.company,
    companyLogo: data.company_logo || undefined,
    location: data.location,
    type: data.type,
    salary: data.salary,
    description: data.description,
    requirements: data.requirements,
    skills: data.skills,
    matchScore: data.match_score,
    postedDate: data.posted_date,
    industry: data.industry,
    experienceLevel: data.experience_level,
    remote: data.remote,
  };
}

// ─── Jobs API ────────────────────────────────────────────────────────────────

export const jobsApi = {
  /**
   * GET /api/jobs/listings/
   * Standard filtered job listings from the database.
   */
  list: (params?: JobListParams) =>
    apiClient
      .get<PaginatedResponse<JobListingResponse>>("/api/jobs/listings/", { params })
      .then((r) => ({
        ...r.data,
        results: r.data.results.map(mapJobListing),
      })),

  /**
   * GET /api/jobs/listings/<id>/
   * Fetch a specific job listing by its ID.
   */
  get: (id: string) =>
    apiClient
      .get<JobListingResponse>(`/api/jobs/listings/${id}/`)
      .then((r) => mapJobListing(r.data)),

  /**
   * GET /api/jobs/feed/
   * AI-ranked semantic job feed based on user profile embeddings.
   */
  feed: (params?: Pick<JobListParams, "page" | "page_size">) =>
    apiClient
      .get<PaginatedResponse<JobListingResponse>>("/api/jobs/feed/", { params })
      .then((r) => ({
        ...r.data,
        results: r.data.results.map(mapJobListing),
      })),

  /**
   * POST /api/jobs/resume/parse/
   * Upload and parse a resume; returns a task_id (202 Accepted).
   * Poll via tasksApi.getStatus(task_id) for the parsed profile.
   */
  parseResume: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return apiClient
      .post<TaskAccepted>("/api/jobs/resume/parse/", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },

  /**
   * POST /api/jobs/fetch/
   * Trigger manual job fetching from external APIs; returns a task_id (202 Accepted).
   */
  triggerFetch: (payload?: FetchJobsPayload) =>
    apiClient
      .post<TaskAccepted>("/api/jobs/fetch/", payload ?? {})
      .then((r) => r.data),
};
