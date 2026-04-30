"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  RotateCcw,
  Copy,
  Check,
  Pencil,
  Eye,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Job } from "@/types";

interface AiResumeEditorProps {
  job: Job;
  isGenerating: boolean;
  content?: string;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
  onContentChange?: (value: string) => void;
}

function generateDefaultResumeText(job: Job) {
  return `Professional Summary:\nHighly motivated ${job.experienceLevel}-level professional with deep expertise in ${job.skills
    .slice(0, 3)
    .join(", ")}. Proven track record of delivering scalable products in the ${job.industry} space and driving measurable business outcomes.\n\nExperience:\n- Led development of customer-facing applications using ${job.skills[0]} and ${job.skills[1]}, increasing engagement by 40%.\n- Architected reliable microservices with 99.99% uptime and strong observability.\n- Mentored cross-functional teams and implemented delivery standards that improved velocity.\n\nEducation:\nB.S. Computer Science from a top-tier program with a focus on modern software engineering.\n\nSkills:\n${job.skills.join(", ")}`;
}

export function AiResumeEditor({
  job,
  isGenerating,
  content,
  onRegenerate,
  isRegenerating,
  onContentChange,
}: AiResumeEditorProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const defaultText = React.useMemo(() => generateDefaultResumeText(job), [job]);
  const [editedText, setEditedText] = React.useState(content ?? defaultText);

  React.useEffect(() => {
    setEditedText(content ?? defaultText);
  }, [content, defaultText]);

  const handleCopy = () => {
    setCopied(true);
    navigator.clipboard?.writeText(editedText);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isGenerating) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="relative">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white animate-pulse" />
            </div>
            <div className="absolute -inset-1 rounded-xl bg-emerald-500/20 animate-ping" />
          </div>
          <div>
            <p className="font-semibold">Tailoring your resume...</p>
            <p className="text-sm text-muted-foreground">
              Optimizing for {job.title} at {job.company}
            </p>
          </div>
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[90%]" />
        <Skeleton className="h-4 w-[75%]" />
        <div className="pt-4 space-y-4">
          <Skeleton className="h-4 w-[40%]" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-[95%]" />
          <Skeleton className="h-3 w-[85%]" />
          <Skeleton className="h-3 w-[90%]" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500/10 text-emerald-600 border-0 gap-1">
            <Sparkles className="h-3 w-3" />
            AI-Tailored
          </Badge>
          <span className="text-xs text-muted-foreground">Optimized for {job.company}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 rounded-lg gap-1.5 text-xs"
            onClick={() => setIsEditing((prev) => !prev)}
          >
            {isEditing ? (
              <>
                <Eye className="h-3.5 w-3.5" />
                Preview
              </>
            ) : (
              <>
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 rounded-lg gap-1.5 text-xs"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 rounded-lg gap-1.5 text-xs"
            onClick={onRegenerate}
            disabled={!onRegenerate || isRegenerating}
          >
            {isRegenerating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <>
                <RotateCcw className="h-3.5 w-3.5" />
                Regenerate
              </>
            )}
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isRegenerating ? (
          <motion.div
            key="resume-regenerating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4 py-8"
          >
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
              <span className="text-sm text-muted-foreground">Regenerating resume content...</span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="resume-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {isEditing ? (
              <Textarea
                value={editedText}
                onChange={(e) => {
                  setEditedText(e.target.value);
                  onContentChange?.(e.target.value);
                }}
                rows={16}
                className="text-sm leading-relaxed resize-none"
              />
            ) : (
              <div className="space-y-4 bg-card border border-border/50 rounded-3xl p-6">
                {editedText.split("\n\n").map((section, idx) => (
                  <p key={idx} className="text-sm leading-relaxed whitespace-pre-line">
                    {section}
                  </p>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
