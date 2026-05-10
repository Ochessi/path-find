"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  RotateCcw,
  Copy,
  Check,
  Pencil,
  Eye,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Job } from "@/types";
import { useAuthStore } from "@/store/auth.store";
import { UserProfile } from "@/lib/api/auth";

interface AiResumeEditorProps {
  job: Job;
  isGenerating: boolean;
}

// Simulated AI-tailored resume sections
function generateResumeSections(job: Job, user: UserProfile | null) {
  const defaultExperience = [
    {
      title: "Senior Software Engineer",
      company: "TechCorp",
      period: "2022 — Present",
      bullets: [
        `Led development of customer-facing applications using ${job.skills[0] || 'modern tech'} and ${job.skills[1] || 'tools'}, resulting in a 40% increase in user engagement`,
        `Architected and deployed scalable microservices handling 10M+ daily requests with 99.99% uptime`,
        `Mentored a team of 5 junior developers, establishing code review processes that reduced bugs by 35%`,
        `Collaborated with product and design teams to ship 12 major features in the ${job.industry} space`,
      ],
      isAiModified: true,
    },
    {
      title: "Software Engineer",
      company: "StartupXYZ",
      period: "2020 — 2022",
      bullets: [
        `Built and maintained full-stack applications using ${job.skills.slice(0, 2).join(" and ")}`,
        `Implemented CI/CD pipelines that reduced deployment time from 2 hours to 15 minutes`,
        `Designed RESTful APIs consumed by mobile and web clients, serving 50K+ daily active users`,
      ],
      isAiModified: true,
    },
    {
      title: "Junior Developer",
      company: "Digital Agency",
      period: "2018 — 2020",
      bullets: [
        "Developed responsive web applications for enterprise clients across multiple industries",
        "Participated in agile sprints, consistently delivering features ahead of schedule",
      ],
      isAiModified: false,
    },
  ];

  const defaultEducation = {
    degree: "B.S. Computer Science",
    school: "University of California, Berkeley",
    year: "2018",
  };

  const experience = user?.experience && user.experience.length > 0
    ? user.experience.map((exp, idx) => ({
        title: exp.title,
        company: exp.company,
        period: `${new Date(exp.start_date).getFullYear()} — ${exp.current || !exp.end_date ? 'Present' : new Date(exp.end_date).getFullYear()}`,
        bullets: exp.description ? exp.description.split('\n').filter(Boolean) : [`Contributed to ${exp.company} as a ${exp.title}`],
        isAiModified: idx === 0,
      }))
    : defaultExperience;

  if (experience.length > 0 && experience[0].isAiModified && user?.experience && user.experience.length > 0) {
    experience[0].bullets = [
      `Leveraged ${job.skills[0] || 'modern tech'} and ${job.skills[1] || 'industry tools'} to accelerate project delivery`,
      ...experience[0].bullets
    ];
  }

  const education = user?.education && user.education.length > 0
    ? {
        degree: user.education[0].degree,
        school: user.education[0].institution,
        year: new Date(user.education[0].end_date || user.education[0].start_date).getFullYear().toString() || "Unknown",
      }
    : defaultEducation;

  return {
    summary: user?.summary || user?.profile?.bio || `Highly motivated ${job.experienceLevel}-level professional with deep expertise in ${job.skills.slice(0, 3).join(", ")}. Proven track record of building scalable products at top-tier technology companies with a focus on ${job.industry.toLowerCase()} innovation. Passionate about leveraging technology to solve complex problems and drive business outcomes.`,
    experience,
    education,
    skills: user?.skills && user.skills.length > 0 ? user.skills : job.skills,
  };
}

export function AiResumeEditor({ job, isGenerating }: AiResumeEditorProps) {
  const user = useAuthStore((state) => state.user);
  const [isEditing, setIsEditing] = React.useState(false);
  const [isRegenerating, setIsRegenerating] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const resume = React.useMemo(() => generateResumeSections(job, user), [job, user]);
  const [editedSummary, setEditedSummary] = React.useState(resume.summary);

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsRegenerating(false);
  };

  const handleCopy = () => {
    setCopied(true);
    navigator.clipboard?.writeText(
      `${resume.summary}\n\n${resume.experience.map((e) => `${e.title} at ${e.company}\n${e.bullets.join("\n")}`).join("\n\n")}`
    );
    setTimeout(() => setCopied(false), 2000);
  };

  if (isGenerating) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="relative">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white animate-pulse" />
            </div>
            <div className="absolute -inset-1 rounded-xl bg-emerald-500/20 animate-ping" />
          </div>
          <div>
            <p className="font-semibold">Tailoring your resume...</p>
            <p className="text-sm text-muted-foreground">
              Optimizing for {job.title} at {job.company}
            </p>
          </div>
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[90%]" />
        <Skeleton className="h-4 w-[75%]" />
        <div className="pt-4 space-y-4">
          <Skeleton className="h-4 w-[40%]" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-[95%]" />
          <Skeleton className="h-3 w-[85%]" />
          <Skeleton className="h-3 w-[90%]" />
        </div>
        <div className="pt-4 space-y-4">
          <Skeleton className="h-4 w-[35%]" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-[80%]" />
          <Skeleton className="h-3 w-[70%]" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-0 gap-1">
            <Sparkles className="h-3 w-3" />
            AI-Tailored
          </Badge>
          <span className="text-xs text-muted-foreground">
            Optimized for {job.company}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 rounded-lg gap-1.5 text-xs"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? (
              <>
                <Eye className="h-3.5 w-3.5" />
                Preview
              </>
            ) : (
              <>
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 rounded-lg gap-1.5 text-xs"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 rounded-lg gap-1.5 text-xs"
            onClick={handleRegenerate}
            disabled={isRegenerating}
          >
            {isRegenerating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RotateCcw className="h-3.5 w-3.5" />
            )}
            Regenerate
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isRegenerating ? (
          <motion.div
            key="regenerating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4 py-8"
          >
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
              <span className="text-sm text-muted-foreground">
                Regenerating resume content...
              </span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Summary */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                  Professional Summary
                </h3>
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="relative group">
                <div className="absolute -left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 to-transparent rounded-full" />
                {isEditing ? (
                  <Textarea
                    value={editedSummary}
                    onChange={(e) => setEditedSummary(e.target.value)}
                    rows={4}
                    className="text-sm leading-relaxed resize-none"
                  />
                ) : (
                  <p className="text-sm leading-relaxed pl-1">
                    {editedSummary}
                  </p>
                )}
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                Experience
              </h3>
              {resume.experience.map((exp, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative group"
                >
                  {exp.isAiModified && (
                    <div className="absolute -left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 to-transparent rounded-full" />
                  )}
                  <div className="pl-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-sm">{exp.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {exp.company} · {exp.period}
                        </p>
                      </div>
                      {exp.isAiModified && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] h-5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-0 shrink-0"
                        >
                          AI enhanced
                        </Badge>
                      )}
                    </div>
                    <ul className="space-y-1.5">
                      {exp.bullets.map((bullet, bi) => (
                        <li
                          key={bi}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <span className="text-emerald-500 mt-1.5 shrink-0">
                            •
                          </span>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Education */}
            <div className="space-y-2">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                Education
              </h3>
              <div className="pl-1">
                <h4 className="font-medium text-sm">{resume.education.degree}</h4>
                <p className="text-xs text-muted-foreground">
                  {resume.education.school} · {resume.education.year}
                </p>
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                Skills
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {resume.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="rounded-lg text-xs"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
