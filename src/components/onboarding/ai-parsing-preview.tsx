"use client";

import { Sparkles, Check, AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface AIParsingPreviewProps {
  parsedData?: any;
}

export function AIParsingPreview({ parsedData }: AIParsingPreviewProps) {
  const profileUpdated = parsedData?.profile_updated;

  // No data at all — user skipped the upload step
  const isSkipped = !parsedData;
  // Data is present but profile_updated is empty/missing
  const hasParsedProfile = !!profileUpdated;

  const displayData = hasParsedProfile
    ? {
        name: profileUpdated.name || "",
        email: profileUpdated.email || "",
        role: profileUpdated.headline || profileUpdated.role || "",
        skills: Array.isArray(profileUpdated.skills)
          ? profileUpdated.skills.map((s: any) =>
              typeof s === "string" ? s : s.name
            )
          : [],
      }
    : { name: "", email: "", role: "", skills: [] };

  const skeletonClass = "bg-muted animate-pulse";

  return (
    <div className="space-y-6">
      {isSkipped ? (
        <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400 bg-amber-500/10 p-4 rounded-lg">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="font-medium">
            No resume uploaded. Fields below will be empty — you can fill them
            in manually on the next step.
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-3 text-green-600 dark:text-green-400 bg-green-500/10 p-4 rounded-lg">
          <Check className="h-5 w-5 shrink-0" />
          <p className="font-medium">
            Extraction complete. Please verify the details below.
          </p>
        </div>
      )}

      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input
              value={displayData.name}
              readOnly
              placeholder={isSkipped ? "—" : ""}
              className={!hasParsedProfile && !isSkipped ? skeletonClass : ""}
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              value={displayData.email}
              readOnly
              placeholder={isSkipped ? "—" : ""}
              className={!hasParsedProfile && !isSkipped ? skeletonClass : ""}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Current Role / Headline</Label>
          <Input
            value={displayData.role}
            readOnly
            placeholder={isSkipped ? "—" : ""}
            className={!hasParsedProfile && !isSkipped ? skeletonClass : ""}
          />
        </div>

        <div className="space-y-2">
          <Label>Extracted Skills</Label>
          <div
            className={`min-h-[80px] border rounded-lg p-4 flex flex-wrap gap-2 ${
              !hasParsedProfile && !isSkipped ? skeletonClass : ""
            }`}
          >
            {displayData.skills.length > 0 ? (
              displayData.skills.map((skill: string) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="bg-primary/10 text-primary hover:bg-primary/20"
                >
                  {skill}
                </Badge>
              ))
            ) : isSkipped ? (
              <span className="text-sm text-muted-foreground">
                No skills extracted.
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {!isSkipped && (
        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
          <Sparkles className="h-3 w-3" />
          These fields were filled automatically using AI. Edit them in the
          next step.
        </p>
      )}
    </div>
  );
}
