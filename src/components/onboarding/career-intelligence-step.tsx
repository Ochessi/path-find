"use client";

import { useState } from "react";
import {
  Sparkles, Brain, Clock, Target, ChevronDown, ChevronUp,
  Wand2, Edit3, RefreshCw,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface CareerIntelligence {
  years_experience: number | null;
  primary_domain: string | null;
  specializations: string[];
}

export interface CareerData {
  bio: string; // professional summary / about me
  career_intelligence: CareerIntelligence;
  job_titles: string[]; // extracted job titles
  /** AI-rewritten cleaner bio (optional — generated on demand) */
  ai_bio?: string;
}

interface CareerIntelligenceStepProps {
  data: CareerData;
  onChange: (data: CareerData) => void;
  fromAI?: boolean;
}

const ALL_DOMAINS = [
  "Software Engineering", "Data Science", "Data Engineering", "DevOps / Cloud",
  "Product Management", "Design / UX", "Cybersecurity", "Mobile Development",
  "QA / Testing", "Management / Leadership",
];

const ALL_SPECIALIZATIONS = [
  "Frontend", "Backend", "Full Stack", "AI / ML", "Cloud / DevOps",
  "Mobile", "Data", "Security",
];

export function CareerIntelligenceStep({ data, onChange, fromAI = false }: CareerIntelligenceStepProps) {
  const [showDomainPicker, setShowDomainPicker] = useState(false);
  const [showSpecPicker, setShowSpecPicker] = useState(false);
  const [yearsInput, setYearsInput] = useState(
    data.career_intelligence.years_experience?.toString() ?? ""
  );

  const ci = data.career_intelligence;

  const setCI = (patch: Partial<CareerIntelligence>) =>
    onChange({ ...data, career_intelligence: { ...ci, ...patch } });

  const toggleSpec = (spec: string) => {
    const next = ci.specializations.includes(spec)
      ? ci.specializations.filter((s) => s !== spec)
      : [...ci.specializations, spec];
    setCI({ specializations: next });
  };

  const handleYearsBlur = () => {
    const val = parseInt(yearsInput, 10);
    setCI({ years_experience: isNaN(val) ? null : val });
  };

  return (
    <div className="space-y-7">
      {fromAI && (
        <div className="flex items-center gap-2.5 text-sm bg-primary/5 border border-primary/20 text-primary px-4 py-3 rounded-xl">
          <Sparkles className="h-4 w-4 shrink-0" />
          <span>Career intelligence extracted from your resume. Correct anything as needed.</span>
        </div>
      )}

      {/* Professional Summary */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5 text-sm font-medium">
          <Edit3 className="h-3.5 w-3.5 text-muted-foreground" />
          Professional Summary / About Me
        </Label>
        <Textarea
          value={data.bio}
          onChange={(e) => onChange({ ...data, bio: e.target.value })}
          placeholder="Briefly describe your background, key strengths, and career goals…"
          className="min-h-[130px] resize-none"
        />
        <p className="text-xs text-muted-foreground">
          This becomes your public profile summary and is used for job matching.
        </p>
      </div>

      {/* Years of Experience */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5 text-sm font-medium">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          Years of Experience
        </Label>
        <div className="flex items-center gap-3">
          <Input
            type="number"
            min={0}
            max={50}
            value={yearsInput}
            onChange={(e) => setYearsInput(e.target.value)}
            onBlur={handleYearsBlur}
            placeholder="e.g. 5"
            className="w-28 h-10"
          />
          {ci.years_experience != null && (
            <span className="text-sm text-muted-foreground">
              {ci.years_experience === 1 ? "1 year" : `${ci.years_experience} years`} of professional experience
            </span>
          )}
        </div>
      </div>

      {/* Primary Domain */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5 text-sm font-medium">
          <Brain className="h-3.5 w-3.5 text-muted-foreground" />
          Primary Domain
        </Label>
        {ci.primary_domain && !showDomainPicker && (
          <div className="flex items-center gap-2">
            <Badge className="px-3 py-1 bg-primary text-primary-foreground text-sm">
              {ci.primary_domain}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-muted-foreground"
              onClick={() => setShowDomainPicker(true)}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Change
            </Button>
          </div>
        )}
        {(!ci.primary_domain || showDomainPicker) && (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {ALL_DOMAINS.map((d) => (
                <Badge
                  key={d}
                  variant={ci.primary_domain === d ? "default" : "outline"}
                  className={`cursor-pointer px-3 py-1 transition-colors ${
                    ci.primary_domain === d
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                  onClick={() => {
                    setCI({ primary_domain: d });
                    setShowDomainPicker(false);
                  }}
                >
                  {d}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Specializations */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-1.5 text-sm font-medium">
            <Target className="h-3.5 w-3.5 text-muted-foreground" />
            Specializations
          </Label>
          <span className="text-xs text-muted-foreground">Select all that apply</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {ALL_SPECIALIZATIONS.map((spec) => (
            <Badge
              key={spec}
              variant={ci.specializations.includes(spec) ? "default" : "outline"}
              className={`cursor-pointer px-3 py-1 transition-colors ${
                ci.specializations.includes(spec)
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
              onClick={() => toggleSpec(spec)}
            >
              {spec}
            </Badge>
          ))}
        </div>
        {ci.specializations.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {ci.specializations.length} selected: {ci.specializations.join(", ")}
          </p>
        )}
      </div>

      {/* Extracted job titles (read-only reference) */}
      {data.job_titles.length > 0 && (
        <div className="space-y-2 pt-1 border-t">
          <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="h-3 w-3" />
            Job titles detected in your resume
          </p>
          <div className="flex flex-wrap gap-1.5">
            {data.job_titles.map((t) => (
              <Badge key={t} variant="secondary" className="text-xs px-2 py-0.5">
                {t}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
