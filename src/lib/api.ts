/**
 * Pathfind – Centralized API Client
 *
 * All requests go through this module. Point the base URL at your Django
 * backend by setting NEXT_PUBLIC_API_URL in your .env.local file.
 *
 * Example .env.local:
 *   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
};

async function request<T>(
  path: string,
  { body, params, ...init }: RequestOptions = {}
): Promise<T> {
  // Build URL with optional query params
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
    });
  }

  // Read auth token from localStorage (set by auth store on login)
  let token: string | null = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("pathfind_token");
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...init.headers,
  };

  const response = await fetch(url.toString(), {
    ...init,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let errorMessage = `API Error ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail ?? errorData.message ?? errorMessage;
    } catch {
      // fallback to default message
    }
    throw new Error(errorMessage);
  }

  // 204 No Content
  if (response.status === 204) return undefined as T;

  return response.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access: string;   // JWT access token
  refresh: string;  // JWT refresh token
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    onboarding_complete: boolean;
  };
}

export const authApi = {
  login: (data: LoginPayload) =>
    request<AuthResponse>("/auth/login/", { method: "POST", body: data }),

  register: (data: RegisterPayload) =>
    request<AuthResponse>("/auth/register/", { method: "POST", body: data }),

  refreshToken: (refresh: string) =>
    request<{ access: string }>("/auth/token/refresh/", {
      method: "POST",
      body: { refresh },
    }),

  logout: () => request<void>("/auth/logout/", { method: "POST" }),
};

// ---------------------------------------------------------------------------
// User Profile
// ---------------------------------------------------------------------------

export interface ExperiencePayload {
  title: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string | null;
  current: boolean;
  description: string;
}

export interface EducationPayload {
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date: string;
}

export interface ProfilePayload {
  headline?: string;
  summary?: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  skills?: string[];
  experience?: ExperiencePayload[];
  education?: EducationPayload[];
}

export interface PreferencesPayload {
  job_types?: string[];
  locations?: string[];
  industries?: string[];
  salary_min?: number;
  salary_max?: number;
  remote?: boolean;
}

export const profileApi = {
  get: () => request<ProfilePayload>("/profile/"),

  update: (data: Partial<ProfilePayload>) =>
    request<ProfilePayload>("/profile/", { method: "PATCH", body: data }),

  uploadResume: (file: File) => {
    const form = new FormData();
    form.append("resume", file);
    return request<{ resume_url: string; parsed_data: ProfilePayload }>(
      "/profile/resume/",
      {
        method: "POST",
        headers: {},
        body: form as unknown as undefined, // Type cast to bypass the RequestOptions type
      }
    );
  },

  getPreferences: () => request<PreferencesPayload>("/profile/preferences/"),

  updatePreferences: (data: Partial<PreferencesPayload>) =>
    request<PreferencesPayload>("/profile/preferences/", {
      method: "PATCH",
      body: data,
    }),
};

// ---------------------------------------------------------------------------
// Jobs
// ---------------------------------------------------------------------------

export interface JobsParams {
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

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface JobResponse {
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

export const jobsApi = {
  list: (params?: JobsParams) =>
    request<PaginatedResponse<JobResponse>>("/jobs/", { 
      params: params as unknown as Record<string, string | number | boolean | undefined> 
    }),

  get: (id: string) => request<JobResponse>(`/jobs/${id}/`),

  save: (id: string) =>
    request<{ saved: boolean }>(`/jobs/${id}/save/`, { method: "POST" }),

  unsave: (id: string) =>
    request<{ saved: boolean }>(`/jobs/${id}/save/`, { method: "DELETE" }),

  getSaved: () => request<PaginatedResponse<JobResponse>>("/jobs/saved/"),
};

// ---------------------------------------------------------------------------
// Applications
// ---------------------------------------------------------------------------

export type ApplicationStatus =
  | "saved"
  | "applied"
  | "interviewing"
  | "offer"
  | "rejected";

export interface ApplicationPayload {
  job_id: string;
  status?: ApplicationStatus;
  notes?: string;
  ai_resume?: string;
  ai_cover_letter?: string;
}

export interface ApplicationResponse {
  id: string;
  job_id: string;
  job: JobResponse;
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

export const applicationsApi = {
  list: (params?: { status?: ApplicationStatus; search?: string }) =>
    request<PaginatedResponse<ApplicationResponse>>("/applications/", {
      params,
    }),

  get: (id: string) => request<ApplicationResponse>(`/applications/${id}/`),

  create: (data: ApplicationPayload) =>
    request<ApplicationResponse>("/applications/", {
      method: "POST",
      body: data,
    }),

  update: (id: string, data: Partial<ApplicationPayload>) =>
    request<ApplicationResponse>(`/applications/${id}/`, {
      method: "PATCH",
      body: data,
    }),

  delete: (id: string) =>
    request<void>(`/applications/${id}/`, { method: "DELETE" }),

  updateStatus: (id: string, status: ApplicationStatus) =>
    request<ApplicationResponse>(`/applications/${id}/status/`, {
      method: "PATCH",
      body: { status },
    }),
};

// ---------------------------------------------------------------------------
// AI Generation
// ---------------------------------------------------------------------------

export interface GenerateResumePayload {
  job_id: string;
  profile_id?: string;
}

export interface GenerateCoverLetterPayload {
  job_id: string;
  tone?: "professional" | "enthusiastic" | "conversational";
}

export interface GeneratedContent {
  content: string;
  tokens_used: number;
  model: string;
}

export interface ParsedResumeData {
  skills: string[];
  experience: ExperiencePayload[];
  education: EducationPayload[];
  headline: string;
  summary: string;
}

export const aiApi = {
  generateResume: (data: GenerateResumePayload) =>
    request<GeneratedContent>("/ai/resume/generate/", {
      method: "POST",
      body: data,
    }),

  generateCoverLetter: (data: GenerateCoverLetterPayload) =>
    request<GeneratedContent>("/ai/cover-letter/generate/", {
      method: "POST",
      body: data,
    }),

  parseResume: (file: File) => {
    const form = new FormData();
    form.append("resume", file);
    return request<ParsedResumeData>("/ai/resume/parse/", {
      method: "POST",
      headers: {},
      body: form as unknown as undefined,
    });
  },

  semanticSearch: (query: string) =>
    request<PaginatedResponse<JobResponse>>("/ai/jobs/search/", {
      method: "POST",
      body: { query },
    }),
};

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------

export interface TemplatePayload {
  name: string;
  type: "resume" | "cover_letter";
  content: string;
  job_title?: string;
  industry?: string;
}

export interface TemplateResponse extends TemplatePayload {
  id: string;
  created_at: string;
  updated_at: string;
}

export const templatesApi = {
  list: () => request<TemplateResponse[]>("/templates/"),

  get: (id: string) => request<TemplateResponse>(`/templates/${id}/`),

  create: (data: TemplatePayload) =>
    request<TemplateResponse>("/templates/", { method: "POST", body: data }),

  update: (id: string, data: Partial<TemplatePayload>) =>
    request<TemplateResponse>(`/templates/${id}/`, {
      method: "PATCH",
      body: data,
    }),

  delete: (id: string) =>
    request<void>(`/templates/${id}/`, { method: "DELETE" }),
};

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

export interface NotificationResponse {
  id: string;
  type: "match" | "followup" | "status" | "system";
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  action_url: string | null;
}

export const notificationsApi = {
  list: () => request<NotificationResponse[]>("/notifications/"),

  markRead: (id: string) =>
    request<void>(`/notifications/${id}/read/`, { method: "PATCH" }),

  markAllRead: () =>
    request<void>("/notifications/read-all/", { method: "POST" }),
};

// ---------------------------------------------------------------------------
// Default export for convenience
// ---------------------------------------------------------------------------

const api = {
  auth: authApi,
  profile: profileApi,
  jobs: jobsApi,
  applications: applicationsApi,
  ai: aiApi,
  templates: templatesApi,
  notifications: notificationsApi,
};

export default api;
