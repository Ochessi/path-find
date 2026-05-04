"use client";

import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

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

export function PreferencesSetup({ data, onChange }: PreferencesSetupProps) {
  const jobTypes = ["Full-time", "Part-time", "Contract", "Freelance", "Internship"];
  const industries = ["SaaS", "FinTech", "HealthTech", "EdTech", "E-commerce", "AI/ML", "Web3"];

  const toggleType = (type: string) => {
    const newTypes = data.job_types.includes(type) 
      ? data.job_types.filter(t => t !== type) 
      : [...data.job_types, type];
    onChange({ ...data, job_types: newTypes });
  };

  const toggleIndustry = (ind: string) => {
    const newIndustries = data.industries.includes(ind) 
      ? data.industries.filter(i => i !== ind) 
      : [...data.industries, ind];
    onChange({ ...data, industries: newIndustries });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Label>Job Type</Label>
        <div className="flex flex-wrap gap-2">
          {jobTypes.map(type => (
            <Badge 
              key={type}
              variant={data.job_types.includes(type) ? "default" : "outline"}
              className={`cursor-pointer px-3 py-1 ${data.job_types.includes(type) ? 'bg-primary' : 'hover:bg-muted'}`}
              onClick={() => toggleType(type)}
            >
              {type}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label>Preferred Industries</Label>
        <div className="flex flex-wrap gap-2">
          {industries.map(ind => (
            <Badge 
              key={ind}
              variant={data.industries.includes(ind) ? "default" : "outline"}
              className={`cursor-pointer px-3 py-1 ${data.industries.includes(ind) ? 'bg-primary' : 'hover:bg-muted'}`}
              onClick={() => toggleIndustry(ind)}
            >
              {ind}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Label>Minimum Base Salary</Label>
          <span className="font-semibold">${Math.floor(data.salary_min / 1000)}k+ / yr</span>
        </div>
        <Slider 
          value={[Math.floor(data.salary_min / 1000)]} 
          onValueChange={(val) => onChange({ ...data, salary_min: (val as number[])[0] * 1000 })} 
          max={300} 
          min={50} 
          step={10} 
          className="py-4"
        />
      </div>

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
