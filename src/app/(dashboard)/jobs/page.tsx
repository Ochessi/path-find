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
  X,
  DollarSign,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useJobStore } from "@/store/job.store";
import { Job } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
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
// Job Card (grid variant)
// ---------------------------------------------------------------------------
function JobGridCard({
  job,
  saved,
  onSave,
  onApply,
}: {
  job: Job;
  saved: boolean;
  onSave: () => void;
  onApply: () => void;
}) {
  const tier = matchTier(job.matchScore);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="group relative flex flex-col bg-card border border-border/60 rounded-2xl p-5 hover:border-primary/40 hover:shadow-md transition-all duration-200"
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
        {job.description}
      </p>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {job.skills.slice(0, 4).map((skill) => (
          <Badge
            key={skill}
            variant="secondary"
            className="text-[11px] px-2 py-0.5 rounded-lg"
          >
            {skill}
          </Badge>
        ))}
        {job.skills.length > 4 && (
          <Badge variant="outline" className="text-[11px] px-2 py-0.5 rounded-lg text-muted-foreground">
            +{job.skills.length - 4}
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
          onClick={onApply}
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
          onValueChange={(v) => setSalaryRange(v as [number, number])}
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
export default function JobsPage() {
  const router = useRouter();
  const { jobs, savedJobs, toggleSaveJob } = useJobStore();

  const [keyword, setKeyword] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [industry, setIndustry] = React.useState("All Industries");
  const [experienceLevel, setExperienceLevel] = React.useState("All Levels");
  const [jobType, setJobType] = React.useState("All Types");
  const [salaryRange, setSalaryRange] = React.useState<[number, number]>([0, 500000]);
  const [remoteOnly, setRemoteOnly] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<"match" | "recent" | "salary">("match");

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

  const filtered = React.useMemo(() => {
    let result = [...jobs];

    if (keyword) {
      const kw = keyword.toLowerCase();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(kw) ||
          j.company.toLowerCase().includes(kw) ||
          j.skills.some((s) => s.toLowerCase().includes(kw))
      );
    }
    if (location) {
      result = result.filter((j) =>
        j.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    if (industry && industry !== "All Industries") {
      result = result.filter((j) => j.industry === industry);
    }
    if (experienceLevel && experienceLevel !== "All Levels") {
      result = result.filter((j) => j.experienceLevel === experienceLevel);
    }
    if (jobType && jobType !== "All Types") {
      result = result.filter((j) => j.type === jobType);
    }
    if (remoteOnly) {
      result = result.filter((j) => j.remote);
    }

    result.sort((a, b) => {
      if (sortBy === "match") return b.matchScore - a.matchScore;
      if (sortBy === "recent") return a.postedDate.localeCompare(b.postedDate);
      if (sortBy === "salary") {
        const parseSalary = (salary: string) => {
          const numbers = salary.match(/\d+/g);
          return numbers ? Number(numbers[0]) : 0;
        };
        return parseSalary(b.salary) - parseSalary(a.salary);
      }
      return 0;
    });

    return result;
  }, [jobs, keyword, location, industry, experienceLevel, jobType, remoteOnly, sortBy]);

  const handleToggleSave = (jobId: string) => {
    toggleSaveJob(jobId);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Page Header */}
      <div className="shrink-0 pb-5 border-b mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Job Discovery</h1>
            <p className="text-muted-foreground text-sm mt-1">
              <span className="font-semibold text-foreground">{filtered.length}</span> curated matches based on your profile
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

            <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
              <SelectTrigger className="h-9 w-[140px] rounded-xl text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="match">Best Match</SelectItem>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="salary">Salary</SelectItem>
              </SelectContent>
            </Select>
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

      <div className="flex gap-8 flex-1 min-h-0 overflow-hidden">
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

        <div className="flex-1 overflow-y-auto pr-1 pb-8 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full">
          {filtered.length === 0 ? (
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
                {filtered.map((job: Job) => (
                  <JobGridCard
                    key={job.id}
                    job={job}
                    saved={savedJobs.includes(job.id)}
                    onSave={() => handleToggleSave(job.id)}
                    onApply={() => router.push(`/application/${job.id}`)}
                  />
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
