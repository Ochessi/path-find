"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { ResumeUpload } from "@/components/onboarding/resume-upload";
import { PreferencesSetup } from "@/components/onboarding/preferences-setup";
import { CoreProfileStep, type CoreProfileData } from "@/components/onboarding/core-profile-step";
import {
  CareerIntelligenceStep,
  type CareerData,
  type CareerIntelligence,
} from "@/components/onboarding/career-intelligence-step";
import {
  SkillsEducationStep,
  type SkillsEducationData,
  type EducationEntry,
} from "@/components/onboarding/skills-education-step";

// ─── Step IDs ────────────────────────────────────────────────────────────────
type StepId =
  | "upload"
  | "core-profile"
  | "career-intelligence"
  | "skills-education"
  | "preferences";

const STEPS: StepId[] = [
  "upload",
  "core-profile",
  "career-intelligence",
  "skills-education",
  "preferences",
];

function stepMeta(stepId: StepId): { title: string; description: string } {
  switch (stepId) {
    case "upload":
      return {
        title: "Upload your resume",
        description: "Start by uploading your current resume. We'll extract your details automatically.",
      };
    case "core-profile":
      return {
        title: "Your core profile",
        description: "Verify and edit the key details extracted from your resume.",
      };
    case "career-intelligence":
      return {
        title: "Career intelligence",
        description: "Tell us about your career focus — we use this to match you to the right jobs.",
      };
    case "skills-education":
      return {
        title: "Skills & education",
        description: "Review your skills and educational background.",
      };
    case "preferences":
      return {
        title: "Job preferences",
        description: "Tell us what you're looking for in your next role.",
      };
  }
}

// ─── Default state factories ──────────────────────────────────────────────────

function defaultCoreProfile(user: any): CoreProfileData {
  return {
    full_name: user?.full_name ?? "",
    email: user?.email ?? "",
    phone: user?.profile?.phone ?? "",
    headline: user?.profile?.headline ?? "",
    location: user?.profile?.location ?? "",
    linkedin_url: user?.profile?.linkedin_url ?? "",
    portfolio_url: user?.profile?.portfolio_url ?? "",
  };
}

const defaultCareerIntelligence: CareerIntelligence = {
  years_experience: null,
  primary_domain: null,
  specializations: [],
};

const defaultCareerData: CareerData = {
  bio: "",
  career_intelligence: defaultCareerIntelligence,
  job_titles: [],
};

