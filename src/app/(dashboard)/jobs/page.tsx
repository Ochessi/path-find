"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  MapPin,
  Briefcase,
  Clock,
  Wifi,
  BookmarkPlus,
  BookmarkCheck,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  X,
  DollarSign,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useJobStore } from "@/store/job.store";
import { useApplicationStore } from "@/store/application.store";
import { Job } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const INDUSTRIES = [
  "All Industries",
  "FinTech",
  "SaaS",
  "Developer Tools",
  "AI/ML",
  "Cloud/Infrastructure",
  "Design Tools",
  "Security",
  "EdTech",
  "E-Commerce",
  "Travel",
];

const EXPERIENCE_LEVELS = ["All Levels", "Entry", "Mid", "Senior", "Lead"];

const JOB_TYPES = ["All Types", "Full-time", "Part-time", "Contract", "Internship"];

const MATCH_COLORS: Record<string, string> = {
  high: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
  mid: "text-blue-600 bg-blue-500/10 border-blue-500/20",
  low: "text-slate-500 bg-slate-500/10 border-slate-500/20",
};

function matchTier(score: number) {
  if (score >= 80) return "high";
  if (score >= 60) return "mid";
  return "low";
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function stripFormatting(text: string) {
  if (!text) return "";
  let cleaned = text.replace(/<[^>]*>?/gm, ' '); // Remove HTML tags
  cleaned = cleaned.replace(/(\*\*|__)(.*?)\1/g, '$2'); // Remove bold
  cleaned = cleaned.replace(/(\*|_)(.*?)\1/g, '$2'); // Remove italic
  cleaned = cleaned.replace(/#{1,6}\s?/g, ''); // Remove headers
  cleaned = cleaned.replace(/\[(.*?)\]\(.*?\)/g, '$1'); // Remove links
  cleaned = cleaned.replace(/`{1,3}(.*?)`{1,3}/g, '$1'); // Remove code
  cleaned = cleaned.replace(/\n+/g, ' '); // Replace newlines with spaces
  return cleaned.trim();
}

// ---------------------------------------------------------------------------
// Job Card (grid variant)
// ---------------------------------------------------------------------------
function JobGridCard({
  job,
  saved,
  onSave,
  onApply,
  onClick,
}: {
  job: Job;
  saved: boolean;
  onSave: () => void;
  onApply: () => void;
  onClick: () => void;
}) {
  const tier = matchTier(job.matchScore);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      onClick={onClick}
      className="group relative flex flex-col bg-card border border-border/60 rounded-2xl p-5 hover:border-primary/40 hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 shrink-0 rounded-xl bg-muted border border-border/60 flex items-center justify-center font-bold text-lg text-muted-foreground">
            {job.companyLogo ?? job.company[0]}
          </div>
          <div>
            <h3 className="font-semibold text-sm leading-tight line-clamp-1">
              {job.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">{job.company}</p>
          </div>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onSave(); }}
          className="shrink-0 h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
          aria-label={saved ? "Unsave job" : "Save job"}
        >
          {saved ? (
            <BookmarkCheck className="h-4 w-4 text-primary" />
          ) : (
            <BookmarkPlus className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" /> {job.location}
        </span>
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Briefcase className="h-3 w-3" /> {job.type}
        </span>
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" /> {job.postedDate}
        </span>
        {job.remote && (
          <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
            <Wifi className="h-3 w-3" /> Remote
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed flex-1">
        {stripFormatting(job.description)}
      </p>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {(job.skills ?? []).slice(0, 4).map((skill) => (
          <Badge
            key={skill}
            variant="secondary"
            className="text-[11px] px-2 py-0.5 rounded-lg"
          >
            {skill}
          </Badge>
        ))}
        {(job.skills ?? []).length > 4 && (
          <Badge variant="outline" className="text-[11px] px-2 py-0.5 rounded-lg text-muted-foreground">
            +{(job.skills ?? []).length - 4}
          </Badge>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border/50">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn("text-[11px] px-2 py-0.5 rounded-lg border font-medium", MATCH_COLORS[tier])}
          >
            <Sparkles className="h-2.5 w-2.5 mr-1" />
            {job.matchScore}% match
          </Badge>
          <span className="text-xs text-muted-foreground">{job.salary}</span>
        </div>

        <Button
          size="sm"
          onClick={(e) => { e.stopPropagation(); onApply(); }}
          className="h-7 text-xs px-3 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground gap-1"
        >
          Apply <ChevronRight className="h-3 w-3" />
        </Button>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Filter Sidebar
// ---------------------------------------------------------------------------
function FilterSidebar({
  keyword,
  setKeyword,
  location,
  setLocation,
  industry,
  setIndustry,
  experienceLevel,
  setExperienceLevel,
  jobType,
  setJobType,
  salaryRange,
  setSalaryRange,
  remoteOnly,
  setRemoteOnly,
  onReset,
  activeFilters,
}: {
  keyword: string;
  setKeyword: (v: string) => void;
  location: string;
  setLocation: (v: string) => void;
  industry: string;
  setIndustry: (v: string) => void;
  experienceLevel: string;
  setExperienceLevel: (v: string) => void;
  jobType: string;
  setJobType: (v: string) => void;
  salaryRange: [number, number];
  setSalaryRange: (v: [number, number]) => void;
  remoteOnly: boolean;
  setRemoteOnly: (v: boolean) => void;
  onReset: () => void;
  activeFilters: number;
}) {
  return (
    <aside className="w-72 shrink-0 hidden lg:flex flex-col gap-5 border-r pr-6 overflow-y-auto pb-8">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
          Filters
        </h2>
        {activeFilters > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-7 text-xs text-muted-foreground hover:text-destructive"
          >
            <X className="h-3 w-3 mr-1" /> Clear {activeFilters}
          </Button>
        )}
      </div>

      {/* Keyword */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Keyword
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Title, company, skill…"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="pl-8 h-9 text-sm rounded-xl"
          />
        </div>
      </div>

      <Separator />

      {/* Location */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Location
        </Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="City, state, or remote…"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-8 h-9 text-sm rounded-xl"
          />
        </div>
      </div>

      <Separator />

      {/* Salary Range */}
      <div className="space-y-3">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
          <DollarSign className="h-3 w-3" /> Salary Range
        </Label>
        <Slider
          min={0}
          max={500000}
          step={10000}
          value={salaryRange}
          onValueChange={(v) => {
            const arr = Array.isArray(v) ? v : [v as number, 500000];
            setSalaryRange([arr[0] ?? 0, arr[1] ?? 500000]);
          }}
          className="mt-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>${(salaryRange[0] / 1000).toFixed(0)}k</span>
          <span>${(salaryRange[1] / 1000).toFixed(0)}k</span>
        </div>
      </div>

      <Separator />

      {/* Industry */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Industry
        </Label>
        <Select value={industry} onValueChange={(v) => v && setIndustry(v)}>
          <SelectTrigger className="h-9 text-sm rounded-xl">
            <SelectValue placeholder="All Industries" />
          </SelectTrigger>
          <SelectContent>
            {INDUSTRIES.map((i) => (
              <SelectItem key={i} value={i}>
                {i}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Experience Level */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Experience Level
        </Label>
        <Select value={experienceLevel} onValueChange={(v) => v && setExperienceLevel(v)}>
          <SelectTrigger className="h-9 text-sm rounded-xl">
            <SelectValue placeholder="All Levels" />
          </SelectTrigger>
          <SelectContent>
            {EXPERIENCE_LEVELS.map((l) => (
              <SelectItem key={l} value={l}>
                {l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Job Type */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Job Type
        </Label>
        <Select value={jobType} onValueChange={(v) => v && setJobType(v)}>
          <SelectTrigger className="h-9 text-sm rounded-xl">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            {JOB_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Remote Toggle */}
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Remote only</Label>
        <Switch checked={remoteOnly} onCheckedChange={setRemoteOnly} />
      </div>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Pagination component
// ---------------------------------------------------------------------------
const PAGE_SIZE = 20;

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  // Build a compact window: always show first/last + up to 3 around current
  const getPages = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    if (currentPage > 4) pages.push("...");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 3) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1 pt-6 pb-2 select-none">
      {/* First */}
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-30 disabled:pointer-events-none"
        aria-label="First page"
      >
        <ChevronsLeft className="h-4 w-4" />
      </button>
      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-30 disabled:pointer-events-none"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Page numbers */}
      {getPages().map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="h-8 w-8 flex items-center justify-center text-muted-foreground text-sm">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={cn(
              "h-8 w-8 rounded-lg text-sm font-medium transition-colors",
              currentPage === p
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            aria-current={currentPage === p ? "page" : undefined}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-30 disabled:pointer-events-none"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
      {/* Last */}
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-30 disabled:pointer-events-none"
        aria-label="Last page"
      >
        <ChevronsRight className="h-4 w-4" />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function JobsPage() {
  const router = useRouter();
  const { jobs, fetchJobs, isLoading, error, currentPage, totalCount, setPage } = useJobStore();
  const { addApplication } = useApplicationStore();

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const [selectedJob, setSelectedJob] = React.useState<Job | null>(null);

  // Local filter state (independent from dashboard store)
  const [keyword, setKeyword] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [industry, setIndustry] = React.useState("All Industries");
  const [experienceLevel, setExperienceLevel] = React.useState("All Levels");
  const [jobType, setJobType] = React.useState("All Types");
  const [salaryRange, setSalaryRange] = React.useState<[number, number]>([0, 500000]);
  const [remoteOnly, setRemoteOnly] = React.useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(true);

  // Debounce filter changes → always reset to page 1
  React.useEffect(() => {
    const handler = setTimeout(() => {
      fetchJobs({
        keyword: keyword || undefined,
        location: location || undefined,
        industry: industry !== "All Industries" ? industry : undefined,
        experience_level: experienceLevel !== "All Levels" ? experienceLevel : undefined,
        job_type: jobType !== "All Types" ? jobType : undefined,
        salary_min: salaryRange[0] > 0 ? salaryRange[0] : undefined,
        salary_max: salaryRange[1] < 500000 ? salaryRange[1] : undefined,
        remote: remoteOnly || undefined,
        page: 1,
        page_size: PAGE_SIZE,
      });
    }, 400);

    return () => clearTimeout(handler);
  }, [
    fetchJobs,
    keyword,
    location,
    industry,
    experienceLevel,
    jobType,
    salaryRange,
    remoteOnly,
  ]);

  // Handle page navigation (preserves current filters)
  const handlePageChange = (page: number) => {
    setPage(page);
    // also pass current filters + new page so the store's fetchJobs picks them up
    fetchJobs({
      keyword: keyword || undefined,
      location: location || undefined,
      industry: industry !== "All Industries" ? industry : undefined,
      experience_level: experienceLevel !== "All Levels" ? experienceLevel : undefined,
      job_type: jobType !== "All Types" ? jobType : undefined,
      salary_min: salaryRange[0] > 0 ? salaryRange[0] : undefined,
      salary_max: salaryRange[1] < 500000 ? salaryRange[1] : undefined,
      remote: remoteOnly || undefined,
      page,
      page_size: PAGE_SIZE,
    });
    // Scroll grid back to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetFilters = () => {
    setKeyword("");
    setLocation("");
    setIndustry("All Industries");
    setExperienceLevel("All Levels");
    setJobType("All Types");
    setSalaryRange([0, 500000]);
    setRemoteOnly(false);
  };

  const activeFilters = [
    keyword,
    location,
    industry !== "All Industries" ? industry : "",
    experienceLevel !== "All Levels" ? experienceLevel : "",
    jobType !== "All Types" ? jobType : "",
    remoteOnly ? "remote" : "",
    salaryRange[0] > 0 || salaryRange[1] < 500000 ? "salary" : "",
  ].filter(Boolean).length;

  // Local saved state for UI mock since backend bookmarks aren't fully specified
  const [savedJobs, setSavedJobs] = React.useState<string[]>([]);
  const toggleSaveJob = async (job: Job) => {
    const isSaved = savedJobs.includes(job.id);
    if (isSaved) {
      setSavedJobs(prev => prev.filter(x => x !== job.id));
    } else {
      setSavedJobs(prev => [...prev, job.id]);
      try {
        await addApplication({ job_id: job.id, status: "saved" });
      } catch (err) {
        console.error("Failed to save job:", err);
      }
    }
  };

  const uniqueJobs = React.useMemo(() => {
    const seen = new Set<string>();
    return jobs.filter((job) => {
      if (seen.has(job.id)) return false;
      seen.add(job.id);
      return true;
    });
  }, [jobs]);

  const isBackendPaginated = uniqueJobs.length < totalCount && uniqueJobs.length <= PAGE_SIZE;

  const displayedJobs = isBackendPaginated 
    ? uniqueJobs 
    : uniqueJobs.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Page Header */}
      <div className="shrink-0 pb-5 border-b mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Job Discovery</h1>
            <p className="text-muted-foreground text-sm mt-1">
              <span className="font-semibold text-foreground">{totalCount}</span> matches found
              {totalPages > 1 && (
                <span className="ml-2 text-muted-foreground/60">
                  · Page {currentPage} of {totalPages}
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {}}
              className="lg:hidden gap-2 rounded-xl"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilters > 0 && (
                <Badge className="h-5 w-5 p-0 flex items-center justify-center text-[10px] rounded-full">
                  {activeFilters}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        <div className="mt-4 lg:hidden relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs, companies, skills…"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="pl-9 h-10 rounded-xl"
          />
        </div>
      </div>

      {/* Body */}
      <div className="flex gap-8 flex-1 min-h-0 overflow-hidden relative">
        {/* Sidebar Area */}
        <div className="hidden lg:flex h-full items-center relative">
          {isFiltersOpen && (
            <FilterSidebar
              keyword={keyword}
              setKeyword={setKeyword}
              location={location}
              setLocation={setLocation}
              industry={industry}
              setIndustry={setIndustry}
              experienceLevel={experienceLevel}
              setExperienceLevel={setExperienceLevel}
              jobType={jobType}
              setJobType={setJobType}
              salaryRange={salaryRange}
              setSalaryRange={setSalaryRange}
              remoteOnly={remoteOnly}
              setRemoteOnly={setRemoteOnly}
              onReset={resetFilters}
              activeFilters={activeFilters}
            />
          )}

          {/* Toggle Button */}
          <div className={cn("flex flex-col justify-center h-full z-10", isFiltersOpen ? "-ml-4" : "mr-4")}>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="h-8 w-8 rounded-full bg-background border shadow-sm"
            >
              {isFiltersOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto pr-1 pb-8 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full">
          {error ? (
            <div className="flex flex-col items-center justify-center h-64 text-center text-red-500">
              <p className="font-medium">{error}</p>
            </div>
          ) : isLoading ? (
             <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-3" />
              <p className="font-medium">Loading jobs...</p>
            </div>
          ) : displayedJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground border border-dashed rounded-2xl">
              <Search className="h-8 w-8 mb-3 opacity-40" />
              <p className="font-medium">No jobs found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
              <Button variant="ghost" size="sm" onClick={resetFilters} className="mt-4">
                Clear filters
              </Button>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {displayedJobs.map((job: Job) => (
                  <JobGridCard
                    key={job.id}
                    job={job}
                    saved={savedJobs.includes(job.id)}
                    onSave={() => toggleSaveJob(job)}
                    onApply={() => router.push(`/application/${job.id}`)}
                    onClick={() => setSelectedJob(job)}
                  />
                ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Job Details Dialog */}
      <Dialog open={!!selectedJob} onOpenChange={(open) => !open && setSelectedJob(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
          {selectedJob && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-4 mb-2">
                  <div className="h-14 w-14 shrink-0 rounded-xl bg-muted border border-border/60 flex items-center justify-center font-bold text-2xl text-muted-foreground">
                    {selectedJob.companyLogo ?? selectedJob.company[0]}
                  </div>
                  <div>
                    <DialogTitle className="text-xl">{selectedJob.title}</DialogTitle>
                    <DialogDescription className="text-base mt-1">
                      {selectedJob.company} • {selectedJob.location}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="flex flex-wrap gap-2 py-2">
                <Badge variant="secondary" className="font-normal"><Briefcase className="h-3 w-3 mr-1" /> {selectedJob.type}</Badge>
                <Badge variant="secondary" className="font-normal"><DollarSign className="h-3 w-3 mr-1" /> {selectedJob.salary || "Not specified"}</Badge>
                {selectedJob.remote && <Badge variant="secondary" className="text-emerald-600 bg-emerald-500/10 font-normal"><Wifi className="h-3 w-3 mr-1" /> Remote</Badge>}
              </div>

              <Separator className="my-2" />

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {stripFormatting(selectedJob.description)}
                  </div>
                </div>
                
                {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Requirements</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                      {selectedJob.requirements.map((req, i) => <li key={i}>{req}</li>)}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <Button variant="outline" onClick={() => setSelectedJob(null)}>Close</Button>
                <Button onClick={() => router.push(`/application/${selectedJob.id}`)} className="bg-primary text-primary-foreground">
                  Apply Now <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
