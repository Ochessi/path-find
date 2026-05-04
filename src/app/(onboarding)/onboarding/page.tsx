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

// Sub-components will be imported here
import { ResumeUpload } from "@/components/onboarding/resume-upload";
import { AIParsingPreview } from "@/components/onboarding/ai-parsing-preview";
import { ProfileCompletion } from "@/components/onboarding/profile-completion";
import { PreferencesSetup } from "@/components/onboarding/preferences-setup";

type Step = 1 | 2 | 3 | 4;

export default function OnboardingPage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [step, setStep] = useState<Step>(1);
  const [parsedData, setParsedData] = useState<any>(null);

  const [profileData, setProfileData] = useState({
    summary: "",
    linkedin: "",
    website: "",
    location: "",
  });

  const [preferencesData, setPreferencesData] = useState({
    job_types: ["Full-time"],
    industries: ["SaaS"],
    salary_min: 120000,
    remote: true,
  });

  const handleNext = async () => {
    if (step < 4) {
      setStep((step + 1) as Step);
    } else {
      // Finish onboarding
      try {
        const { authApi } = await import("@/lib/api/auth");
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
        const updatedUser = await authApi.getMe();
        setUser(updatedUser);
        router.push("/dashboard");
      } catch (err) {
        console.error("Failed to complete onboarding:", err);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep((step - 1) as Step);
  };

  const progress = (step / 4) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium text-muted-foreground">
          <span>Step {step} of 4</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="shadow-lg border-muted">
        <CardHeader>
          <CardTitle className="text-2xl">
            {step === 1 && "Upload your resume"}
            {step === 2 && "Magic in progress"}
            {step === 3 && "Complete your profile"}
            {step === 4 && "Set your preferences"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "Start by uploading your current resume. We'll extract your details."}
            {step === 2 && "Review what our AI extracted from your document."}
            {step === 3 && "Fill in any gaps so we can match you perfectly."}
            {step === 4 && "Tell us what you're looking for in your next role."}
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {step === 1 && <ResumeUpload onUploadComplete={(data) => {
                if (data) {
                  setParsedData(data);
                  const pData = data.profile_updated;
                  if (pData) {
                    setProfileData((prev) => ({
                      ...prev,
                      summary: pData.summary || prev.summary,
                      location: pData.location || prev.location,
                      linkedin: pData.linkedin || prev.linkedin,
                      website: pData.portfolio_url || prev.website,
                    }));
                  }
                }
                handleNext();
              }} />}
              {step === 2 && <AIParsingPreview parsedData={parsedData} />}
              {step === 3 && <ProfileCompletion data={profileData} onChange={setProfileData} />}
              {step === 4 && <PreferencesSetup data={preferencesData} onChange={setPreferencesData} />}
            </motion.div>
          </AnimatePresence>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-6">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={step === 1}
          >
            Back
          </Button>
          <Button onClick={handleNext}>
            {step === 4 ? "Complete" : "Continue"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
