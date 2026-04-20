"use client";

import { Job } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Bookmark, BookmarkCheck, MapPin, Building2, Clock, Sparkles } from "lucide-react";
import { useJobStore } from "@/store/job.store";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export function JobCard({ job }: { job: Job }) {
  const router = useRouter();
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
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden flex flex-col h-full border-muted/60 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="p-5 pb-0">
          <div className="flex justify-between items-start gap-4">
            <div className="flex gap-3">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-xl text-primary shrink-0">
                {job.companyLogo || job.company[0]}
              </div>
              <div>
                <h3 className="font-semibold text-lg leading-tight line-clamp-1" title={job.title}>
                  {job.title}
                </h3>
                <div className="flex items-center gap-1.5 text-muted-foreground mt-1 text-sm">
                  <Building2 className="h-3.5 w-3.5" />
                  <span className="truncate">{job.company}</span>
                </div>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 shrink-0 rounded-full ${isSaved ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
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
            <Badge variant="secondary" className="bg-muted font-normal text-muted-foreground">
              <MapPin className="h-3 w-3 mr-1" />
              {job.location}
            </Badge>
            <Badge variant="secondary" className="bg-muted font-normal text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              {job.type}
            </Badge>
            <Badge variant="secondary" className="bg-muted font-normal text-muted-foreground">
               {job.salary}
            </Badge>
          </div>
          
          <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
            {job.skills.slice(0, 4).map(skill => (
              <span key={skill} className="text-[11px] px-2 py-0.5 rounded-full border border-border text-muted-foreground">
                {skill}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="text-[11px] px-2 py-0.5 rounded-full border border-border text-muted-foreground">
                +{job.skills.length - 4}
              </span>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="p-5 pt-0 border-t mt-auto flex items-center justify-between bg-muted/20">
          <div className={`mt-5 px-2.5 py-1 rounded-full flex items-center gap-1.5 text-xs font-semibold ${getScoreColor(job.matchScore)}`}>
            <Sparkles className="h-3.5 w-3.5" />
            {job.matchScore}% Match
          </div>
          
          <Button 
            className="mt-5 rounded-lg" 
            size="sm"
            onClick={() => router.push(`/application/${job.id}`)}
          >
            Review & Apply
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
