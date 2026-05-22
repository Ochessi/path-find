"use client";

import { useState } from "react";
import { X, Plus, GraduationCap, Code2, Heart, BookOpen, Sparkles } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export interface EducationEntry {
  institution: string;
  degree: string;
  field_of_study: string;
  start_year: number | null;
  end_year: number | null;
  relevant_coursework: string[];
}

export interface SkillsEducationData {
  hard_skills: string[];
  soft_skills: string[];
  education: EducationEntry[];
}

interface SkillsEducationStepProps {
  data: SkillsEducationData;
  onChange: (data: SkillsEducationData) => void;
  fromAI?: boolean;
}

// ─── Skill tag editor ────────────────────────────────────────────────────────

function SkillTagEditor({
  skills,
  onAdd,
  onRemove,
  placeholder,
  colorClass,
}: {
  skills: string[];
  onAdd: (skill: string) => void;
  onRemove: (skill: string) => void;
  placeholder: string;
  colorClass: string;
}) {
  const [input, setInput] = useState("");

  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !skills.map((s) => s.toLowerCase()).includes(trimmed.toLowerCase())) {
      onAdd(trimmed);
    }
    setInput("");
  };

  return (
    <div
      className="min-h-[60px] border rounded-xl p-3 flex flex-wrap gap-2 cursor-text focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1 transition-all"
      onClick={() => {
        const el = document.activeElement as HTMLElement;
        if (el?.tagName !== "INPUT") {
          (document.querySelector(`[data-placeholder="${placeholder}"]`) as HTMLElement)?.focus();
        }
      }}
    >
      {skills.map((skill) => (
        <Badge
          key={skill}
          variant="secondary"
          className={`flex items-center gap-1 pr-1 ${colorClass}`}
        >
          {skill}
          <button
            type="button"
            onClick={() => onRemove(skill)}
            className="rounded-full hover:text-destructive transition-colors ml-0.5"
            aria-label={`Remove ${skill}`}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <input
        data-placeholder={placeholder}
        className="flex-1 min-w-[120px] bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        placeholder={skills.length === 0 ? placeholder : "Add more…"}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            add();
          }
        }}
        onBlur={() => {
          if (input.trim()) add();
        }}
      />
      {input.trim() && (
        <Button type="button" size="sm" variant="ghost" className="h-6 px-2 text-xs" onClick={add}>
          <Plus className="h-3 w-3 mr-1" />
          Add
        </Button>
      )}
    </div>
  );
}

// ─── Education entry card ─────────────────────────────────────────────────────

