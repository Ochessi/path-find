"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ProfileData {
  summary: string;
  linkedin: string;
  website: string;
  location: string;
}

interface ProfileCompletionProps {
  data: ProfileData;
  onChange: (data: ProfileData) => void;
}

export function ProfileCompletion({ data, onChange }: ProfileCompletionProps) {
  const handleChange = (field: keyof ProfileData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Professional Summary</Label>
        <Textarea 
          placeholder="Briefly describe your background, key strengths, and what you're looking for..."
          className="min-h-[120px]"
          value={data.summary}
          onChange={(e) => handleChange("summary", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>LinkedIn URL</Label>
          <Input 
            placeholder="linkedin.com/in/..." 
            value={data.linkedin}
            onChange={(e) => handleChange("linkedin", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Portfolio / Website</Label>
          <Input 
            placeholder="yourwebsite.com" 
            value={data.website}
            onChange={(e) => handleChange("website", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Location</Label>
        <Input 
          placeholder="e.g. San Francisco, CA or Remote" 
          value={data.location}
          onChange={(e) => handleChange("location", e.target.value)}
        />
      </div>
    </div>
  );
}

