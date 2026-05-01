"use client";

import { Job } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Bookmark, BookmarkCheck, MapPin, Building2, Clock, Sparkles } from "lucide-react";
import { useJobStore } from "@/store/job.store";
import { motion } from "framer-motion";

interface JobCardProps {
  job: Job;
  isSelected?: boolean;
  onClick?: () => void;
}

export function JobCard({ job, isSelected, onClick }: JobCardProps) {
  const { savedJobs, toggleSaveJob } = useJobStore();
  const isSaved = savedJobs.includes(job.id);

  // Determine badge color based on match score
  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-500/10 text-green-700 dark:text-green-400";
    if (score >= 75) return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
    if (score >= 60) return "bg-orange-500/10 text-orange-700 dark:text-orange-400";
    return "bg-muted text-muted-foreground";
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      onClick={onClick}
      className="cursor-pointer rounded-[28px] transition-all"
    >
      <Card className={`overflow-hidden flex flex-col h-full shadow-[0_24px_80px_-44px_rgba(15,23,42,0.4)] transition-all border border-white/10 ${isSelected ? 'bg-slate-950/90 ring-1 ring-sky-500/20' : 'bg-slate-950/80 hover:bg-slate-950/95'}`}>
        <CardHeader className="p-5 pb-0">
          <div className="flex justify-between items-start gap-4">
            <div className="flex gap-3">
              <div className="h-14 w-14 rounded-3xl bg-gradient-to-br from-sky-500 via-violet-500 to-fuchsia-500 shadow-lg shadow-sky-500/20 flex items-center justify-center text-xl font-black text-white overflow-hidden">
                {job.companyLogo ? (
                  <img src={job.companyLogo} alt={job.company} className="object-cover w-full h-full" />
                ) : (
                  <span>{job.company[0]}</span>
                )}
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-lg leading-tight line-clamp-1 text-white" title={job.title}>
                  {job.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                  <Building2 className="h-4 w-4 text-slate-500" />
                  <span className="truncate">{job.company}</span>
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className={`h-10 w-10 rounded-full border border-white/10 shadow-sm ${isSaved ? 'bg-slate-900 text-sky-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleSaveJob(job.id);
              }}
            >
              {isSaved ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-5 flex-1 flex flex-col gap-4">
          <div className="flex flex-wrap gap-2 text-xs">
            <Badge variant="secondary" className="bg-slate-900/70 text-slate-300 h-7 flex items-center gap-1.5 px-3 rounded-full">
              <MapPin className="h-3 w-3" />
              {job.location}
            </Badge>
            <Badge variant="secondary" className="bg-slate-900/70 text-slate-300 h-7 flex items-center gap-1.5 px-3 rounded-full">
              <Clock className="h-3 w-3" />
              {job.postedDate}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2 mt-1">
            <Badge variant="outline" className="font-normal text-[11px] h-7 border-white/10 bg-white/5 text-slate-200 rounded-full px-3">
              {job.type}
            </Badge>
            <Badge variant="outline" className="font-normal text-[11px] h-7 border-white/10 bg-white/5 text-slate-200 rounded-full px-3">
              {job.experienceLevel}
            </Badge>
          </div>

          <div className="mt-auto flex items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {job.skills.slice(0, 3).map((skill, i) => (
                <Badge key={i} variant="outline" className="font-normal text-[11px] h-7 border-white/10 bg-white/5 text-slate-200 rounded-full px-3">
                  {skill}
                </Badge>
              ))}
            </div>
            <div className={`rounded-full px-3 py-1 text-xs font-semibold ${getScoreColor(job.matchScore)}`}>
              {job.matchScore}% match
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
