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
  job_listing: string | null;
  job_listing_detail: JobListingResponse | null;
  status: ApplicationStatus;
  applied_at: string | null;
  updated_at: string;
  notes: string;
  ai_content: AiContent | null;
  resume: number | null;
  cover_letter: number | null;
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

export interface AiContent {
  tailored_bullets?: string;
  cover_letter?: string;
  form_fields?: {
    why_us?: string;
    years_experience?: string;
    salary_expectation?: string;
    earliest_start?: string;
    visa_sponsorship?: string;
    work_authorization?: string;
  };
  error?: string;
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
    id: data.id.toString(),
    jobId: data.job_listing?.toString() || "",
    job: data.job_listing_detail 
      ? mapJobListing(data.job_listing_detail) 
      : {
          id: data.job_listing?.toString() || `manual-${data.id}`,
          title: "Unknown Role",
          company: "Unknown Company",
          location: "Unknown",
          type: "Full-time",
          salary: "Not specified",
          description: "Manually added application.",
          requirements: [],
          skills: [],
          matchScore: 0,
          postedDate: data.applied_at || "Just now",
          industry: "Various",
          experienceLevel: "Varies",
          remote: false,
        },
    status: data.status,
    appliedDate: data.applied_at || "",
    lastActivity: data.updated_at || "",
    lastActivityDescription: "",
    notes: data.notes || "",
    resumeUrl: undefined,
    coverLetter: undefined,
    aiResume: undefined,
    aiCoverLetter: undefined,
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
  create: (data: ApplicationPayload) => {
    const payload: any = { ...data };
    if (payload.job_id) {
      payload.job_listing = payload.job_id;
      delete payload.job_id;
    }
    return apiClient
      .post<ApplicationResponse>("/api/jobs/applications/", payload)
      .then((r) => mapApplication(r.data));
  },

  /** PUT /api/jobs/applications/<id>/ */
  update: (id: string, data: ApplicationPayload) => {
    const payload: any = { ...data };
    if (payload.job_id) {
      payload.job_listing = payload.job_id;
      delete payload.job_id;
    }
    return apiClient
      .put<ApplicationResponse>(`/api/jobs/applications/${id}/`, payload)
      .then((r) => mapApplication(r.data));
  },

  /** PATCH /api/jobs/applications/<id>/ */
  patch: (id: string, data: Partial<ApplicationPayload>) => {
    const payload: any = { ...data };
    if (payload.job_id) {
      payload.job_listing = payload.job_id;
      delete payload.job_id;
    }
    return apiClient
      .patch<ApplicationResponse>(`/api/jobs/applications/${id}/`, payload)
      .then((r) => mapApplication(r.data));
  },

  /** DELETE /api/jobs/applications/<id>/ */
  delete: (id: string) =>
    apiClient
      .delete(`/api/jobs/applications/${id}/`)
      .then((r) => r.data),

  /**
   * POST /api/jobs/applications/get-or-create/
   * Returns or creates the Application record for a given job listing.
   */
  getOrCreate: (jobListingId: string) =>
    apiClient
      .post<ApplicationResponse>("/api/jobs/applications/get-or-create/", {
        job_listing_id: jobListingId,
      })
      .then((r) => r.data),

  /**
   * PATCH /api/jobs/applications/<id>/ai-content/
   * Merges edits into the stored ai_content JSON blob.
   */
  saveAiContent: (applicationId: string, content: Partial<AiContent>) =>
    apiClient
      .patch<ApplicationResponse>(
        `/api/jobs/applications/${applicationId}/ai-content/`,
        content
      )
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

