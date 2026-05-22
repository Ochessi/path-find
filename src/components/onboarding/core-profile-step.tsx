"use client";

import { User, Mail, Phone, MapPin, Link2, Globe, Briefcase, Sparkles } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export interface CoreProfileData {
  full_name: string;
  email: string;
  phone: string;
  headline: string;
  location: string;
  linkedin_url: string;
  portfolio_url: string;
}

interface CoreProfileStepProps {
  data: CoreProfileData;
  onChange: (data: CoreProfileData) => void;
  /** Whether this data came from AI parsing (shows the AI badge) */
  fromAI?: boolean;
}

function Field({
  id,
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  id: string;
  label: string;
  icon: React.ElementType;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="flex items-center gap-1.5 text-sm font-medium">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10"
      />
    </div>
  );
}

export function CoreProfileStep({ data, onChange, fromAI = false }: CoreProfileStepProps) {
  const set = (field: keyof CoreProfileData, value: string) =>
    onChange({ ...data, [field]: value });

  return (
    <div className="space-y-6">
      {/* AI badge */}
      {fromAI && (
        <div className="flex items-center gap-2.5 text-sm bg-primary/5 border border-primary/20 text-primary px-4 py-3 rounded-xl">
          <Sparkles className="h-4 w-4 shrink-0" />
          <span>
            Fields below were pre-filled from your resume. Review and correct anything that looks off.
          </span>
        </div>
      )}

      {/* Name + Email row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          id="cp-name"
          label="Full Name"
          icon={User}
          value={data.full_name}
          onChange={(v) => set("full_name", v)}
          placeholder="Jane Doe"
          required
        />
        <Field
          id="cp-email"
          label="Email Address"
          icon={Mail}
          value={data.email}
          onChange={(v) => set("email", v)}
          placeholder="jane@example.com"
          type="email"
          required
        />
      </div>

      {/* Phone + Location row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          id="cp-phone"
          label="Phone Number"
          icon={Phone}
          value={data.phone}
          onChange={(v) => set("phone", v)}
          placeholder="+1 (555) 000-0000"
        />
        <Field
          id="cp-location"
          label="Location"
          icon={MapPin}
          value={data.location}
          onChange={(v) => set("location", v)}
          placeholder="City, Country"
        />
      </div>

      {/* Headline */}
      <Field
        id="cp-headline"
        label="Professional Headline"
        icon={Briefcase}
        value={data.headline}
        onChange={(v) => set("headline", v)}
        placeholder="e.g. Senior Frontend Engineer"
        required
      />

      {/* LinkedIn + Portfolio row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          id="cp-linkedin"
          label="LinkedIn URL"
          icon={Link2}
          value={data.linkedin_url}
          onChange={(v) => set("linkedin_url", v)}
          placeholder="linkedin.com/in/yourname"
        />
        <Field
          id="cp-portfolio"
          label="GitHub / Portfolio"
          icon={Globe}
          value={data.portfolio_url}
          onChange={(v) => set("portfolio_url", v)}
          placeholder="github.com/yourname"
        />
      </div>
    </div>
  );
}
