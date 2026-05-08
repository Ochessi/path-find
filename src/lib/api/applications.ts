import { apiClient } from "./client";
import { Application as FrontendApplication, ApplicationStatus } from "@/types";
import { JobListingResponse, mapJobListing } from "./jobs";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApplicationPayload {
  job_id?: string;
  /** For manually-tracked applications not in the Pathfind DB */
  job_title?: string;
  job_company?: string;
  status?: ApplicationStatus;
  notes?: string;
}

export interface ApplicationResponse {
  id: string;
  job_id: string | null;
  job: JobListingResponse | null;
  job_title?: string;
  job_company?: string;
  status: ApplicationStatus;
  applied_date: string;
  last_activity: string;
  last_activity_description: string;
  notes: string;
  resume_url: string | null;
  cover_letter: string | null;
  ai_resume: string | null;
  ai_cover_letter: string | null;
}

export interface PaginatedApplicationsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApplicationResponse[];
}

export interface PaginatedApplications {
  count: number;
  next: string | null;
  previous: string | null;
  results: FrontendApplication[];
}

export interface GeneratePayload {
  /** Preferred: derive the job listing from an existing application. */
  application_id?: string;
  /** Fallback: supply a job listing ID directly (e.g. before an Application record exists). */
  job_listing_id?: string;
  tone?: "professional" | "enthusiastic" | "conversational";
}

export interface TaskAccepted {
  task_id: string;
  status: string;
  message?: string;
}

// ─── Transformer ──────────────────────────────────────────────────────────────

export function mapApplication(data: ApplicationResponse): FrontendApplication {
  return {
    id: data.id,
    jobId: data.job_id || "",
    // Fallback to manual title/company if the job doesn't exist in the DB
    job: data.job 
      ? mapJobListing(data.job) 
      : {
          id: data.job_id || `manual-${data.id}`,
          title: data.job_title || "Unknown Role",
          company: data.job_company || "Unknown Company",
          location: "Unknown",
          type: "Full-time",
          salary: "Not specified",
          description: "Manually added application.",
          requirements: [],
          skills: [],
          matchScore: 0,
          postedDate: data.applied_date || "Just now",
          industry: "Various",
          experienceLevel: "Varies",
          remote: false,
        },
    status: data.status,
    appliedDate: data.applied_date,
    lastActivity: data.last_activity,
    lastActivityDescription: data.last_activity_description,
    notes: data.notes || "",
    resumeUrl: data.resume_url || undefined,
    coverLetter: data.cover_letter || undefined,
    aiResume: data.ai_resume || undefined,
    aiCoverLetter: data.ai_cover_letter || undefined,
  };
}

// ─── Applications API ─────────────────────────────────────────────────────────

export const applicationsApi = {
  /** GET /api/jobs/applications/ */
  list: (params?: { status?: ApplicationStatus; search?: string; page?: number }) =>
    apiClient
      .get<PaginatedApplicationsResponse>("/api/jobs/applications/", { params })
      .then((r) => {
        const raw = r.data;
        const results = Array.isArray(raw?.results) ? raw.results : (Array.isArray(raw) ? raw as unknown as ApplicationResponse[] : []);
        return {
          ...raw,
          count: raw?.count ?? results.length,
          results: results.map(mapApplication),
        };
      }),

  /** GET /api/jobs/applications/<id>/ */
  get: (id: string) =>
    apiClient
      .get<ApplicationResponse>(`/api/jobs/applications/${id}/`)
      .then((r) => mapApplication(r.data)),

  /** POST /api/jobs/applications/ */
  create: (data: ApplicationPayload) =>
    apiClient
      .post<ApplicationResponse>("/api/jobs/applications/", data)
      .then((r) => mapApplication(r.data)),

  /** PUT /api/jobs/applications/<id>/ */
  update: (id: string, data: ApplicationPayload) =>
    apiClient
      .put<ApplicationResponse>(`/api/jobs/applications/${id}/`, data)
      .then((r) => mapApplication(r.data)),

  /** PATCH /api/jobs/applications/<id>/ */
  patch: (id: string, data: Partial<ApplicationPayload>) =>
    apiClient
      .patch<ApplicationResponse>(`/api/jobs/applications/${id}/`, data)
      .then((r) => mapApplication(r.data)),

  /** DELETE /api/jobs/applications/<id>/ */
  delete: (id: string) =>
    apiClient
      .delete(`/api/jobs/applications/${id}/`)
      .then((r) => r.data),

  /**
   * POST /api/jobs/applications/generate/
   * Trigger AI content generation (cover letter + tailored resume).
   * Returns 202 Accepted with task_id – poll via tasksApi.
   */
  generate: (data: GeneratePayload) =>
    apiClient
      .post<TaskAccepted>("/api/jobs/applications/generate/", data)
      .then((r) => r.data),

  /**
   * POST /api/jobs/applications/<id>/submit-portal/
   * Enqueue the Browserbase + Playwright form-fill automation for this
   * application.  Returns 202 Accepted with task_id – poll via tasksApi.
   */
  submitToPortal: (applicationId: string) =>
    apiClient
      .post<TaskAccepted>(`/api/jobs/applications/${applicationId}/submit-portal/`)
      .then((r) => r.data),
};
