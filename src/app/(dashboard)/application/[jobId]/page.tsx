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
import { JobDescriptionPanel } from "@/components/application/job-description-panel";
import { AiResumeEditor } from "@/components/application/ai-resume-editor";
import { AiCoverLetterEditor } from "@/components/application/ai-cover-letter-editor";
import { FormAutofillPreview } from "@/components/application/form-autofill-preview";
import { ReviewSubmitModal } from "@/components/application/review-submit-modal";
import { sampleJobs } from "@/lib/data/jobs";
import { Job } from "@/types";

function generateResumeContent(job: Job) {
  return `Professional Summary:\nHighly motivated ${job.experienceLevel}-level professional with strong experience in ${job.skills.slice(0, 3).join(", ")}. Proven success designing and delivering scalable solutions for ${job.industry} teams.\n\nExperience Highlights:\n- Built performant user experiences and optimized workflows for ${job.company}.\n- Collaborated across product, design, and engineering to ship high-impact features.\n- Leveraged ${job.skills.slice(0, 3).join(", ")} to reduce time to market and improve reliability.\n\nSkills:\n${job.skills.join(", ")}`;
}

function generateCoverLetterContent(job: Job, tone: "professional" | "enthusiastic" | "conversational") {
  const intro =
    tone === "professional"
      ? `Dear Hiring Manager at ${job.company},`
      : tone === "enthusiastic"
      ? `Hello ${job.company} team!`
      : `Dear ${job.company} Hiring Team,`;

  const body =
    tone === "professional"
      ? `I am excited to apply for the ${job.title} role at ${job.company}. My background in ${job.skills.slice(0, 3).join(", ")} and experience working on ${job.industry.toLowerCase()} products make me a strong match for this role.`
      : tone === "enthusiastic"
      ? `I’m thrilled by the opportunity to join ${job.company} as a ${job.title}. I love working with ${job.skills.slice(0, 2).join(" and ")} and building products that make a real impact.`
      : `I’m applying for the ${job.title} role because I know I can hit the ground running. My experience with ${job.skills.slice(0, 3).join(", ")} fits the outcomes ${job.company} is aiming for.`;

  const closing =
    tone === "professional"
      ? `I would welcome the opportunity to discuss how I can contribute to ${job.company}. Thank you for your consideration.`
      : tone === "enthusiastic"
      ? `I’d love to chat further about how I can support ${job.company}'s next phase of growth. Thank you for considering my application!`
      : `I’m excited about the opportunity and would welcome the chance to discuss how I can contribute to ${job.company}.`;

  return `${intro}\n\n${body}\n\n${closing}\n\nBest regards,\nAlex Johnson`;
}

export default function ApplicationPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;
  const job = sampleJobs.find((j) => j.id === jobId);

  const [activeTab, setActiveTab] = React.useState("resume");
  const [isReviewOpen, setIsReviewOpen] = React.useState(false);
  const [coverTone, setCoverTone] = React.useState<
    "professional" | "enthusiastic" | "conversational"
  >("professional");
  const [resumeContent, setResumeContent] = React.useState("");
  const [coverLetterContent, setCoverLetterContent] = React.useState("");
  const [isResumeRegenerating, setIsResumeRegenerating] = React.useState(true);
  const [isCoverRegenerating, setIsCoverRegenerating] = React.useState(true);

  React.useEffect(() => {
    if (!job) return;
    setIsResumeRegenerating(true);
    setIsCoverRegenerating(true);
    const timer = window.setTimeout(() => {
      setResumeContent(generateResumeContent(job));
      setCoverLetterContent(generateCoverLetterContent(job, coverTone));
      setIsResumeRegenerating(false);
      setIsCoverRegenerating(false);
    }, 900);

    return () => window.clearTimeout(timer);
  }, [job, coverTone]);

  const isGenerating = isResumeRegenerating || isCoverRegenerating;

  const handleRegenerateResume = () => {
    if (!job) return;
    setIsResumeRegenerating(true);
    window.setTimeout(() => {
      setResumeContent(generateResumeContent(job));
      setIsResumeRegenerating(false);
    }, 900);
  };

  const handleRegenerateCoverLetter = () => {
    if (!job) return;
    setIsCoverRegenerating(true);
    window.setTimeout(() => {
      setCoverLetterContent(generateCoverLetterContent(job, coverTone));
      setIsCoverRegenerating(false);
    }, 900);
  };

  if (!job) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="rounded-3xl border border-dashed border-border/60 bg-card p-12 text-center shadow-sm">
          <p className="text-lg font-semibold">Job not found</p>
          <p className="text-sm text-muted-foreground mt-2">This role is not available in the demo data.</p>
          <Button variant="outline" className="mt-6" onClick={() => router.push("/jobs")}>Back to jobs</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
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
              <p className="text-sm text-muted-foreground mt-0.5">{job.title}</p>
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

        <div className="flex flex-1 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="hidden lg:flex lg:w-[45%] xl:w-[42%] border-r overflow-y-auto"
          >
            <JobDescriptionPanel job={job} />
          </motion.div>

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
                        content={resumeContent}
                        onRegenerate={handleRegenerateResume}
                        isRegenerating={isResumeRegenerating}
                        onContentChange={setResumeContent}
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
                        content={coverLetterContent}
                        tone={coverTone}
                        onToneChange={setCoverTone}
                        onRegenerate={handleRegenerateCoverLetter}
                        isRegenerating={isCoverRegenerating}
                        onContentChange={setCoverLetterContent}
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
        resumeContent={resumeContent}
        coverLetterContent={coverLetterContent}
      />
    </>
  );
}
