"use client";

import { useState, useEffect } from "react";
import { Sparkles, Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface AIParsingPreviewProps {
  parsedData?: any;
}

export function AIParsingPreview({ parsedData }: AIParsingPreviewProps) {
  // If parsedData exists, we display it directly
  const data = parsedData?.profile_updated || {
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "Senior Frontend Engineer",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Node.js"],
  };

  const isParsing = !parsedData;

  const displayData = {
    name: data.name || "",
    email: data.email || "",
    role: data.headline || data.role || "",
    skills: Array.isArray(data.skills) 
      ? data.skills.map((s: any) => typeof s === 'string' ? s : s.name)
      : [],
  };


  return (
    <div className="space-y-6">
      {isParsing ? (
        <div className="flex items-center gap-3 text-primary bg-primary/5 p-4 rounded-lg">
          <Sparkles className="h-5 w-5 animate-pulse" />
          <p className="font-medium">AI is extracting your details...</p>
        </div>
      ) : (
        <div className="flex items-center gap-3 text-green-600 dark:text-green-400 bg-green-500/10 p-4 rounded-lg">
          <Check className="h-5 w-5" />
          <p className="font-medium">Extraction complete. Please verify the details.</p>
        </div>
      )}

      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 relative">
            <Label>Full Name</Label>
            <Input value={displayData.name} readOnly={isParsing} className={isParsing && !displayData.name ? "bg-muted animate-pulse" : ""} />
          </div>
          <div className="space-y-2 relative">
            <Label>Email</Label>
            <Input value={displayData.email} readOnly={isParsing} className={isParsing && !displayData.email ? "bg-muted animate-pulse" : ""} />
          </div>
        </div>

        <div className="space-y-2 relative">
          <Label>Current Role</Label>
          <Input value={displayData.role} readOnly={isParsing} className={isParsing && !displayData.role ? "bg-muted animate-pulse" : ""} />
        </div>

        <div className="space-y-2">
          <Label>Extracted Skills</Label>
          <div className={`min-h-[100px] border rounded-lg p-4 flex flex-wrap gap-2 ${isParsing && displayData.skills.length === 0 ? "bg-muted animate-pulse" : ""}`}>
            {displayData.skills.map((skill: string) => (
              <Badge key={skill} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
        <Sparkles className="h-3 w-3" />
        These fields were filled automatically using AI.
      </p>
    </div>
  );
}
