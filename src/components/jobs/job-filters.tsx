"use client";

import { useJobStore } from "@/store/job.store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Search, MapPin, Sparkles, Wand2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function JobFilters() {
  const { filters, setFilters, resetFilters } = useJobStore();

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full bg-background pb-4 pt-2 border-b mb-4">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Software Engineer" 
          className="pl-9 bg-card border-muted/60"
        />
      </div>

      {/* Location Input */}
      <div className="relative flex-1 min-w-[150px]">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Anywhere" 
          className="pl-9 bg-card border-muted/60"
        />
      </div>

      {/* Filters Button */}
      <Button variant="outline" className="gap-2 bg-card border-muted/60">
        <Filter className="h-4 w-4" />
        Filters
        <Badge className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 font-normal">1</Badge>
      </Button>

      {/* Describe Search (AI) */}
      <Button variant="outline" className="gap-2 bg-card border-muted/60">
        <Sparkles className="h-4 w-4 text-amber-500" />
        Describe your search
      </Button>

      <div className="mx-2 w-px h-6 bg-border hidden lg:block" />

      {/* Experience Level Dropdown */}
      <Select 
        value={(filters.experienceLevel || "any") as string} 
        onValueChange={(val) => setFilters({ experienceLevel: val === "any" || val === null ? "" : val })}
      >
        <SelectTrigger className="w-[140px] bg-card border-muted/60">
          <SelectValue placeholder="Job Board" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="any">Job Board</SelectItem>
          <SelectItem value="Entry">Entry level</SelectItem>
          <SelectItem value="Mid">Mid level</SelectItem>
          <SelectItem value="Senior">Senior</SelectItem>
        </SelectContent>
      </Select>
      
      {/* Reset/Skipped */}
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={resetFilters}
        className="text-muted-foreground hover:text-foreground"
      >
        Reset
      </Button>
    </div>
  );
}