function EducationCard({
  entry,
  index,
  onChange,
  onRemove,
}: {
  entry: EducationEntry;
  index: number;
  onChange: (e: EducationEntry) => void;
  onRemove: () => void;
}) {
  const set = (field: keyof EducationEntry, value: any) =>
    onChange({ ...entry, [field]: value });

  return (
    <div className="border rounded-xl p-4 space-y-4 relative group hover:border-primary/40 transition-colors">
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-3 right-3 h-6 w-6 flex items-center justify-center rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all"
        aria-label="Remove education"
      >
        <X className="h-3.5 w-3.5" />
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Institution</Label>
          <Input
            value={entry.institution}
            onChange={(e) => set("institution", e.target.value)}
            placeholder="University / College name"
            className="h-9"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Degree</Label>
          <Input
            value={entry.degree}
            onChange={(e) => set("degree", e.target.value)}
            placeholder="e.g. Bachelor's, MSc, PhD"
            className="h-9"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-1 space-y-1.5">
          <Label className="text-xs text-muted-foreground">Field of Study</Label>
          <Input
            value={entry.field_of_study}
            onChange={(e) => set("field_of_study", e.target.value)}
            placeholder="e.g. Computer Science"
            className="h-9"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Start Year</Label>
          <Input
            type="number"
            value={entry.start_year ?? ""}
            onChange={(e) =>
              set("start_year", e.target.value ? parseInt(e.target.value) : null)
            }
            placeholder="2018"
            className="h-9"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">End Year</Label>
          <Input
            type="number"
            value={entry.end_year ?? ""}
            onChange={(e) =>
              set("end_year", e.target.value ? parseInt(e.target.value) : null)
            }
            placeholder="2022"
            className="h-9"
          />
        </div>
      </div>

      {/* Relevant Coursework */}
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground flex items-center gap-1">
          <BookOpen className="h-3 w-3" />
          Relevant Coursework (optional)
        </Label>
        <SkillTagEditor
          skills={entry.relevant_coursework}
          onAdd={(course) => set("relevant_coursework", [...entry.relevant_coursework, course])}
          onRemove={(course) =>
            set(
              "relevant_coursework",
              entry.relevant_coursework.filter((c) => c !== course)
            )
          }
          placeholder="Add a course and press Enter…"
          colorClass="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
        />
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const BLANK_EDUCATION: EducationEntry = {
  institution: "",
  degree: "",
  field_of_study: "",
  start_year: null,
  end_year: null,
  relevant_coursework: [],
};

export function SkillsEducationStep({ data, onChange, fromAI = false }: SkillsEducationStepProps) {
  const updateEducation = (index: number, entry: EducationEntry) => {
    const next = [...data.education];
    next[index] = entry;
    onChange({ ...data, education: next });
  };

  const removeEducation = (index: number) => {
    onChange({ ...data, education: data.education.filter((_, i) => i !== index) });
  };

  const addEducation = () => {
    onChange({ ...data, education: [...data.education, { ...BLANK_EDUCATION }] });
  };

  return (
    <div className="space-y-8">
      {fromAI && (
        <div className="flex items-center gap-2.5 text-sm bg-primary/5 border border-primary/20 text-primary px-4 py-3 rounded-xl">
          <Sparkles className="h-4 w-4 shrink-0" />
          <span>Skills and education pre-filled from your resume. Add, remove, or edit as needed.</span>
        </div>
      )}

      {/* Hard Skills */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5 text-sm font-medium">
          <Code2 className="h-3.5 w-3.5 text-muted-foreground" />
          Technical / Hard Skills
        </Label>
        <SkillTagEditor
          skills={data.hard_skills}
          onAdd={(s) => onChange({ ...data, hard_skills: [...data.hard_skills, s] })}
          onRemove={(s) =>
            onChange({ ...data, hard_skills: data.hard_skills.filter((x) => x !== s) })
          }
          placeholder="Type a skill and press Enter…"
          colorClass="bg-blue-500/10 text-blue-600 dark:text-blue-400"
        />
        {data.hard_skills.length === 0 && (
          <p className="text-xs text-muted-foreground">
            e.g. Python, React, AWS, PostgreSQL, Docker…
          </p>
        )}
      </div>

      {/* Soft Skills */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5 text-sm font-medium">
          <Heart className="h-3.5 w-3.5 text-muted-foreground" />
          Soft Skills
        </Label>
        <SkillTagEditor
          skills={data.soft_skills}
          onAdd={(s) => onChange({ ...data, soft_skills: [...data.soft_skills, s] })}
          onRemove={(s) =>
            onChange({ ...data, soft_skills: data.soft_skills.filter((x) => x !== s) })
          }
          placeholder="Type a soft skill and press Enter…"
          colorClass="bg-rose-500/10 text-rose-600 dark:text-rose-400"
        />
        {data.soft_skills.length === 0 && (
          <p className="text-xs text-muted-foreground">
            e.g. Leadership, Communication, Problem Solving…
          </p>
        )}
      </div>

      <Separator />

      {/* Education */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-1.5 text-sm font-medium">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            Education
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 px-3 text-xs gap-1"
            onClick={addEducation}
          >
            <Plus className="h-3.5 w-3.5" />
            Add Education
          </Button>
        </div>

        {data.education.length === 0 ? (
          <div
            className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center text-center gap-3 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all"
            onClick={addEducation}
          >
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">No education added yet</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Click to add your educational background
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {data.education.map((entry, idx) => (
              <EducationCard
                key={idx}
                entry={entry}
                index={idx}
                onChange={(e) => updateEducation(idx, e)}
                onRemove={() => removeEducation(idx)}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full h-9 gap-1.5 text-sm border-dashed"
              onClick={addEducation}
            >
              <Plus className="h-3.5 w-3.5" />
              Add another education entry
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
