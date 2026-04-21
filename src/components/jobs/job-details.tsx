"use client";

import { Job } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, MapPin, ExternalLink, Zap } from "lucide-react";
import { motion } from "framer-motion";

export function JobDetails({ job }: { job: Job }) {
  if (!job) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      key={job.id}
      className="flex flex-col gap-6"
    >
      <Card className="border-muted/60 shadow-sm bg-card/50">
        <CardContent className="p-6 pb-6">
          <div className="flex justify-between items-start gap-4">
            <div className="flex gap-4">
              <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-3xl text-primary shrink-0">
                {job.companyLogo || job.company[0]}
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="text-2xl font-bold tracking-tight">{job.title}</h2>
                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                  <span className="font-medium text-foreground">{job.company}</span>
                </div>
              </div>
            </div>
            <Button className="shrink-0 bg-green-600 hover:bg-green-700 text-white rounded-full px-6 flex items-center gap-2">
              Apply <Zap className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between mt-6 pt-6 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{job.location}</span>
              <span>•</span>
              <span>Posted {job.postedDate}</span>
            </div>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground h-8 text-xs h-auto py-1">
              <ExternalLink className="h-3 w-3 mr-1" />
              View Original
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-muted/60 shadow-sm">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg flex items-center gap-2 mb-3 text-emerald-500/90 dark:text-emerald-400">
            About This Role
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {job.description}
          </p>
        </CardContent>
      </Card>

      <Card className="border-muted/60 shadow-sm">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg flex items-center gap-2 mb-4 text-emerald-500/90 dark:text-emerald-400">
            Required Qualifications ({job.requirements.length})
          </h3>
          <ul className="space-y-3">
            {job.requirements.map((req, i) => (
              <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 mt-2 shrink-0" />
                <span className="leading-relaxed">{req}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="border-muted/60 shadow-sm">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg flex items-center gap-2 mb-4 text-amber-500/90 dark:text-amber-400">
            Desired Qualifications ({job.skills.length})
          </h3>
          <ul className="space-y-3">
            {job.skills.map((skill, i) => (
              <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500/60 mt-2 shrink-0" />
                <span className="leading-relaxed">{skill}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="border-muted/60 shadow-sm">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg flex items-center gap-2 mb-4 text-red-500/90 dark:text-red-400">
            Restrictions
          </h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
             <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500/60 mt-2 shrink-0" />
                <span className="leading-relaxed">This position may require authorization to work in {job.location}.</span>
              </li>
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}
