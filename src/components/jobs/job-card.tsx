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
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`cursor-pointer rounded-[20px] transition-all`}
    >
      <Card className={`overflow-hidden flex flex-col h-full shadow-sm transition-colors border border-border/50 hover:bg-card/80 ${isSelected ? 'bg-card/60 ring-1 ring-border/50' : 'bg-transparent'}`}>
        <CardHeader className="p-5 pb-0">
          <div className="flex justify-between items-start gap-4">
            <div className="flex gap-3">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-xl text-primary shrink-0 overflow-hidden">
                {job.companyLogo ? (
                   <img src={job.companyLogo} alt={job.company} className="object-cover w-full h-full" />
                ) : (
                   <span className="text-primary">{job.company[0]}</span>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-[15px] leading-tight line-clamp-1 text-white" title={job.title}>
                  {job.title}
                </h3>
                <div className="flex items-center gap-1.5 text-muted-foreground mt-1 text-sm">
                  <span className="truncate">{job.company}</span>
                </div>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 shrink-0 rounded-full ${isSaved ? "text-primary" : "text-muted-foreground hover:text-white"}`}
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
            <Badge variant="secondary" className="bg-muted/40 font-normal text-muted-foreground h-6 flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {job.location}
            </Badge>
            <Badge variant="secondary" className="bg-muted/40 font-normal text-muted-foreground h-6 flex items-center">
              Posted {job.postedDate}
            </Badge>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-1">
            <Badge variant="outline" className="font-normal text-[11px] h-[22px] border-border/50 bg-card/20">{job.type}</Badge>
            <Badge variant="outline" className="font-normal text-[11px] h-[22px] border-border/50 bg-card/20">{job.experienceLevel}</Badge>
            {job.skills.slice(0, 2).map((skill, i) => (
              <Badge key={i} variant="outline" className="font-normal text-[11px] h-[22px] border-border/50 bg-card/20">{skill}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
