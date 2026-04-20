"use client";

import { useJobStore } from "@/store/job.store";
import { JobFeed } from "@/components/jobs/job-feed";
import { JobFilters } from "@/components/jobs/job-filters";
import { StatsCards } from "@/components/dashboard/stats-cards";

export default function DashboardPage() {
  const { filteredJobs } = useJobStore();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Discover jobs tailored to your profile.
        </p>
      </div>
      
      <StatsCards />
      
      <div className="grid gap-6 md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr]">
        <aside className="hidden md:block">
          <JobFilters />
        </aside>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">
              Recommended Jobs ({filteredJobs.length})
            </h2>
          </div>
          <JobFeed jobs={filteredJobs} />
        </div>
      </div>
    </div>
  );
}
