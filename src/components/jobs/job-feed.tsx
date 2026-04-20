"use client";

import { Job } from "@/types";
import { JobCard } from "./job-card";
import { Layers } from "lucide-react";

export function JobFeed({ jobs }: { jobs: Job[] }) {
  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl border-dashed bg-muted/10">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <Layers className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">No jobs found</h3>
        <p className="text-muted-foreground mt-2 max-w-sm">
          We couldn't find any jobs matching your current filters. Try adjusting your preferences or search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
