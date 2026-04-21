"use client";

import { useJobStore } from "@/store/job.store";
import { JobFeed } from "@/components/jobs/job-feed";
import { JobFilters } from "@/components/jobs/job-filters";
import { JobDetails } from "@/components/jobs/job-details";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const { filteredJobs } = useJobStore();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  useEffect(() => {
    // Select the first job automatically if none selected, or if current selection is not in filtered list
    if (filteredJobs.length > 0) {
      if (!selectedJobId || !filteredJobs.find(j => j.id === selectedJobId)) {
        setSelectedJobId(filteredJobs[0].id);
      }
    } else {
      setSelectedJobId(null);
    }
  }, [filteredJobs, selectedJobId]);

  const selectedJob = filteredJobs.find((j) => j.id === selectedJobId);

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-8rem)]">
      <div className="shrink-0">
        <JobFilters />
      </div>
      
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="grid h-full gap-6 md:grid-cols-[350px_1fr] lg:grid-cols-[400px_1fr]">
          {/* Left Column - Scrollable Job Feed */}
          <div className="flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between shrink-0 mb-4 px-1">
              <h2 className="text-xl font-semibold tracking-tight">
                Jobs For You ({filteredJobs.length})
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 pb-8 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full">
              <JobFeed 
                jobs={filteredJobs} 
                selectedJobId={selectedJobId} 
                onSelectJob={setSelectedJobId} 
              />
            </div>
          </div>

          {/* Right Column - Job Details */}
          <div className="hidden md:block h-full overflow-y-auto pl-2 pr-4 pb-8 scrollbar-hide">
            {selectedJob ? (
              <JobDetails job={selectedJob} />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground bg-muted/20 border border-dashed rounded-xl">
                No job selected
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
