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
import { AIParsingPreview } from "@/components/onboarding/ai-parsing-preview";
import { ProfileCompletion } from "@/components/onboarding/profile-completion";
import { PreferencesSetup } from "@/components/onboarding/preferences-setup";
import { ManualProfile, type ManualProfileData } from "@/components/onboarding/manual-profile";

// ─── Step definitions ────────────────────────────────────────────────────────
//
// AI path  (resume uploaded): upload → ai-preview → profile-completion → preferences
// Manual path (skip):         upload → manual-profile → preferences
//
type StepId =
  | "upload"
  | "ai-preview"
  | "profile-completion"
  | "manual-profile"
  | "preferences";

const AI_STEPS: StepId[] = ["upload", "ai-preview", "profile-completion", "preferences"];
const MANUAL_STEPS: StepId[] = ["upload", "manual-profile", "preferences"];

function stepMeta(stepId: StepId) {
  switch (stepId) {
    case "upload":
      return {
        title: "Upload your resume",
        description: "Start by uploading your current resume. We'll extract your details.",
      };
    case "ai-preview":
      return {
        title: "AI parsing complete",
        description: "Review what our AI extracted from your document.",
      };
    case "profile-completion":
      return {
        title: "Complete your profile",
        description: "Fill in any gaps so we can match you perfectly.",
      };
    case "manual-profile":
      return {
        title: "Build your profile",
        description: "Tell us about yourself so we can find the best matches for you.",
      };
    case "preferences":
      return {
        title: "Set your preferences",
        description: "Tell us what you're looking for in your next role.",
      };
  }
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  // Which path are we on? null until the user makes the choice on step 1.
  const [path, setPath] = useState<"ai" | "manual" | null>(null);
  const [stepIndex, setStepIndex] = useState(0);

  // Data stores
  const [parsedData, setParsedData] = useState<any>(null);

  const [profileData, setProfileData] = useState({
    summary: "",
    linkedin: "",
    website: "",
    location: "",
  });

  const [manualData, setManualData] = useState<ManualProfileData>({
    name: "",
    email: "",
    role: "",
    summary: "",
    location: "",
    linkedin: "",
    website: "",
    skills: [],
  });
  const [manualValid, setManualValid] = useState(false);

  const [preferencesData, setPreferencesData] = useState({
    job_types: [] as string[],
    industries: [] as string[],
    salary_min: 0,
    remote: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Derive current step list from chosen path (default to AI path for progress display)
  const steps = path === "manual" ? MANUAL_STEPS : AI_STEPS;
  const currentStepId: StepId = steps[stepIndex] ?? "upload";
  const { title, description } = stepMeta(currentStepId);

  const totalSteps = steps.length;
  const progress = ((stepIndex + 1) / totalSteps) * 100;

  // ─── Navigation ─────────────────────────────────────────────────────────────

  const goNext = () => setStepIndex((i) => i + 1);
  const goBack = () => setStepIndex((i) => Math.max(0, i - 1));

  /** Called when the user uploads a resume successfully */
  const handleResumeUploaded = (data: any) => {
    setPath("ai");
    if (data) {
      setParsedData(data);
      const p = data.profile_updated;
      if (p) {
        setProfileData((prev) => ({
          ...prev,
          summary: p.summary || prev.summary,
          location: p.location || prev.location,
          linkedin: p.linkedin || prev.linkedin,
          website: p.portfolio_url || prev.website,
        }));
      }
    }
    goNext();
  };

  /** Called when the user clicks "Skip" on the upload step */
  const handleSkipResume = () => {
    setPath("manual");
    setStepIndex(1); // jump to manual-profile (index 1 in MANUAL_STEPS)
  };

  /** Final submission — same DB shape for both paths */
  const handleFinish = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const { authApi } = await import("@/lib/api/auth");

      if (path === "manual") {
        // Persist full manual profile + preferences in one PATCH
        await authApi.patchMe({
          full_name: manualData.name,
          email: manualData.email,
          headline: manualData.role,
          summary: manualData.summary,
          location: manualData.location,
          linkedin: manualData.linkedin,
          website: manualData.website,
          skills: manualData.skills,
          preferences: {
            job_types: preferencesData.job_types,
            industries: preferencesData.industries,
            salary_min: preferencesData.salary_min,
            remote: preferencesData.remote,
          },
          onboarding_complete: true,
        });
      } else {
        // AI path — profile fields were pre-filled from parsed data and
        // optionally edited in the profile-completion step
        await authApi.patchMe({
          summary: profileData.summary,
          linkedin: profileData.linkedin,
          website: profileData.website,
          location: profileData.location,
          preferences: {
            job_types: preferencesData.job_types,
            industries: preferencesData.industries,
            salary_min: preferencesData.salary_min,
            remote: preferencesData.remote,
          },
          onboarding_complete: true,
        });
      }

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

  // ─── Continue / back button logic ────────────────────────────────────────────

  const isLastStep = stepIndex === steps.length - 1;

  const isContinueDisabled =
    isSubmitting ||
    (currentStepId === "manual-profile" && !manualValid);

  const handleContinue = () => {
    if (isLastStep) {
      handleFinish();
    } else {
      goNext();
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium text-muted-foreground">
          <span>Step {stepIndex + 1} of {totalSteps}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
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

              {currentStepId === "ai-preview" && (
                <AIParsingPreview parsedData={parsedData} />
              )}

              {currentStepId === "profile-completion" && (
                <ProfileCompletion
                  data={profileData}
                  onChange={setProfileData}
                />
              )}

              {currentStepId === "manual-profile" && (
                <ManualProfile
                  data={manualData}
                  onChange={setManualData}
                  onValidChange={setManualValid}
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
            <p className="mt-4 text-sm text-destructive text-center">
              {submitError}
            </p>
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
          {/* Hide Continue on step 1 — navigation is driven by upload/skip actions */}
          {currentStepId !== "upload" && (
            <Button
              onClick={handleContinue}
              disabled={isContinueDisabled}
            >
              {isSubmitting
                ? "Saving…"
                : isLastStep
                ? "Complete"
                : "Continue"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
