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

interface AiCoverLetterEditorProps {
  job: Job;
  isGenerating: boolean;
  aiContent: AiContent | null;
  onRegenerate: () => void;
  onSave: (letter: string) => Promise<void>;
}

export function AiCoverLetterEditor({ job, isGenerating, aiContent, onRegenerate, onSave }: AiCoverLetterEditorProps) {
  const user = useAuthStore((s) => s.user);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editingParagraph, setEditingParagraph] = React.useState<number | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const fallback = `Dear Hiring Manager at ${job.company},\n\nI am excited to apply for the ${job.title} position. My background aligns well with your requirements, and I look forward to contributing to your team.\n\nBest regards,\n${user?.full_name || "Applicant"}`;

  const [editedLetter, setEditedLetter] = React.useState(fallback);

  // Sync when AI content arrives
  React.useEffect(() => {
    if (aiContent?.cover_letter) {
      setEditedLetter(aiContent.cover_letter);
    }
  }, [aiContent?.cover_letter]);

  // Split into paragraphs for the paragraph-click-to-edit UI
  const paragraphs = editedLetter.split(/\n\n+/).filter(Boolean);

  const updateParagraph = (idx: number, value: string) => {
    const updated = [...paragraphs];
    updated[idx] = value;
    setEditedLetter(updated.join("\n\n"));
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(editedLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(editedLetter);
    setIsSaving(false);
    setSaved(true);
    setIsEditing(false);
    setEditingParagraph(null);
    setTimeout(() => setSaved(false), 2500);
  };

  // ── Loading skeleton ───────────────────────────────────────────────────────
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
            <p className="text-sm text-muted-foreground">Personalizing for {job.title} at {job.company}</p>
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Badge className="bg-violet-500/10 text-violet-600 dark:text-violet-400 border-0 gap-1">
            <Sparkles className="h-3 w-3" />
            AI-Generated
          </Badge>
          {saved && <span className="text-xs text-emerald-600 flex items-center gap-1"><Check className="h-3 w-3" /> Saved</span>}
        </div>
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="sm" className="h-8 rounded-lg gap-1.5 text-xs" onClick={() => { setIsEditing(!isEditing); setEditingParagraph(null); }}>
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
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-4 bg-card border rounded-2xl p-6"
        >
          {isEditing ? (
            // Full textarea when editing
            <Textarea
              value={editedLetter}
              onChange={(e) => setEditedLetter(e.target.value)}
              rows={16}
              className="text-sm leading-relaxed resize-none"
            />
          ) : (
            // Paragraph-click-to-edit view
            paragraphs.map((para, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="group relative"
              >
                {editingParagraph === idx ? (
                  <Textarea
                    value={para}
                    onChange={(e) => updateParagraph(idx, e.target.value)}
                    onBlur={() => setEditingParagraph(null)}
                    rows={4}
                    className="text-sm leading-relaxed resize-none"
                    autoFocus
                  />
                ) : (
                  <p
                    className={`text-sm leading-relaxed whitespace-pre-line hover:bg-muted/50 rounded-lg p-2 -m-2 cursor-pointer transition-colors ${idx === 0 ? "font-medium" : ""}`}
                    onClick={() => setEditingParagraph(idx)}
                    title="Click to edit this paragraph"
                  >
                    {para}
                  </p>
                )}
              </motion.div>
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
