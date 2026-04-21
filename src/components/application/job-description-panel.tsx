"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Building2,
  Briefcase,
  DollarSign,
  Clock,
  Globe,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Job } from "@/types";

interface JobDescriptionPanelProps {
  job: Job;
}

export function JobDescriptionPanel({ job }: JobDescriptionPanelProps) {
  // Simulated skill match — in production, would compare against profile
  const matchedSkills = job.skills.slice(0, Math.ceil(job.skills.length * 0.7));
  const unmatchedSkills = job.skills.slice(Math.ceil(job.skills.length * 0.7));

  return (
    <div className="p-6 space-y-6 w-full">
      {/* Company header */}
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 text-emerald-600 dark:text-emerald-400 text-xl font-bold shrink-0 border border-emerald-500/20">
            {job.companyLogo || job.company[0]}
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-semibold tracking-tight">{job.title}</h2>
            <p className="text-muted-foreground font-medium">{job.company}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="gap-1.5 rounded-lg">
            <MapPin className="h-3 w-3" />
            {job.location}
          </Badge>
          <Badge variant="secondary" className="gap-1.5 rounded-lg">
            <Briefcase className="h-3 w-3" />
            {job.type}
          </Badge>
          <Badge variant="secondary" className="gap-1.5 rounded-lg">
            <DollarSign className="h-3 w-3" />
            {job.salary}
          </Badge>
          <Badge variant="secondary" className="gap-1.5 rounded-lg">
            <Clock className="h-3 w-3" />
            {job.postedDate}
          </Badge>
          {job.remote && (
            <Badge variant="secondary" className="gap-1.5 rounded-lg">
              <Globe className="h-3 w-3" />
              Remote
            </Badge>
          )}
        </div>

        <Button variant="outline" size="sm" className="gap-2 rounded-xl text-xs">
          <ExternalLink className="h-3 w-3" />
          View on company site
        </Button>
      </div>

      <Separator />

      {/* Description */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
          About the role
        </h3>
        <p className="text-sm leading-relaxed">{job.description}</p>
      </div>

      <Separator />

      {/* Requirements with match indicators */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
          Requirements
        </h3>
        <ul className="space-y-2.5">
          {job.requirements.map((req, i) => {
            const isMatched = i < Math.ceil(job.requirements.length * 0.6);
            return (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-2.5 text-sm"
              >
                {isMatched ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 text-orange-400 mt-0.5 shrink-0" />
                )}
                <span className={isMatched ? "" : "text-muted-foreground"}>
                  {req}
                </span>
              </motion.li>
            );
          })}
        </ul>
      </div>

      <Separator />

      {/* Skills match */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
          Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {matchedSkills.map((skill) => (
            <Badge
              key={skill}
              className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-lg"
            >
              <CheckCircle2 className="h-3 w-3 mr-1" />
              {skill}
            </Badge>
          ))}
          {unmatchedSkills.map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="rounded-lg text-muted-foreground"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      <Separator />

      {/* Industry & Level */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
            Industry
          </span>
          <p className="text-sm font-medium">{job.industry}</p>
        </div>
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
            Experience Level
          </span>
          <p className="text-sm font-medium">{job.experienceLevel}</p>
        </div>
      </div>
    </div>
  );
}
