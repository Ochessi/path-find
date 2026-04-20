"use client";

import { useJobStore } from "@/store/job.store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilterX } from "lucide-react";

export function JobFilters() {
  const { filters, setFilters, resetFilters } = useJobStore();

  const handleSalaryChange = (val: number | readonly number[]) => {
    setFilters({ salaryMin: (val as number[])[0] });
  };

  return (
    <div className="flex flex-col gap-6 sticky top-20">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold tracking-tight">Filters</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={resetFilters}
          className="h-8 text-xs text-muted-foreground hover:text-foreground"
        >
          <FilterX className="h-3 w-3 mr-1" />
          Reset
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs">Date Posted</Label>
          <Select defaultValue="any">
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Any time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any time</SelectItem>
              <SelectItem value="past-24h">Past 24 hours</SelectItem>
              <SelectItem value="past-week">Past week</SelectItem>
              <SelectItem value="past-month">Past month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Experience Level</Label>
          <Select 
            value={(filters.experienceLevel || "any") as string} 
            onValueChange={(val) => setFilters({ experienceLevel: val === "any" || val === null ? "" : val })}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Any level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any level</SelectItem>
              <SelectItem value="Entry">Entry level</SelectItem>
              <SelectItem value="Mid">Mid level</SelectItem>
              <SelectItem value="Senior">Senior</SelectItem>
              <SelectItem value="Lead">Lead</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Job Type</Label>
          <Select 
            value={(filters.jobType || "any") as string} 
            onValueChange={(val) => setFilters({ jobType: val === "any" || val === null ? "" : val })}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Any type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any type</SelectItem>
              <SelectItem value="Full-time">Full-time</SelectItem>
              <SelectItem value="Contract">Contract</SelectItem>
              <SelectItem value="Part-time">Part-time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Min Salary</Label>
            <span className="text-xs font-medium">${filters.salaryMin}k</span>
          </div>
          <Slider 
            value={[filters.salaryMin || 0]} 
            max={250} 
            step={10} 
            onValueChange={handleSalaryChange} 
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <Label className="text-xs cursor-pointer" htmlFor="remote">Remote Only</Label>
          <Switch 
            id="remote" 
            checked={filters.remote} 
            onCheckedChange={(checked) => setFilters({ remote: checked })}
          />
        </div>
      </div>
    </div>
  );
}
