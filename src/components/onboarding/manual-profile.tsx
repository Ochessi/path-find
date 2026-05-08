"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Plus, AlertCircle } from "lucide-react";

export interface ManualProfileData {
  name: string;
  email: string;
  role: string;
  summary: string;
  location: string;
  linkedin: string;
  website: string;
  skills: string[];
}

interface ManualProfileProps {
  data: ManualProfileData;
  onChange: (data: ManualProfileData) => void;
  /** Called by parent to expose whether this step is valid */
  onValidChange?: (valid: boolean) => void;
}

function isValid(d: ManualProfileData) {
  return (
    d.name.trim().length > 0 &&
    d.email.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim()) &&
    d.role.trim().length > 0 &&
    d.skills.length >= 3
  );
}

export function ManualProfile({ data, onChange, onValidChange }: ManualProfileProps) {
  const [skillInput, setSkillInput] = useState("");
  const [touched, setTouched] = useState<Set<string>>(new Set());

  // Notify parent of validity on every data change
  useEffect(() => {
    onValidChange?.(isValid(data));
  }, [data, onValidChange]);

  const touch = (field: string) =>
    setTouched((prev) => new Set(prev).add(field));

  const set = (field: keyof ManualProfileData, value: string) =>
    onChange({ ...data, [field]: value });

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !data.skills.includes(trimmed)) {
      onChange({ ...data, skills: [...data.skills, trimmed] });
    }
    setSkillInput("");
  };

  const removeSkill = (skill: string) =>
    onChange({ ...data, skills: data.skills.filter((s) => s !== skill) });

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    }
  };

  const err = {
    name: touched.has("name") && !data.name.trim(),
    email:
      touched.has("email") &&
      (!data.email.trim() ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())),
    role: touched.has("role") && !data.role.trim(),
    skills: touched.has("skills") && data.skills.length < 3,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 text-blue-600 dark:text-blue-400 bg-blue-500/10 p-4 rounded-lg text-sm">
        <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
        <p>
          Tell us about yourself so we can match you to the best jobs. Fields
          marked <span className="font-semibold">*</span> are required.
        </p>
      </div>

      {/* Row 1: Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="mp-name">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="mp-name"
            placeholder="Jane Doe"
            value={data.name}
            onChange={(e) => set("name", e.target.value)}
            onBlur={() => touch("name")}
            aria-invalid={err.name}
            className={err.name ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {err.name && (
            <p className="text-xs text-destructive">Name is required.</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="mp-email">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="mp-email"
            type="email"
            placeholder="jane@example.com"
            value={data.email}
            onChange={(e) => set("email", e.target.value)}
            onBlur={() => touch("email")}
            aria-invalid={err.email}
            className={err.email ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {err.email && (
            <p className="text-xs text-destructive">A valid email is required.</p>
          )}
        </div>
      </div>

      {/* Role */}
      <div className="space-y-2">
        <Label htmlFor="mp-role">
          Current Role / Headline <span className="text-destructive">*</span>
        </Label>
        <Input
          id="mp-role"
          placeholder="e.g. Senior Frontend Engineer"
          value={data.role}
          onChange={(e) => set("role", e.target.value)}
          onBlur={() => touch("role")}
          aria-invalid={err.role}
          className={err.role ? "border-destructive focus-visible:ring-destructive" : ""}
        />
        {err.role && (
          <p className="text-xs text-destructive">Role is required.</p>
        )}
      </div>

      {/* Skills */}
      <div className="space-y-2">
        <Label htmlFor="mp-skills">
          Skills <span className="text-destructive">*</span>{" "}
          <span className="text-muted-foreground font-normal">(at least 3)</span>
        </Label>
        <div
          className={`min-h-[56px] border rounded-lg p-3 flex flex-wrap gap-2 cursor-text ${
            err.skills ? "border-destructive" : ""
          }`}
          onClick={() => document.getElementById("mp-skills")?.focus()}
        >
          {data.skills.map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="bg-primary/10 text-primary flex items-center gap-1 pr-1"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="hover:text-destructive rounded-full"
                aria-label={`Remove ${skill}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <input
            id="mp-skills"
            className="flex-1 min-w-[120px] bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            placeholder={data.skills.length === 0 ? "Type a skill and press Enter…" : "Add more…"}
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleSkillKeyDown}
            onBlur={() => {
              if (skillInput.trim()) addSkill();
              touch("skills");
            }}
          />
          {skillInput.trim() && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-xs"
              onClick={addSkill}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add
            </Button>
          )}
        </div>
        {err.skills && (
          <p className="text-xs text-destructive">
            Please add at least 3 skills ({data.skills.length}/3 added).
          </p>
        )}
        {!err.skills && data.skills.length > 0 && data.skills.length < 3 && (
          <p className="text-xs text-muted-foreground">
            {3 - data.skills.length} more skill{3 - data.skills.length > 1 ? "s" : ""} needed.
          </p>
        )}
      </div>

      {/* Summary */}
      <div className="space-y-2">
        <Label htmlFor="mp-summary">Professional Summary</Label>
        <Textarea
          id="mp-summary"
          placeholder="Briefly describe your background, key strengths, and what you're looking for…"
          className="min-h-[100px]"
          value={data.summary}
          onChange={(e) => set("summary", e.target.value)}
        />
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="mp-location">Location</Label>
        <Input
          id="mp-location"
          placeholder="e.g. San Francisco, CA or Remote"
          value={data.location}
          onChange={(e) => set("location", e.target.value)}
        />
      </div>

      {/* LinkedIn + Portfolio */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="mp-linkedin">LinkedIn URL</Label>
          <Input
            id="mp-linkedin"
            placeholder="linkedin.com/in/…"
            value={data.linkedin}
            onChange={(e) => set("linkedin", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mp-website">Portfolio / Website</Label>
          <Input
            id="mp-website"
            placeholder="yourwebsite.com"
            value={data.website}
            onChange={(e) => set("website", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
