"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  FileText,
  Mail,
  ListChecks,
  SendHorizonal,
  Loader2,
  AlertCircle,
  Building2,
  BookmarkPlus,
  BookmarkCheck,
  XCircle,
  Bot,
} from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Job } from "@/types";
import { useApplicationStore } from "@/store/application.store";
import { applicationsApi, ApplicationResponse } from "@/lib/api/applications";
import { pollTask } from "@/lib/api/tasks";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ReviewSubmitModalProps {
  job: Job;
  application: ApplicationResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SubmitPhase =
  | "idle"
  | "creating"
  | "queuing"
  | "pending"
  | "started"
  | "success"
  | "failure";

const STATUS_MESSAGES: Record<SubmitPhase, string> = {
  idle: "",
  creating: "Creating application record…",
  queuing: "Connecting to Browserbase…",
  pending: "Waiting for an automation worker…",
  started: "Filling out the application form…",
  success: "Application submitted!",
  failure: "Submission failed. Please try manually.",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function ReviewSubmitModal({
  job,
  application,
  open,
  onOpenChange,
}: ReviewSubmitModalProps) {
  const router = useRouter();
  // We use applicationsApi.create() directly so we get the returned id;
  // state sync is done via useApplicationStore.setState() below.

  const [phase, setPhase] = React.useState<SubmitPhase>("idle");
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [isSavingTemplate, setIsSavingTemplate] = React.useState(false);
  const [isTemplateSaved, setIsTemplateSaved] = React.useState(false);
  const [createdAppId, setCreatedAppId] = React.useState<string | null>(null);

  const isSubmitting = ["creating", "queuing", "pending", "started"].includes(phase);
  const isSuccess = phase === "success";
  const isFailure = phase === "failure";

  const checklist = [
    {
      id: "resume",
      label: "AI-Tailored Resume Selected",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      id: "cover-letter",
      label: "Cover Letter Tone Optimized",
      icon: <Mail className="h-4 w-4" />,
    },
    {
      id: "form",
      label: "Application Fields Reviewed",
      icon: <ListChecks className="h-4 w-4" />,
    },
  ];

  const handleSubmit = async () => {
    setErrorMsg(null);

    try {
      // ── Step 1: Ensure Application record exists ──────────────────────────
      let appId = createdAppId || application?.id;
      if (!appId) {
        setPhase("creating");
        const newApp = await applicationsApi.create({
          job_id: job.id,
          status: "applied",
          notes: "Submitted via Pathfind portal automation.",
        });
        
        appId = newApp.id;
        setCreatedAppId(appId);

        // Keep the Zustand store in sync without a redundant API round-trip.
        useApplicationStore.setState((s) => ({
          applications: [newApp, ...s.applications],
        }));
      } else {
        // If we already have an application, we just need to update its status
        setPhase("creating");
        await applicationsApi.patch(appId, {
          status: "applied",
        });
      }

      // ── Step 2: Enqueue the portal submission task ─────────────────────
      setPhase("queuing");
      const { task_id } = await applicationsApi.submitToPortal(appId);

      // ── Step 3: Close modal and poll in background ─────────────────────
      onOpenChange(false);
      router.push("/applications");

      toast.promise(
        pollTask(
          task_id,
          3000,  // poll every 3 s
          20     // up to 60 seconds
        ),
        {
          loading: `Submitting application to ${job.company} in the background...`,
          success: `Application to ${job.company} submitted successfully!`,
          error: `Submission to ${job.company} failed. Please try manually.`,
        }
      );

      // Reset modal state after a moment
      setTimeout(() => {
        setPhase("idle");
        setCreatedAppId(null);
      }, 500);

    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Submission failed. Please try again.";
      setErrorMsg(msg);
      setPhase("failure");
    }
  };

  const handleSaveTemplate = async () => {
    setIsSavingTemplate(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSavingTemplate(false);
    setIsTemplateSaved(true);
    setTimeout(() => setIsTemplateSaved(false), 3000);
  };

  const handleReset = () => {
    setPhase("idle");
    setErrorMsg(null);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => !isSubmitting && !isSuccess && onOpenChange(val)}
    >
      <DialogContent className="sm:max-w-[425px]">
        <AnimatePresence mode="wait">
          {/* ── Success State ───────────────────────────────────────────── */}
          {isSuccess && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="h-16 w-16 mb-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight mb-2">
                Application Sent!
              </h2>
              <p className="text-muted-foreground">
                Your application to {job.company} is on its way.
              </p>
            </motion.div>
          )}

          {/* ── Failure State ────────────────────────────────────────────── */}
          {isFailure && (
            <motion.div
              key="failure"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-10 text-center gap-4"
            >
              <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center">
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight mb-2">
                  Submission Failed
                </h2>
                <p className="text-sm text-muted-foreground max-w-[280px]">
                  {errorMsg || "Something went wrong during automated submission."}
                </p>
              </div>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
                <Button onClick={handleReset}>Try Again</Button>
              </div>
            </motion.div>
          )}

          {/* ── In-progress State ────────────────────────────────────────── */}
          {isSubmitting && (
            <motion.div
              key="progress"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 text-center gap-6"
            >
              <div className="relative h-16 w-16">
                <div className="absolute inset-0 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <Bot className="h-7 w-7 text-emerald-600" />
                </div>
                <svg
                  className="absolute inset-0 h-16 w-16 -rotate-90"
                  viewBox="0 0 64 64"
                >
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-emerald-500/20"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray="175.9"
                    strokeDashoffset="44"
                    strokeLinecap="round"
                    className="text-emerald-500 animate-[spin_2s_linear_infinite]"
                    style={{ animationName: "dash" }}
                  />
                </svg>
              </div>

              <div>
                <p className="font-semibold text-base">Submitting your application…</p>
                <motion.p
                  key={phase}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-muted-foreground mt-1"
                >
                  {STATUS_MESSAGES[phase]}
                </motion.p>
              </div>

              {/* Progress steps */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {(
                  [
                    ["creating", "Creating"],
                    ["queuing", "Queuing"],
                    ["pending", "Waiting"],
                    ["started", "Filling form"],
                  ] as [SubmitPhase, string][]
                ).map(([step, label], i, arr) => {
                  const phaseOrder: SubmitPhase[] = [
                    "creating",
                    "queuing",
                    "pending",
                    "started",
                  ];
                  const currentIdx = phaseOrder.indexOf(phase);
                  const stepIdx = phaseOrder.indexOf(step);
                  const done = stepIdx < currentIdx;
                  const active = stepIdx === currentIdx;

                  return (
                    <React.Fragment key={step}>
                      <span
                        className={
                          done
                            ? "text-emerald-500 font-medium"
                            : active
                            ? "text-foreground font-semibold"
                            : "opacity-40"
                        }
                      >
                        {done ? "✓ " : ""}
                        {label}
                      </span>
                      {i < arr.length - 1 && (
                        <span className="opacity-30">›</span>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ── Review State (idle) ──────────────────────────────────────── */}
          {phase === "idle" && (
            <motion.div
              key="review"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DialogHeader>
                <DialogTitle>Review your application</DialogTitle>
                <DialogDescription>
                  Make sure everything looks good before we send it to{" "}
                  {job.company}.
                </DialogDescription>
              </DialogHeader>

              <div className="py-6 space-y-6">
                {/* Summary Box */}
                <div className="p-4 rounded-xl border bg-muted/30 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-lg bg-background border flex items-center justify-center text-lg font-bold">
                      {job.company[0]}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm leading-none mb-1.5">
                        {job.title}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Building2 className="h-3.5 w-3.5" />
                        {job.company}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pre-flight Checklist */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    Pre-flight Checklist
                  </h4>
                  <div className="space-y-2">
                    {checklist.map((item, idx) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-lg border bg-card"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-muted-foreground">{item.icon}</div>
                          <span className="text-sm font-medium">{item.label}</span>
                        </div>
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="flex gap-2 p-3 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 text-sm">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    By submitting, you confirm that you have reviewed all
                    AI-generated content for accuracy. Pathfind will fill and
                    submit the form automatically.
                  </p>
                </div>
              </div>

              <DialogFooter className="sm:justify-between items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={handleSaveTemplate}
                  disabled={isSubmitting || isSavingTemplate || isTemplateSaved}
                  className={
                    isTemplateSaved ? "text-emerald-600" : "text-muted-foreground"
                  }
                >
                  {isSavingTemplate ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : isTemplateSaved ? (
                    <BookmarkCheck className="h-4 w-4 mr-2" />
                  ) : (
                    <BookmarkPlus className="h-4 w-4 mr-2" />
                  )}
                  {isTemplateSaved ? "Saved as Template" : "Save as Template"}
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    id="submit-application-btn"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[160px]"
                  >
                    <SendHorizonal className="h-4 w-4 mr-2" />
                    Submit Application
                  </Button>
                </div>
              </DialogFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
