"use client";

import { Job } from "@/types";
import { JobCard } from "./job-card";
import { Layers, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface JobFeedProps {
  jobs: Job[];
  selectedJobId?: string | null;
  onSelectJob?: (id: string) => void;
}

export function JobFeed({ jobs, selectedJobId, onSelectJob }: JobFeedProps) {
  const [displayJobs, setDisplayJobs] = useState<Job[]>([]);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDisplayJobs(jobs);
  }, [jobs]);

  useEffect(() => {
    if (jobs.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Generate unique IDs for duplicated jobs
          const newJobs = jobs.map(job => ({
            ...job,
            id: `${job.id}-${Math.random().toString(36).substr(2, 9)}`
          }));
          
          setDisplayJobs(prev => [...prev, ...newJobs]);
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [jobs]);

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl border-dashed bg-muted/10 h-full">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <Layers className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">No jobs found</h3>
        <p className="text-muted-foreground mt-2 max-w-sm">
          We couldn&apos;t find any jobs matching your current filters. Try adjusting your preferences or search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {displayJobs.map((job) => (
        <JobCard 
          key={job.id} 
          job={job} 
          isSelected={selectedJobId === job.id || (!!selectedJobId && job.id.startsWith(selectedJobId + "-"))}
          onClick={() => {
            // we probably want to select the original ID so it matches the store correctly
            const originalId = job.id.split('-')[0];
            onSelectJob?.(originalId);
          }}
        />
      ))}
      {displayJobs.length > 0 && (
        <div ref={loadMoreRef} className="py-4 flex justify-center text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}
    </div>
  );
}
