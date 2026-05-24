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
import { Skeleton } from "@/components/ui/skeleton";
import { Job } from "@/types";
import { useAuthStore } from "@/store/auth.store";
import { type AiContent } from "@/lib/api/applications";

interface FormAutofillPreviewProps {
  job: Job;
  isGenerating?: boolean;
  aiFormFields?: AiContent["form_fields"];
  onSave?: (fields: AiContent["form_fields"]) => Promise<void>;
}

interface FieldData {
  id: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  source: "profile" | "ai";
}

export function FormAutofillPreview({ job, isGenerating, aiFormFields, onSave }: FormAutofillPreviewProps) {
  const user = useAuthStore((state) => state.user);

  // AI field values — seeded from aiFormFields once they arrive
  const [whyUs, setWhyUs] = React.useState("");
  const [yearsExp, setYearsExp] = React.useState("");
  const [salary, setSalary] = React.useState(job.salary || "");
  const [startDate, setStartDate] = React.useState("2 weeks notice");
  const [visaSponsor, setVisaSponsor] = React.useState("No");
  const [workAuth, setWorkAuth] = React.useState("Authorized to work");

  React.useEffect(() => {
    if (!aiFormFields) return;
    if (aiFormFields.why_us) setWhyUs(aiFormFields.why_us);
    if (aiFormFields.years_experience) setYearsExp(aiFormFields.years_experience);
    if (aiFormFields.salary_expectation) setSalary(aiFormFields.salary_expectation);
    if (aiFormFields.earliest_start) setStartDate(aiFormFields.earliest_start);
    if (aiFormFields.visa_sponsorship) setVisaSponsor(aiFormFields.visa_sponsorship);
    if (aiFormFields.work_authorization) setWorkAuth(aiFormFields.work_authorization);
  }, [aiFormFields]);

  const initialFields: FieldData[] = [
    { id: "name", label: "Full Name", value: user?.full_name || "Full Name", icon: <User className="h-4 w-4" />, source: "profile" },
    { id: "email", label: "Email Address", value: user?.email || "Email", icon: <Mail className="h-4 w-4" />, source: "profile" },
    { id: "phone", label: "Phone Number", value: user?.profile?.phone || "", icon: <Phone className="h-4 w-4" />, source: "profile" },
    { id: "location", label: "Location", value: user?.profile?.location || "", icon: <MapPin className="h-4 w-4" />, source: "profile" },
    { id: "website", label: "Portfolio / Website", value: user?.profile?.portfolio_url || "", icon: <Globe className="h-4 w-4" />, source: "profile" },
    { id: "linkedin", label: "LinkedIn Profile", value: user?.profile?.linkedin_url || "", icon: <Link className="h-4 w-4" />, source: "profile" },
  ];

  const [fields, setFields] = React.useState(initialFields);
  const [editingField, setEditingField] = React.useState<string | null>(null);

  // Also sync profile fields when user loads
  React.useEffect(() => {
    if (!user) return;
    setFields([
      { id: "name", label: "Full Name", value: user.full_name || "", icon: <User className="h-4 w-4" />, source: "profile" },
      { id: "email", label: "Email Address", value: user.email || "", icon: <Mail className="h-4 w-4" />, source: "profile" },
      { id: "phone", label: "Phone Number", value: user.profile?.phone || "", icon: <Phone className="h-4 w-4" />, source: "profile" },
      { id: "location", label: "Location", value: user.profile?.location || "", icon: <MapPin className="h-4 w-4" />, source: "profile" },
      { id: "website", label: "Portfolio / Website", value: user.profile?.portfolio_url || "", icon: <Globe className="h-4 w-4" />, source: "profile" },
      { id: "linkedin", label: "LinkedIn Profile", value: user.profile?.linkedin_url || "", icon: <Link className="h-4 w-4" />, source: "profile" },
    ]);
  }, [user]);

  const handleFieldChange = (id: string, value: string) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, value } : f)));
  };

  const handleSaveAll = async () => {
    if (onSave) {
      await onSave({
        why_us: whyUs,
        years_experience: yearsExp,
        salary_expectation: salary,
        earliest_start: startDate,
        visa_sponsorship: visaSponsor,
        work_authorization: workAuth,
      });
    }
  };

  // AI fields array (driven by state)
  const aiFieldRows = [
    { id: "why", label: `Why do you want to work at ${job.company}?`, value: whyUs, setter: setWhyUs },
    { id: "experience", label: "Years of Relevant Experience", value: yearsExp, setter: setYearsExp },
    { id: "salary", label: "Salary Expectations", value: salary, setter: setSalary },
    { id: "start", label: "Earliest Start Date", value: startDate, setter: setStartDate },
    { id: "visa", label: "Visa Sponsorship", value: visaSponsor, setter: setVisaSponsor },
    { id: "workauth", label: "Work Authorization", value: workAuth, setter: setWorkAuth },
  ];

  if (isGenerating) {
    return (
      <div className="p-6 space-y-4">
        <div className="space-y-1 mb-4">
          <h3 className="font-semibold">Application Form Preview</h3>
          <p className="text-sm text-muted-foreground">AI is generating your form answers...</p>
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const profileFields = fields.filter((f) => f.source === "profile");

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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              AI-Generated Responses
            </span>
            <Badge className="text-[10px] h-5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-0 gap-1">
              <Sparkles className="h-2.5 w-2.5" />
              AI
            </Badge>
          </div>
          {onSave && (
            <button
              onClick={handleSaveAll}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
            >
              Save answers
            </button>
          )}
        </div>
        <div className="grid gap-3">
          {aiFieldRows.map((field, idx) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (profileFields.length + idx) * 0.04 }}
              className="group"
            >
              <Label htmlFor={field.id} className="text-xs text-muted-foreground mb-1.5 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                {field.label}
              </Label>
              <div
                className="flex items-start justify-between px-3 py-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors"
              >
                <textarea
                  id={field.id}
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  className="text-sm leading-relaxed bg-transparent outline-none resize-none w-full min-h-[28px]"
                  rows={field.value.length > 100 ? 3 : 1}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

