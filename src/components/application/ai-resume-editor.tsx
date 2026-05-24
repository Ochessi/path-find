"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RotateCcw, Copy, Check, Pencil, Eye, Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Job } from "@/types";
import { useAuthStore } from "@/store/auth.store";
import { type AiContent } from "@/lib/api/applications";

interface AiResumeEditorProps {
  job: Job;
  isGenerating: boolean;
  aiContent: AiContent | null;
  onRegenerate: () => void;
  onSave: (bullets: string) => Promise<void>;
}

export function AiResumeEditor({ job, isGenerating, aiContent, onRegenerate, onSave }: AiResumeEditorProps) {
  const user = useAuthStore((s) => s.user);
  const [isEditing, setIsEditing] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  // The editable text — seeded from aiContent or fallback from profile
  const fallbackBullets = React.useMemo(() => {
    if (user?.experience && user.experience.length > 0) {
      return user.experience
        .map((exp) =>
          `${exp.title} at ${exp.company}:\n${exp.description || "(No description provided)"}`
        )
        .join("\n\n");
    }
    return `No experience data found. Please complete your profile to generate tailored bullets for ${job.title} at ${job.company}.`;
  }, [user, job]);

  const [editedBullets, setEditedBullets] = React.useState(fallbackBullets);

  // Sync editable text when AI content arrives
  React.useEffect(() => {
    if (aiContent?.tailored_bullets) {
      setEditedBullets(aiContent.tailored_bullets);
    }
  }, [aiContent?.tailored_bullets]);

  const handleCopy = () => {
    navigator.clipboard?.writeText(editedBullets);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(editedBullets);
    setIsSaving(false);
    setSaved(true);
    setIsEditing(false);
    setTimeout(() => setSaved(false), 2500);
  };

  // ── Loading skeleton ───────────────────────────────────────────────────────
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
            <p className="text-sm text-muted-foreground">Optimizing for {job.title} at {job.company}</p>
          </div>
        </div>
        {[1, 0.9, 0.75, 0.4, 1, 0.95, 0.85, 0.9, 0.35, 1, 0.8, 0.7].map((w, i) => (
          <Skeleton key={i} className="h-3.5" style={{ width: `${w * 100}%` }} />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-0 gap-1">
            <Sparkles className="h-3 w-3" />
            AI-Tailored
          </Badge>
          <span className="text-xs text-muted-foreground">Optimized for {job.company}</span>
          {saved && <span className="text-xs text-emerald-600 flex items-center gap-1"><Check className="h-3 w-3" /> Saved</span>}
        </div>
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="sm" className="h-8 rounded-lg gap-1.5 text-xs" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? <><Eye className="h-3.5 w-3.5" />Preview</> : <><Pencil className="h-3.5 w-3.5" />Edit</>}
          </Button>
          <Button variant="ghost" size="sm" className="h-8 rounded-lg gap-1.5 text-xs" onClick={handleCopy}>
            {copied ? <><Check className="h-3.5 w-3.5 text-emerald-500" />Copied</> : <><Copy className="h-3.5 w-3.5" />Copy</>}
          </Button>
          {isEditing && (
            <Button variant="ghost" size="sm" className="h-8 rounded-lg gap-1.5 text-xs" onClick={handleSave} disabled={isSaving}>
              {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              Save
            </Button>
          )}
          <Button variant="ghost" size="sm" className="h-8 rounded-lg gap-1.5 text-xs" onClick={onRegenerate}>
            <RotateCcw className="h-3.5 w-3.5" />
            Regenerate
          </Button>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
          {/* Summary from profile */}
          {(user?.summary || user?.profile?.bio) && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Professional Summary</h3>
              <div className="relative">
                <div className="absolute -left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 to-transparent rounded-full" />
                <p className="text-sm leading-relaxed pl-1">{user?.summary || user?.profile?.bio}</p>
              </div>
            </div>
          )}

          {/* AI Tailored bullets */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Tailored Experience</h3>
              <Badge variant="secondary" className="text-[10px] h-5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-0">AI enhanced</Badge>
            </div>
            <div className="relative">
              <div className="absolute -left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 to-transparent rounded-full" />
              {isEditing ? (
                <Textarea
                  value={editedBullets}
                  onChange={(e) => setEditedBullets(e.target.value)}
                  rows={16}
                  className="text-sm leading-relaxed resize-none font-mono text-xs"
                />
              ) : (
                <div className="pl-1 space-y-1">
                  {editedBullets.split("\n").map((line, i) => (
                    <p key={i} className={`text-sm leading-relaxed ${line.startsWith("•") || line.startsWith("-") ? "pl-3" : line.trim() === "" ? "h-2" : "font-medium"}`}>
                      {line}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Education */}
          {user?.education && user.education.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Education</h3>
              {user.education.map((edu, i) => (
                <div key={i} className="pl-1">
                  <h4 className="font-medium text-sm">{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</h4>
                  <p className="text-xs text-muted-foreground">{edu.institution}</p>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {user?.skills && user.skills.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Skills</h3>
              <div className="flex flex-wrap gap-1.5">
                {(user.skills as Array<string | { name: string }>).map((s, i) => {
                  const name = typeof s === "string" ? s : s.name;
                  return <Badge key={i} variant="secondary" className="rounded-lg text-xs">{name}</Badge>;
                })}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
