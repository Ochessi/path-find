"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  FileText,
  PenLine,
  Mail,
  ListChecks,
  SendHorizonal,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { jobsApi } from "@/lib/api/jobs";
import { type Job } from "@/types";
import { JobDescriptionPanel } from "@/components/application/job-description-panel";
import { AiResumeEditor } from "@/components/application/ai-resume-editor";
import { AiCoverLetterEditor } from "@/components/application/ai-cover-letter-editor";
import { FormAutofillPreview } from "@/components/application/form-autofill-preview";
import { ReviewSubmitModal } from "@/components/application/review-submit-modal";
import { Skeleton } from "@/components/ui/skeleton";

export default function ApplicationPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;
  
  const [job, setJob] = React.useState<Job | null>(null);
  const [isLoadingJob, setIsLoadingJob] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [activeTab, setActiveTab] = React.useState("resume");
  const [isReviewOpen, setIsReviewOpen] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(true);

  React.useEffect(() => {
    async function fetchJob() {
      setIsLoadingJob(true);
      try {
        const data = await jobsApi.get(jobId);
        setJob(data);
      } catch (err) {
        setError("Failed to load job details.");
      } finally {
        setIsLoadingJob(false);
      }
    }
    fetchJob();
  }, [jobId]);

  // Simulate initial AI generation
  React.useEffect(() => {
    if (!job) return;
    const timer = setTimeout(() => setIsGenerating(false), 2400);
    return () => clearTimeout(timer);
  }, [job]);

  if (isLoadingJob) {
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)] p-6 space-y-4">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)] items-center justify-center">
        <p className="text-red-500 font-medium mb-4">{error || "Job not found."}</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        {/* Header bar */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between border-b bg-card/80 backdrop-blur-md px-4 sm:px-6 py-3 shrink-0"
        >
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="rounded-xl"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold tracking-tight leading-none">
                Apply to {job.company}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {job.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-0"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              {job.matchScore}% Match
            </Badge>
            <Button
              onClick={() => setIsReviewOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2"
            >
              <SendHorizonal className="h-4 w-4" />
              <span className="hidden sm:inline">Review & Submit</span>
              <span className="sm:hidden">Submit</span>
            </Button>
          </div>
        </motion.div>

        {/* Split-screen content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: Job description (hidden on mobile, shown as tab) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="hidden lg:flex lg:w-[45%] xl:w-[42%] border-r overflow-y-auto"
          >
            <JobDescriptionPanel job={job} />
          </motion.div>

          {/* Right: AI-generated content tabs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex flex-col flex-1 overflow-hidden"
            >
              <div className="border-b px-4 sm:px-6 bg-card/40">
                <TabsList className="h-12 bg-transparent gap-1 w-full justify-start">
                  <TabsTrigger
                    value="job"
                    className="lg:hidden data-[state=active]:bg-muted rounded-lg gap-2 text-sm"
                  >
                    <FileText className="h-4 w-4" />
                    <span className="hidden sm:inline">Job</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="resume"
                    className="data-[state=active]:bg-muted rounded-lg gap-2 text-sm"
                  >
                    <PenLine className="h-4 w-4" />
                    Resume
                  </TabsTrigger>
                  <TabsTrigger
                    value="cover-letter"
                    className="data-[state=active]:bg-muted rounded-lg gap-2 text-sm"
                  >
                    <Mail className="h-4 w-4" />
                    <span className="hidden sm:inline">Cover Letter</span>
                    <span className="sm:hidden">Letter</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="autofill"
                    className="data-[state=active]:bg-muted rounded-lg gap-2 text-sm"
                  >
                    <ListChecks className="h-4 w-4" />
                    <span className="hidden sm:inline">Form Fields</span>
                    <span className="sm:hidden">Fields</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">
                  {/* Mobile-only job tab */}
                  <TabsContent
                    value="job"
                    className="lg:hidden m-0 h-full focus-visible:ring-0"
                  >
                    <motion.div
                      key="job-tab"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                    >
                      <JobDescriptionPanel job={job} />
                    </motion.div>
                  </TabsContent>

                  <TabsContent
                    value="resume"
                    className="m-0 h-full focus-visible:ring-0"
                  >
                    <motion.div
                      key="resume-tab"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                    >
                      <AiResumeEditor
                        job={job}
                        isGenerating={isGenerating}
                      />
                    </motion.div>
                  </TabsContent>

                  <TabsContent
                    value="cover-letter"
                    className="m-0 h-full focus-visible:ring-0"
                  >
                    <motion.div
                      key="cover-letter-tab"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                    >
                      <AiCoverLetterEditor
                        job={job}
                        isGenerating={isGenerating}
                      />
                    </motion.div>
                  </TabsContent>

                  <TabsContent
                    value="autofill"
                    className="m-0 h-full focus-visible:ring-0"
                  >
                    <motion.div
                      key="autofill-tab"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                    >
                      <FormAutofillPreview job={job} />
                    </motion.div>
                  </TabsContent>
                </AnimatePresence>
              </div>
            </Tabs>
          </motion.div>
        </div>
      </div>

      <ReviewSubmitModal
        job={job}
        open={isReviewOpen}
        onOpenChange={setIsReviewOpen}
      />
    </>
  );
}
