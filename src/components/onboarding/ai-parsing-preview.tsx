"use client";

import { useState, useEffect } from "react";
import { Sparkles, Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function AIParsingPreview() {
  const [isParsing, setIsParsing] = useState(true);
  const [parsedData, setParsedData] = useState({
    name: "",
    email: "",
    role: "",
    skills: [] as string[],
  });

  useEffect(() => {
    // Simulate AI parsing typing effect
    const data = {
      name: "Alex Johnson",
      email: "alex@example.com",
      role: "Senior Frontend Engineer",
      skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Node.js"],
    };

    let i = 0;
    const interval = setInterval(() => {
      if (i === 0) setParsedData((d) => ({ ...d, name: data.name }));
      if (i === 1) setParsedData((d) => ({ ...d, email: data.email }));
      if (i === 2) setParsedData((d) => ({ ...d, role: data.role }));
      if (i === 3) setParsedData((d) => ({ ...d, skills: data.skills.slice(0, 2) }));
      if (i === 4) {
        setParsedData((d) => ({ ...d, skills: data.skills }));
        setIsParsing(false);
        clearInterval(interval);
      }
      i++;
    }, 600);

    return () => clearInterval(interval);
  }, []);

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
            <Input value={parsedData.name} readOnly={isParsing} className={isParsing && !parsedData.name ? "bg-muted animate-pulse" : ""} />
          </div>
          <div className="space-y-2 relative">
            <Label>Email</Label>
            <Input value={parsedData.email} readOnly={isParsing} className={isParsing && !parsedData.email ? "bg-muted animate-pulse" : ""} />
          </div>
        </div>

        <div className="space-y-2 relative">
          <Label>Current Role</Label>
          <Input value={parsedData.role} readOnly={isParsing} className={isParsing && !parsedData.role ? "bg-muted animate-pulse" : ""} />
        </div>

        <div className="space-y-2">
          <Label>Extracted Skills</Label>
          <div className={`min-h-[100px] border rounded-lg p-4 flex flex-wrap gap-2 ${isParsing && parsedData.skills.length === 0 ? "bg-muted animate-pulse" : ""}`}>
            {parsedData.skills.map(skill => (
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
