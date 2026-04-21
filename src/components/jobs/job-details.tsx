"use client";

import { Job } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, ExternalLink, Zap, FileText, Briefcase, Star, XCircle } from "lucide-react";
import { motion } from "framer-motion";

export function JobDetails({ job }: { job: Job }) {
  if (!job) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      key={job.id}
      className="flex flex-col gap-4 border border-border/50 bg-[#151517] dark:bg-card/40 rounded-[20px] p-6 lg:p-8 relative"
    >
      {/* Header section - no separate card */}
      <div className="flex justify-between items-start gap-4 mb-2">
        <div className="flex gap-4">
          <div className="h-16 w-16 rounded-[14px] bg-white flex items-center justify-center font-bold text-2xl text-primary shrink-0 overflow-hidden shadow-sm">
            {job.companyLogo ? (
               <img src={job.companyLogo} alt={job.company} className="object-cover w-full h-full" />
            ) : (
               <span className="text-black">{job.company[0]}</span>
            )}
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-semibold tracking-tight text-white mb-1.5">{job.title}</h2>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="uppercase text-sm tracking-wide font-medium">{job.company}</span>
            </div>
          </div>
        </div>
        <Button className="shrink-0 bg-[#A6F4C5] hover:bg-[#8CE0AC] text-[#065F46] font-semibold rounded-full px-6 py-5 flex items-center gap-1.5">
          Apply <Zap className="h-4 w-4 fill-current ml-1" /> 1
        </Button>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4" />
          <span>{job.location} - Posted {job.postedDate}</span>
        </div>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white h-auto py-1 px-0 flex items-center gap-1.5">
          <ExternalLink className="h-4 w-4" />
          View Original
        </Button>
      </div>

      {/* About Section */}
      <Card className="border-border/40 shadow-none bg-[#1C1C1E] dark:bg-background/20 rounded-xl">
        <CardContent className="p-5">
          <h3 className="font-medium text-[15px] flex items-center gap-2 mb-3 text-[#A6F4C5]">
            <FileText className="h-4 w-4" />
            About This Role
          </h3>
          <p className="text-muted-foreground text-[14px] leading-relaxed">
            {job.description}
          </p>
        </CardContent>
      </Card>

      {/* Required Qualifications */}
      <Card className="border-border/40 shadow-none bg-[#1C1C1E] dark:bg-background/20 rounded-xl">
        <CardContent className="p-5">
          <h3 className="font-medium text-[15px] flex items-center gap-2 mb-3 text-[#A6F4C5]">
            <Briefcase className="h-4 w-4" />
            Required Qualifications ({job.requirements.length})
          </h3>
          <ul className="space-y-2.5">
            {job.requirements.map((req, i) => (
              <li key={i} className="flex gap-2 text-[14px] text-muted-foreground">
                <span className="text-[#A6F4C5]">•</span>
                <span className="leading-relaxed">{req}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Desired Qualifications */}
      <Card className="border-border/40 shadow-none bg-[#1C1C1E] dark:bg-background/20 rounded-xl">
        <CardContent className="p-5">
          <h3 className="font-medium text-[15px] flex items-center gap-2 mb-3 text-amber-500">
            <Star className="h-4 w-4" />
            Desired Qualifications ({job.skills.length})
          </h3>
          <ul className="space-y-2.5">
             {job.skills.map((skill, i) => (
              <li key={i} className="flex gap-2 text-[14px] text-muted-foreground">
                <span className="text-amber-500">•</span>
                <span className="leading-relaxed">{skill}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Restrictions */}
      <Card className="border-border/40 shadow-none bg-[#1C1C1E] dark:bg-background/20 rounded-xl">
        <CardContent className="p-5">
          <h3 className="font-medium text-[15px] flex items-center gap-2 mb-3 text-red-400">
            <XCircle className="h-4 w-4" />
            Restrictions (1)
          </h3>
          <ul className="space-y-2.5 text-[14px] text-muted-foreground">
             <li className="flex gap-2">
                <span className="text-red-400">•</span>
                <span className="leading-relaxed">This position may require authorization to work in {job.location}.</span>
              </li>
          </ul>
        </CardContent>
      </Card>
      
      {/* Absolute floating actionable button matching the image's bottom right green circle */}
      <div className="absolute right-4 -bottom-6 w-12 h-12 rounded-full bg-[#065F46] border border-[#A6F4C5]/20 flex items-center justify-center text-[#A6F4C5] shadow-lg cursor-pointer hover:bg-[#065F46]/80 transition-colors">
        <Briefcase className="h-5 w-5" />
      </div>
    </motion.div>
  );
}
