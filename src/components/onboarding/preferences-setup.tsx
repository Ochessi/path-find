"use client";

import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { AlertCircle } from "lucide-react";

export interface PreferencesData {
  job_types: string[];
  industries: string[];
  salary_min: number;
  remote: boolean;
}

interface PreferencesSetupProps {
  data: PreferencesData;
  onChange: (data: PreferencesData) => void;
}

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Freelance", "Internship"];
const INDUSTRIES = ["SaaS", "FinTech", "HealthTech", "EdTech", "E-commerce", "AI/ML", "Web3", "Cybersecurity", "Gaming", "Media"];

export function PreferencesSetup({ data, onChange }: PreferencesSetupProps) {
  const toggleType = (type: string) => {
    const newTypes = data.job_types.includes(type)
      ? data.job_types.filter((t) => t !== type)
      : [...data.job_types, type];
    onChange({ ...data, job_types: newTypes });
  };

  const toggleIndustry = (ind: string) => {
    const newIndustries = data.industries.includes(ind)
      ? data.industries.filter((i) => i !== ind)
      : [...data.industries, ind];
    onChange({ ...data, industries: newIndustries });
  };

  const hasNoSelections =
    data.job_types.length === 0 &&
    data.industries.length === 0 &&
    data.salary_min === 0 &&
    !data.remote;

  // Salary slider operates in units of $1k. 0 means "no preference set yet".
  const salaryK = Math.floor(data.salary_min / 1000);

  return (
    <div className="space-y-8">
      {hasNoSelections && (
        <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400 bg-amber-500/10 p-4 rounded-lg text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p>Please set your preferences below. These help us match you to the right jobs.</p>
        </div>
      )}

      {/* Job Type */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Job Type</Label>
          {data.job_types.length === 0 && (
            <span className="text-xs text-muted-foreground">Select at least one</span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {JOB_TYPES.map((type) => (
            <Badge
              key={type}
              variant={data.job_types.includes(type) ? "default" : "outline"}
              className={`cursor-pointer px-3 py-1 transition-colors ${
                data.job_types.includes(type)
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
              onClick={() => toggleType(type)}
            >
              {type}
            </Badge>
          ))}
        </div>
      </div>

      {/* Industries */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Preferred Industries</Label>
          {data.industries.length === 0 && (
            <span className="text-xs text-muted-foreground">Select at least one</span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {INDUSTRIES.map((ind) => (
            <Badge
              key={ind}
              variant={data.industries.includes(ind) ? "default" : "outline"}
              className={`cursor-pointer px-3 py-1 transition-colors ${
                data.industries.includes(ind)
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
              onClick={() => toggleIndustry(ind)}
            >
              {ind}
            </Badge>
          ))}
        </div>
      </div>

      {/* Salary */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Minimum Base Salary</Label>
          <span className="font-semibold text-sm">
            {salaryK === 0 ? (
              <span className="text-muted-foreground">No preference</span>
            ) : (
              `$${salaryK}k+ / yr`
            )}
          </span>
        </div>
        <Slider
          value={[salaryK]}
          onValueChange={(val) =>
            onChange({ ...data, salary_min: (val as number[])[0] * 1000 })
          }
          max={300}
          min={0}
          step={10}
          className="py-4"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>No preference</span>
          <span>$300k+</span>
        </div>
      </div>

      {/* Remote */}
      <div className="flex items-center justify-between border rounded-lg p-4">
        <div className="space-y-0.5">
          <Label>Open to Remote</Label>
          <p className="text-sm text-muted-foreground">
            Include fully remote positions in my matches
          </p>
        </div>
        <Switch
          checked={data.remote}
          onCheckedChange={(checked) => onChange({ ...data, remote: checked })}
        />
      </div>
    </div>
  );
}
