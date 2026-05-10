"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Link,
  FileText,
  Sparkles,
  Pencil,
  Check,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Job } from "@/types";
import { useAuthStore } from "@/store/auth.store";

interface FormAutofillPreviewProps {
  job: Job;
}

interface FieldData {
  id: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  source: "profile" | "ai";
}

export function FormAutofillPreview({ job }: FormAutofillPreviewProps) {
  const user = useAuthStore((state) => state.user);

  const initialFields: FieldData[] = [
    {
      id: "name",
      label: "Full Name",
      value: user?.full_name || "Full Name",
      icon: <User className="h-4 w-4" />,
      source: "profile",
    },
    {
      id: "email",
      label: "Email Address",
      value: user?.email || "Email",
      icon: <Mail className="h-4 w-4" />,
      source: "profile",
    },
    {
      id: "phone",
      label: "Phone Number",
      value: user?.profile?.phone || "+1 (555) 000-0000",
      icon: <Phone className="h-4 w-4" />,
      source: "profile",
    },
    {
      id: "location",
      label: "Location",
      value: job.location === "Remote" ? `${user?.profile?.location || "San Francisco, CA"} (Open to remote)` : job.location,
      icon: <MapPin className="h-4 w-4" />,
      source: job.location === "Remote" ? "ai" : "profile",
    },
    {
      id: "website",
      label: "Portfolio / Website",
      value: user?.profile?.portfolio_url || "https://example.com",
      icon: <Globe className="h-4 w-4" />,
      source: "profile",
    },
    {
      id: "linkedin",
      label: "LinkedIn Profile",
      value: user?.profile?.linkedin_url || "https://linkedin.com/in/",
      icon: <Link className="h-4 w-4" />,
      source: "profile",
    },
    {
      id: "experience",
      label: "Years of Experience",
      value: job.experienceLevel === "Senior" ? "7+" : job.experienceLevel === "Mid" ? "4+" : "2+",
      icon: <FileText className="h-4 w-4" />,
      source: "ai",
    },
    {
      id: "why",
      label: `Why do you want to work at ${job.company}?`,
      value: `I'm drawn to ${job.company}'s mission of innovation in the ${job.industry.toLowerCase()} space. The ${job.title} role aligns perfectly with my expertise in ${job.skills.slice(0, 2).join(" and ")}, and I'm excited about the opportunity to contribute to a team that values both technical excellence and user impact.`,
      icon: <Sparkles className="h-4 w-4" />,
      source: "ai",
    },
    {
      id: "salary",
      label: "Salary Expectations",
      value: job.salary,
      icon: <FileText className="h-4 w-4" />,
      source: "ai",
    },
    {
      id: "start",
      label: "Earliest Start Date",
      value: "2 weeks notice",
      icon: <FileText className="h-4 w-4" />,
      source: "profile",
    },
  ];

  const [fields, setFields] = React.useState(initialFields);
  const [editingField, setEditingField] = React.useState<string | null>(null);

  const handleFieldChange = (id: string, value: string) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, value } : f))
    );
  };

  const profileFields = fields.filter((f) => f.source === "profile");
  const aiFields = fields.filter((f) => f.source === "ai");

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-1">
        <h3 className="font-semibold">Application Form Preview</h3>
        <p className="text-sm text-muted-foreground">
          These fields will be auto-filled from your profile and AI analysis.
          Click any field to edit.
        </p>
      </div>

      {/* Profile-sourced fields */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            From Your Profile
          </span>
          <Badge variant="secondary" className="text-[10px] h-5 rounded-md">
            Auto-filled
          </Badge>
        </div>
        <div className="grid gap-3">
          {profileFields.map((field, idx) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="group"
            >
              <Label
                htmlFor={field.id}
                className="text-xs text-muted-foreground mb-1.5 flex items-center gap-2"
              >
                {field.icon}
                {field.label}
              </Label>
              <div className="relative">
                {editingField === field.id ? (
                  <div className="flex items-center gap-2">
                    <Input
                      id={field.id}
                      value={field.value}
                      onChange={(e) =>
                        handleFieldChange(field.id, e.target.value)
                      }
                      onBlur={() => setEditingField(null)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && setEditingField(null)
                      }
                      className="text-sm h-9"
                      autoFocus
                    />
                    <button
                      onClick={() => setEditingField(null)}
                      className="shrink-0 h-9 w-9 flex items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => setEditingField(field.id)}
                    className="flex items-center justify-between px-3 py-2 rounded-xl border bg-card hover:bg-muted/50 cursor-pointer transition-colors group"
                  >
                    <span className="text-sm truncate">{field.value}</span>
                    <Pencil className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI-generated fields */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            AI-Generated Responses
          </span>
          <Badge className="text-[10px] h-5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-0 gap-1">
            <Sparkles className="h-2.5 w-2.5" />
            AI
          </Badge>
        </div>
        <div className="grid gap-3">
          {aiFields.map((field, idx) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (profileFields.length + idx) * 0.04 }}
              className="group"
            >
              <Label
                htmlFor={field.id}
                className="text-xs text-muted-foreground mb-1.5 flex items-center gap-2"
              >
                {field.icon}
                {field.label}
              </Label>
              <div className="relative">
                {editingField === field.id ? (
                  <div className="flex items-start gap-2">
                    <Input
                      id={field.id}
                      value={field.value}
                      onChange={(e) =>
                        handleFieldChange(field.id, e.target.value)
                      }
                      onBlur={() => setEditingField(null)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && setEditingField(null)
                      }
                      className="text-sm h-auto py-2"
                      autoFocus
                    />
                    <button
                      onClick={() => setEditingField(null)}
                      className="shrink-0 h-9 w-9 flex items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors mt-0.5"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => setEditingField(field.id)}
                    className="flex items-start justify-between px-3 py-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 cursor-pointer transition-colors group"
                  >
                    <span className="text-sm leading-relaxed">
                      {field.value}
                    </span>
                    <Pencil className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2 mt-0.5" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
