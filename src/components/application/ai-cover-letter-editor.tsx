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
  Smile,
  Briefcase,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Job } from "@/types";

interface AiCoverLetterEditorProps {
  job: Job;
  isGenerating: boolean;
  content?: string;
  tone: "professional" | "enthusiastic" | "conversational";
  onToneChange: (tone: "professional" | "enthusiastic" | "conversational") => void;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
  onContentChange?: (value: string) => void;
}

type Tone = "professional" | "enthusiastic" | "conversational";

const toneConfig: Record<Tone, { label: string; icon: React.ReactNode }> = {
  professional: {
    label: "Professional",
    icon: <Briefcase className="h-3.5 w-3.5" />,
  },
  enthusiastic: {
    label: "Friendly",
    icon: <Smile className="h-3.5 w-3.5" />,
  },
  conversational: {
    label: "Confident",
    icon: <Zap className="h-3.5 w-3.5" />,
  },
};

function getDefaultCoverLetter(job: Job, tone: Tone) {
  const bodyMap: Record<Tone, string> = {
    professional: `I am writing to express my strong interest in the ${job.title} position at ${job.company}. With extensive experience in ${job.skills.slice(0, 3).join(", ")}, I am confident my background aligns well with your needs. In my current role, I architect scalable solutions, collaborate with cross-functional teams, and deliver measurable results that drive business growth.`,
    enthusiastic: `I'm thrilled to apply for the ${job.title} role at ${job.company}! My experience with ${job.skills.slice(0, 2).join(" and ")} has taught me how to build products that delight users and support fast-moving teams. I enjoy working in collaborative environments and am excited about the opportunity to help your ${job.industry.toLowerCase()} team grow.`,
    conversational: `I’m applying for the ${job.title} role because I know I can make an immediate impact. My background includes building production-ready systems using ${job.skills.slice(0, 3).join(", ")}, leading teams, and solving hard problems with strong attention to business outcomes. I’m ready to bring that same energy to ${job.company}.`,
  };

  const greeting = tone === "professional"
    ? `Dear Hiring Manager at ${job.company},`
    : tone === "enthusiastic"
    ? `Hello ${job.company} team!`
    : `Dear ${job.company} Hiring Team,`;

  const closing = tone === "professional"
    ? `I would appreciate the opportunity to discuss how my experience can contribute to ${job.company}. Thank you for considering my application.`
    : tone === "enthusiastic"
    ? `I would love the chance to chat about how I can support ${job.company}'s next big milestone. Thank you for your consideration!`
    : `I’m excited about the opportunity and would welcome the chance to discuss how I can contribute to ${job.company}. Thank you for your time.`;

  return `${greeting}\n\n${bodyMap[tone]}\n\n${closing}\n\nBest regards,\nAlex Johnson`;
}

export function AiCoverLetterEditor({
  job,
  isGenerating,
  content,
  tone,
  onToneChange,
  onRegenerate,
  isRegenerating,
  onContentChange,
}: AiCoverLetterEditorProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [editedContent, setEditedContent] = React.useState(content ?? getDefaultCoverLetter(job, tone));

  React.useEffect(() => {
    setEditedContent(content ?? getDefaultCoverLetter(job, tone));
  }, [content, job, tone]);

  const handleCopy = () => {
    setCopied(true);
    navigator.clipboard?.writeText(editedContent);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isGenerating) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="relative">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white animate-pulse" />
            </div>
            <div className="absolute -inset-1 rounded-xl bg-violet-500/20 animate-ping" />
          </div>
          <div>
            <p className="font-semibold">Crafting your cover letter...</p>
            <p className="text-sm text-muted-foreground">
              Personalizing for {job.title} at {job.company}
            </p>
          </div>
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            {i < 3 && <Skeleton className="h-4 w-[75%]" />}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge className="bg-violet-500/10 text-violet-600 border-0 gap-1">
            <Sparkles className="h-3 w-3" />
            AI-Generated
          </Badge>
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

      <div className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Tone
        </span>
        <div className="flex gap-2">
          {Object.entries(toneConfig).map(([key, config]) => (
            <button
              key={key}
              onClick={() => onToneChange(key as Tone)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all ${
                key === tone
                  ? "border-violet-500 bg-violet-500/10 text-violet-600"
                  : "border-border hover:border-violet-500/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              {config.icon}
              <span className="hidden sm:inline">{config.label}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isRegenerating ? (
          <motion.div
            key="regenerating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-3 py-12"
          >
            <Loader2 className="h-5 w-5 animate-spin text-violet-500" />
            <span className="text-sm text-muted-foreground">
              Regenerating cover letter...
            </span>
          </motion.div>
        ) : (
          <motion.div
            key={`content-${tone}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4 bg-card border rounded-2xl p-6"
          >
            {isEditing ? (
              <Textarea
                value={editedContent}
                onChange={(e) => {
                  setEditedContent(e.target.value);
                  onContentChange?.(e.target.value);
                }}
                rows={18}
                className="text-sm leading-relaxed resize-none"
              />
            ) : (
              <p className="text-sm leading-relaxed whitespace-pre-line">{editedContent}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
