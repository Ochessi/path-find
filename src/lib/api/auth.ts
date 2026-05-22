import { apiClient } from "./client";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  /** Sent as `full_name` to match the backend RegisterSerializer */
  full_name: string;
  email: string;
  password: string;
}

export interface TokenPair {
  access: string;
  refresh: string;
}

export interface UserProfile {
  id: string;
  /** Maps to `full_name` on the backend */
  full_name: string;
  email: string;
  /** Maps to `avatar_url` on the backend */
  avatar_url: string | null;
  onboarding_complete: boolean;
  headline?: string;
  summary?: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  skills?: string[];
  experience?: Experience[];
  education?: Education[];
  preferences?: JobPreferences;
  career_intelligence?: CareerIntelligence;
  /** Nested profile object from backend */
  profile?: {
    id: string;
    headline: string;
    location: string;
    phone: string;
    linkedin_url: string;
    github_url: string;
    portfolio_url: string;
    bio: string;
    experience: unknown[];
    education: unknown[];
    skills: unknown[];
    job_preferences: Record<string, unknown>;
    career_intelligence: Record<string, unknown>;
  } | null;
  completeness?: number;
}

export interface Experience {
  id?: string;
  title: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string | null;
  current: boolean;
  description: string;
}

export interface Education {
  id?: string;
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date: string;
}

export interface JobPreferences {
  job_types?: string[];
  locations?: string[];
  industries?: string[];
  salary_min?: number;
  salary_max?: number;
  remote?: boolean;
}

export interface CareerIntelligence {
  years_experience?: number | null;
  primary_domain?: string | null;
  specializations?: string[];
}

export interface AuthResponse extends TokenPair {
  user: UserProfile;
}

// ─── Auth API ────────────────────────────────────────────────────────────────

export const authApi = {
  /** POST /api/auth/register/ */
  register: (data: RegisterPayload) =>
    apiClient.post<AuthResponse>("/api/auth/register/", data).then((r) => r.data),

  /** POST /api/auth/login/ */
  login: (data: LoginPayload) =>
    apiClient.post<AuthResponse>("/api/auth/login/", data).then((r) => r.data),

  /** POST /api/auth/token/refresh/ */
  refreshToken: (refresh: string) =>
    apiClient
      .post<TokenPair>("/api/auth/token/refresh/", { refresh })
      .then((r) => r.data),

  /** POST /api/auth/google/ */
  googleLogin: (access_token: string) =>
    apiClient
      .post<AuthResponse>("/api/auth/google/", { access_token })
      .then((r) => r.data),

  /** GET /api/auth/me/ */
  getMe: () =>
    apiClient.get<UserProfile>("/api/auth/me/").then((r) => r.data),

  /** PUT /api/auth/me/ */
  updateMe: (data: Partial<UserProfile>) =>
    apiClient.put<UserProfile>("/api/auth/me/", data).then((r) => r.data),

  /** PATCH /api/auth/me/ */
  patchMe: (data: Partial<UserProfile>) =>
    apiClient.patch<UserProfile>("/api/auth/me/", data).then((r) => r.data),
};
