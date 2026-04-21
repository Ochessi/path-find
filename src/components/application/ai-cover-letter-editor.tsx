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
}

type Tone = "professional" | "friendly" | "confident";

const toneConfig: Record<Tone, { label: string; icon: React.ReactNode; description: string }> = {
  professional: {
    label: "Professional",
    icon: <Briefcase className="h-3.5 w-3.5" />,
    description: "Formal and polished",
  },
  friendly: {
    label: "Friendly",
    icon: <Smile className="h-3.5 w-3.5" />,
    description: "Warm and approachable",
  },
  confident: {
    label: "Confident",
    icon: <Zap className="h-3.5 w-3.5" />,
    description: "Bold and assertive",
  },
};

function generateCoverLetter(job: Job, tone: Tone): string[] {
  const greetings: Record<Tone, string> = {
    professional: `Dear Hiring Manager at ${job.company},`,
    friendly: `Hello ${job.company} team!`,
    confident: `Dear ${job.company} Hiring Team,`,
  };

  const intros: Record<Tone, string> = {
    professional: `I am writing to express my strong interest in the ${job.title} position at ${job.company}. With extensive experience in ${job.skills.slice(0, 3).join(", ")}, I am confident that my background aligns well with your team's needs and the requirements outlined for this role.`,
    friendly: `I'm thrilled to apply for the ${job.title} role at ${job.company}! As someone who's passionate about ${job.skills.slice(0, 2).join(" and ")}, I couldn't be more excited about the opportunity to contribute to your ${job.industry.toLowerCase()} team.`,
    confident: `I'm applying for the ${job.title} position at ${job.company} because I know I can make an immediate impact. My deep expertise in ${job.skills.slice(0, 3).join(", ")} positions me uniquely to tackle the challenges your team faces.`,
  };

  const bodies: Record<Tone, string> = {
    professional: `In my current role, I have successfully delivered complex projects that directly align with the requirements you've described. My experience spans ${job.skills.join(", ")}, and I have consistently demonstrated the ability to architect scalable solutions, collaborate effectively with cross-functional teams, and drive measurable business outcomes. I am particularly drawn to ${job.company}'s mission and would welcome the opportunity to contribute to your continued innovation in the ${job.industry.toLowerCase()} space.`,
    friendly: `What excites me most about this role is the chance to work with ${job.skills.slice(0, 2).join(" and ")} in a ${job.industry.toLowerCase()} context. In my career, I've had the joy of building products that real people use and love, and I'd bring that same energy and craftsmanship to everything I do at ${job.company}. I'm a firm believer that great software comes from great collaboration, and I'd love to be part of your team.`,
    confident: `My track record speaks for itself: I've architected and shipped production systems using ${job.skills.slice(0, 3).join(", ")}, led high-performing teams, and consistently exceeded expectations. At ${job.company}, I see an opportunity to apply these strengths at scale. The ${job.title} role demands someone who can hit the ground running — that's exactly what I do. I bring not just technical depth, but the strategic thinking to align engineering decisions with business goals.`,
  };

  const closings: Record<Tone, string> = {
    professional: `I would be grateful for the opportunity to discuss how my experience and skills can contribute to ${job.company}'s success. I am available for an interview at your earliest convenience and look forward to the possibility of joining your team.`,
    friendly: `I'd love to chat more about how I can contribute to the amazing work happening at ${job.company}. I'm flexible with timing and excited about the possibility of joining your team. Thanks so much for considering my application!`,
    confident: `I'm ready to bring my expertise to ${job.company} and deliver results from day one. Let's connect to discuss how I can drive your team's next major initiative forward. I look forward to speaking with you soon.`,
  };

  return [greetings[tone], intros[tone], bodies[tone], closings[tone], "Best regards,\nAlex Johnson"];
}

export function AiCoverLetterEditor({ job, isGenerating }: AiCoverLetterEditorProps) {
  const [tone, setTone] = React.useState<Tone>("professional");
  const [isEditing, setIsEditing] = React.useState(false);
  const [isRegenerating, setIsRegenerating] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [editingParagraph, setEditingParagraph] = React.useState<number | null>(null);

  const paragraphs = React.useMemo(() => generateCoverLetter(job, tone), [job, tone]);
  const [editedParagraphs, setEditedParagraphs] = React.useState(paragraphs);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEditedParagraphs(paragraphs);
  }, [paragraphs]);

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsRegenerating(false);
    setEditedParagraphs(paragraphs);
  };

  const handleCopy = () => {
    setCopied(true);
    navigator.clipboard?.writeText(editedParagraphs.join("\n\n"));
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToneChange = (newTone: Tone) => {
    setTone(newTone);
    setEditingParagraph(null);
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
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge className="bg-violet-500/10 text-violet-600 dark:text-violet-400 border-0 gap-1">
            <Sparkles className="h-3 w-3" />
            AI-Generated
          </Badge>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 rounded-lg gap-1.5 text-xs"
            onClick={() => {
              setIsEditing(!isEditing);
              setEditingParagraph(null);
            }}
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
            onClick={handleRegenerate}
            disabled={isRegenerating}
          >
            {isRegenerating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RotateCcw className="h-3.5 w-3.5" />
            )}
            Regenerate
          </Button>
        </div>
      </div>

      {/* Tone selector */}
      <div className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Tone
        </span>
        <div className="flex gap-2">
          {(Object.entries(toneConfig) as [Tone, typeof toneConfig[Tone]][]).map(
            ([key, config]) => (
              <button
                key={key}
                onClick={() => handleToneChange(key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all ${
                  tone === key
                    ? "border-violet-500 bg-violet-500/10 text-violet-600 dark:text-violet-400"
                    : "border-border hover:border-violet-500/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                {config.icon}
                <span className="hidden sm:inline">{config.label}</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Cover letter content */}
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
              Regenerating with {toneConfig[tone].label.toLowerCase()} tone...
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
            {editedParagraphs.map((para, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="group relative"
              >
                {isEditing && editingParagraph === idx ? (
                  <Textarea
                    value={para}
                    onChange={(e) => {
                      const updated = [...editedParagraphs];
                      updated[idx] = e.target.value;
                      setEditedParagraphs(updated);
                    }}
                    onBlur={() => setEditingParagraph(null)}
                    rows={4}
                    className="text-sm leading-relaxed resize-none"
                    autoFocus
                  />
                ) : (
                  <p
                    className={`text-sm leading-relaxed whitespace-pre-line ${
                      isEditing
                        ? "cursor-pointer hover:bg-muted/50 rounded-lg p-2 -m-2 transition-colors"
                        : ""
                    } ${idx === 0 ? "font-medium" : ""}`}
                    onClick={() => isEditing && setEditingParagraph(idx)}
                  >
                    {para}
                  </p>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
