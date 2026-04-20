"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ProfileCompletion() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Professional Summary</Label>
        <Textarea 
          placeholder="Briefly describe your background, key strengths, and what you're looking for..."
          className="min-h-[120px]"
          defaultValue="Passionate Frontend Engineer with 5+ years of experience building scalable web applications. Strong focus on UX, performance, and modern web standards."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>LinkedIn URL</Label>
          <Input placeholder="linkedin.com/in/..." defaultValue="linkedin.com/in/alexjohnson" />
        </div>
        <div className="space-y-2">
          <Label>Portfolio / Website</Label>
          <Input placeholder="yourwebsite.com" defaultValue="alexjohnson.dev" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Location</Label>
        <Input placeholder="e.g. San Francisco, CA or Remote" defaultValue="San Francisco, CA" />
      </div>
    </div>
  );
}
