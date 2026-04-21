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
} from "lucide-react";

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

interface ReviewSubmitModalProps {
  job: Job;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReviewSubmitModal({
  job,
  open,
  onOpenChange,
}: ReviewSubmitModalProps) {
  const router = useRouter();
  const { addApplication } = useApplicationStore();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const checklist = [
    {
      id: "resume",
      label: "AI-Tailored Resume Selected",
      icon: <FileText className="h-4 w-4" />,
      status: "complete",
    },
    {
      id: "cover-letter",
      label: "Cover Letter Tone Optimized",
      icon: <Mail className="h-4 w-4" />,
      status: "complete",
    },
    {
      id: "form",
      label: "Application Fields Reviewed",
      icon: <ListChecks className="h-4 w-4" />,
      status: "complete",
    },
  ];

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Add to store
    addApplication({
      id: `app-${Date.now()}`,
      jobId: job.id,
      job,
      status: "applied",
      appliedDate: new Date().toISOString().split("T")[0],
      lastActivity: "just now",
      lastActivityDescription: "Application Submitted",
      notes: "",
      aiResume: "Tailored resume generated...",
      aiCoverLetter: "Cover letter generated...",
    });

    setIsSubmitting(false);
    setIsSuccess(true);

    // Redirect after success animation
    setTimeout(() => {
      onOpenChange(false);
      router.push("/applications");
      
      // Reset state after transition
      setTimeout(() => setIsSuccess(false), 500);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !isSubmitting && !isSuccess && onOpenChange(val)}>
      <DialogContent className="sm:max-w-[425px]">
        <AnimatePresence mode="wait">
          {isSuccess ? (
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
          ) : (
            <motion.div
              key="review"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DialogHeader>
                <DialogTitle>Review your application</DialogTitle>
                <DialogDescription>
                  Make sure everything looks good before we send it to {job.company}.
                </DialogDescription>
              </DialogHeader>

              <div className="py-6 space-y-6">
                {/* Summary Box */}
                <div className="p-4 rounded-xl border bg-muted/30 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-lg bg-background border flex items-center justify-center text-lg font-bold">
                      {job.companyLogo || job.company[0]}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm leading-none mb-1.5">{job.title}</h4>
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
                          <div className="text-muted-foreground">
                            {item.icon}
                          </div>
                          <span className="text-sm font-medium">
                            {item.label}
                          </span>
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
                    By submitting, you confirm that you have reviewed all AI-generated content for accuracy.
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[140px]"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <SendHorizonal className="h-4 w-4 mr-2" />
                      Submit Application
                    </>
                  )}
                </Button>
              </DialogFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
