export type ApplicationStatus =
  | "saved"
  | "applied"
  | "interviewing"
  | "offer"
  | "rejected";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  onboardingComplete: boolean;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

export interface Profile {
  userId: string;
  headline: string;
  summary: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  preferences: JobPreferences;
  completeness: number;
}

export interface JobPreferences {
  jobTypes: string[];
  locations: string[];
  industries: string[];
  salaryMin: number;
  salaryMax: number;
  remote: boolean;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  skills: string[];
  matchScore: number;
  postedDate: string;
  industry: string;
  experienceLevel: string;
  remote: boolean;
}

export interface Application {
  id: string;
  jobId: string;
  job: Job;
  status: ApplicationStatus;
  appliedDate: string;
  lastActivity: string;
  lastActivityDescription: string;
  notes: string;
  resumeUrl?: string;
  coverLetter?: string;
  aiResume?: string;
  aiCoverLetter?: string;
}

export interface Notification {
  id: string;
  type: "match" | "followup" | "status" | "system";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

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

export type OnboardingStep =
  | "upload"
  | "parsing"
  | "profile"
  | "preferences";