const defaultSkillsEducation: SkillsEducationData = {
  hard_skills: [],
  soft_skills: [],
  education: [],
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  const [stepIndex, setStepIndex] = useState(0);
  const [fromAI, setFromAI] = useState(false);

  // ── Per-step data state ──────────────────────────────────────────────────
  const [coreProfile, setCoreProfile] = useState<CoreProfileData>(
    () => defaultCoreProfile(user)
  );

  const [careerData, setCareerData] = useState<CareerData>(defaultCareerData);

  const [skillsEduData, setSkillsEduData] = useState<SkillsEducationData>(
    defaultSkillsEducation
  );

  const [preferencesData, setPreferencesData] = useState({
    job_types: [] as string[],
    industries: [] as string[],
    salary_min: 0,
    remote: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ── Derived ──────────────────────────────────────────────────────────────
  const currentStepId: StepId = STEPS[stepIndex] ?? "upload";
  const { title, description } = stepMeta(currentStepId);
  const totalSteps = STEPS.length;
  const progress = ((stepIndex + 1) / totalSteps) * 100;
  const isLastStep = stepIndex === STEPS.length - 1;

  // ── Navigation ────────────────────────────────────────────────────────────
  const goNext = () => setStepIndex((i) => Math.min(STEPS.length - 1, i + 1));
  const goBack = () => setStepIndex((i) => Math.max(0, i - 1));

  // ── Upload complete handler ────────────────────────────────────────────────
  const handleResumeUploaded = (data: any) => {
    setFromAI(true);

    const p = data?.profile_updated;
    const ext = data?.extracted;
    if (p) {
      // ── Core profile ──────────────────────────────────────────────────
      setCoreProfile({
        full_name: ext?.name || p.name || user?.full_name || "",
        email: (ext?.emails && ext.emails.length > 0 ? ext.emails[0] : p.email) || user?.email || "",
        phone: p.phone || "",
        headline: p.headline || "",
        location: p.location || "",
        linkedin_url: p.linkedin_url || "",
        portfolio_url: p.portfolio_url || "",
      });

      // ── Career data ───────────────────────────────────────────────────
      const ci: CareerIntelligence = p.career_intelligence ?? defaultCareerIntelligence;
      setCareerData({
        bio: p.bio || "",
        career_intelligence: {
          years_experience: ci.years_experience ?? null,
          primary_domain: ci.primary_domain ?? null,
          specializations: Array.isArray(ci.specializations) ? ci.specializations : [],
        },
        job_titles: Array.isArray(p.job_titles) ? p.job_titles : [],
      });

      // ── Skills & education ────────────────────────────────────────────
      const rawHard: any[] = p.hard_skills ?? [];
      const rawSoft: any[] = p.soft_skills ?? [];
      const rawEdu: any[] = p.education ?? [];

      const toStrArr = (arr: any[]) =>
        arr.map((s: any) => (typeof s === "string" ? s : s?.name ?? "")).filter(Boolean);

      const eduEntries: EducationEntry[] = rawEdu.map((e: any) => ({
        institution: e.institution ?? "",
        degree: e.degree ?? "",
        field_of_study: e.field_of_study ?? "",
        start_year: e.start_year ?? null,
        end_year: e.end_year ?? null,
        relevant_coursework: Array.isArray(e.relevant_coursework) ? e.relevant_coursework : [],
      }));

      setSkillsEduData({
        hard_skills: toStrArr(rawHard),
        soft_skills: toStrArr(rawSoft),
        education: eduEntries,
      });
    }

    goNext();
  };

  // ── Skip resume ────────────────────────────────────────────────────────────
  const handleSkipResume = () => {
    setFromAI(false);
    goNext();
  };

  // ── Final submission ───────────────────────────────────────────────────────
  const handleFinish = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const { authApi } = await import("@/lib/api/auth");

      // Merge hard + soft skills into the unified skills array
      const allSkills = [
        ...skillsEduData.hard_skills.map((name) => ({ name, level: "intermediate", type: "hard" })),
        ...skillsEduData.soft_skills.map((name) => ({ name, level: "intermediate", type: "soft" })),
      ];

      await authApi.patchMe({
        // Core profile
        full_name: coreProfile.full_name,
        headline: coreProfile.headline,
        phone: coreProfile.phone,
        location: coreProfile.location,
        linkedin: coreProfile.linkedin_url,
        website: coreProfile.portfolio_url,

        // Career data
        summary: careerData.bio,

        // Skills & education
        skills: allSkills,
        education: skillsEduData.education,

        // Preferences (including career intelligence merged in)
        preferences: {
          job_types: preferencesData.job_types,
          industries: preferencesData.industries,
          salary_min: preferencesData.salary_min,
          remote: preferencesData.remote,
          career_intelligence: careerData.career_intelligence,
        },

        onboarding_complete: true,
      } as any);

      const updatedUser = await authApi.getMe();
      setUser(updatedUser);
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Failed to complete onboarding:", err);
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinue = () => {
    if (isLastStep) {
      handleFinish();
    } else {
      goNext();
    }
  };

  const isContinueDisabled = isSubmitting;

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium text-muted-foreground">
          <span>Step {stepIndex + 1} of {totalSteps}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
        {/* Step labels */}
        <div className="hidden sm:flex justify-between text-[10px] text-muted-foreground px-0.5 mt-0.5">
          {STEPS.map((s, i) => (
            <span
              key={s}
              className={i <= stepIndex ? "text-primary font-semibold" : ""}
            >
              {stepMeta(s).title.split(" ")[0]}
            </span>
          ))}
        </div>
      </div>

      <Card className="shadow-lg border-muted">
        <CardHeader>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>

        <CardContent className="min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepId}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {currentStepId === "upload" && (
                <ResumeUpload
                  onUploadComplete={handleResumeUploaded}
                  onSkip={handleSkipResume}
                />
              )}

              {currentStepId === "core-profile" && (
                <CoreProfileStep
                  data={coreProfile}
                  onChange={setCoreProfile}
                  fromAI={fromAI}
                />
              )}

              {currentStepId === "career-intelligence" && (
                <CareerIntelligenceStep
                  data={careerData}
                  onChange={setCareerData}
                  fromAI={fromAI}
                />
              )}

              {currentStepId === "skills-education" && (
                <SkillsEducationStep
                  data={skillsEduData}
                  onChange={setSkillsEduData}
                  fromAI={fromAI}
                />
              )}

              {currentStepId === "preferences" && (
                <PreferencesSetup
                  data={preferencesData}
                  onChange={setPreferencesData}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {submitError && (
            <p className="mt-4 text-sm text-destructive text-center">{submitError}</p>
          )}
        </CardContent>

        <CardFooter className="flex justify-between border-t p-6">
          <Button
            variant="ghost"
            onClick={goBack}
            disabled={stepIndex === 0 || isSubmitting}
          >
            Back
          </Button>

          {/* Upload step drives its own navigation (inside the component) */}
          {currentStepId !== "upload" && (
            <Button onClick={handleContinue} disabled={isContinueDisabled}>
              {isSubmitting
                ? "Saving…"
                : isLastStep
                ? "Complete setup"
                : "Continue"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
