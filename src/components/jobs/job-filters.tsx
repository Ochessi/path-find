"use client";

import { useJobStore } from "@/store/job.store";
import { Input } from "@/components/ui/input";
import { 

  Search, MapPin, Sparkles, Filter, X, 
  Calendar, Home, TrendingUp, Briefcase, 
  DollarSign, Building2, Factory, Check
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export function JobFilters() {
  const { filters, setFilters, resetFilters } = useJobStore();
  const [postedDate, setPostedDate] = useState("any");
  const [includeUnknownLocation, setIncludeUnknownLocation] = useState(true);
  const [includeUnknownSalary, setIncludeUnknownSalary] = useState(true);

  return (
    <div className="flex items-center justify-end gap-3 w-full bg-background pb-4 pt-2 border-b border-border/40 mb-4 overflow-x-auto scrollbar-hide">
      {/* Search Input */}
      <div className="relative flex min-w-[220px] items-center">
        <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Software Engineer" 
          className="pl-9 pr-9 h-9 bg-card/50 border-border/50 rounded-full text-sm font-medium focus-visible:ring-1 focus-visible:ring-border"
        />
        <button className="absolute right-3.5 text-muted-foreground hover:text-foreground">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Location Input */}
      <div className="relative flex min-w-[160px] items-center">
        <MapPin className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Anywhere" 
          className="pl-9 h-9 bg-card/50 border-border/50 rounded-full text-sm font-medium focus-visible:ring-1 focus-visible:ring-border"
        />
      </div>

      {/* Filters Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 border gap-2 h-9 rounded-full bg-card/50 border-border/50 px-4 text-sm text-muted-foreground hover:bg-card/80 hover:text-foreground font-medium flex-shrink-0 focus-visible:ring-0">
          <Filter className="h-4 w-4" />
          Filters
          <Badge className="ml-0.5 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-emerald-500/10 text-emerald-500 font-medium border-0">1</Badge>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 p-2 bg-[#0c0c0d] border-[#222] text-muted-foreground shadow-xl rounded-xl">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex gap-2 items-center focus:bg-accent/50 focus:text-accent-foreground py-2.5 rounded-lg cursor-pointer">
              <Calendar className="h-4 w-4 text-muted-foreground/70" />
              <span className="flex-1">Posted Date</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent sideOffset={8} className="w-48 bg-[#0c0c0d] border-[#222] shadow-xl rounded-xl p-2 z-50">
              {['any', '24h', 'week', 'month'].map((val) => (
                <DropdownMenuItem 
                  key={val}
                  onClick={(e) => {
                    e.preventDefault();
                    setPostedDate(val);
                  }}
                  className="flex gap-2 items-center py-2 focus:bg-accent/50 rounded-lg cursor-pointer"
                >
                  <div className="w-4 flex items-center justify-center">
                    {postedDate === val && <div className="h-1.5 w-1.5 rounded-full bg-foreground" />}
                  </div>
                  <span>{val === 'any' ? 'Any time' : val === '24h' ? 'Past 24 hours' : val === 'week' ? 'Past week' : 'Past month'}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex gap-2 items-center focus:bg-accent/50 focus:text-accent-foreground py-2.5 rounded-lg cursor-pointer">
              <Home className="h-4 w-4 text-muted-foreground/70" />
              <span className="flex-1">Work Location</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-48 bg-[#0c0c0d] border-[#222] shadow-xl rounded-xl p-2 z-50">
              <DropdownMenuItem className="py-2 focus:bg-accent/50 rounded-lg cursor-pointer pl-8">Remote</DropdownMenuItem>
              <DropdownMenuItem className="py-2 focus:bg-accent/50 rounded-lg cursor-pointer pl-8">On-site</DropdownMenuItem>
              <DropdownMenuItem className="py-2 focus:bg-accent/50 rounded-lg cursor-pointer pl-8">Hybrid</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex gap-2 items-center focus:bg-accent/50 focus:text-accent-foreground py-2.5 rounded-lg cursor-pointer">
              <TrendingUp className="h-4 w-4 text-muted-foreground/70" />
              <span className="flex-1">Experience</span>
              <Badge className="ml-auto h-5 w-5 rounded-full p-0 flex items-center justify-center bg-gray-500/20 text-gray-300 font-medium border-0">1</Badge>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-48 bg-[#0c0c0d] border-[#222] shadow-xl rounded-xl p-2 z-50">
              <DropdownMenuItem className="py-2 focus:bg-accent/50 rounded-lg cursor-pointer pl-8">Entry Level</DropdownMenuItem>
              <DropdownMenuItem className="py-2 focus:bg-accent/50 rounded-lg cursor-pointer pl-8">Mid Level</DropdownMenuItem>
              <DropdownMenuItem className="py-2 focus:bg-accent/50 rounded-lg cursor-pointer pl-8">Senior</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex gap-2 items-center focus:bg-accent/50 focus:text-accent-foreground py-2.5 rounded-lg cursor-pointer">
              <Briefcase className="h-4 w-4 text-muted-foreground/70" />
              <span className="flex-1">Job Type</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-48 bg-[#0c0c0d] border-[#222] shadow-xl rounded-xl p-2 z-50">
              <DropdownMenuItem className="py-2 focus:bg-accent/50 rounded-lg cursor-pointer pl-8">Full-time</DropdownMenuItem>
              <DropdownMenuItem className="py-2 focus:bg-accent/50 rounded-lg cursor-pointer pl-8">Part-time</DropdownMenuItem>
              <DropdownMenuItem className="py-2 focus:bg-accent/50 rounded-lg cursor-pointer pl-8">Contract</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex gap-2 items-center focus:bg-accent/50 focus:text-accent-foreground py-2.5 rounded-lg cursor-pointer">
              <DollarSign className="h-4 w-4 text-muted-foreground/70" />
              <span className="flex-1">Salary</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-48 bg-[#0c0c0d] border-[#222] shadow-xl rounded-xl p-2 z-50">
               <DropdownMenuItem className="py-2 focus:bg-accent/50 rounded-lg cursor-pointer pl-8">$50k - $100k</DropdownMenuItem>
               <DropdownMenuItem className="py-2 focus:bg-accent/50 rounded-lg cursor-pointer pl-8">$100k - $150k</DropdownMenuItem>
               <DropdownMenuItem className="py-2 focus:bg-accent/50 rounded-lg cursor-pointer pl-8">$150k+</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex gap-2 items-center focus:bg-accent/50 focus:text-accent-foreground py-2.5 rounded-lg cursor-pointer">
              <Building2 className="h-4 w-4 text-muted-foreground/70" />
              <span className="flex-1">Company</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-48 bg-[#0c0c0d] border-[#222] shadow-xl rounded-xl p-2 z-50">
               <DropdownMenuItem className="py-2 focus:bg-accent/50 rounded-lg cursor-pointer pl-8">Startups</DropdownMenuItem>
               <DropdownMenuItem className="py-2 focus:bg-accent/50 rounded-lg cursor-pointer pl-8">Enterprise</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex gap-2 items-center focus:bg-accent/50 focus:text-accent-foreground py-2.5 rounded-lg cursor-pointer">
              <Factory className="h-4 w-4 text-muted-foreground/70" />
              <span className="flex-1">Industry</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-48 bg-[#0c0c0d] border-[#222] shadow-xl rounded-xl p-2 z-50">
               <DropdownMenuItem className="py-2 focus:bg-accent/50 rounded-lg cursor-pointer pl-8">Tech</DropdownMenuItem>
               <DropdownMenuItem className="py-2 focus:bg-accent/50 rounded-lg cursor-pointer pl-8">Finance</DropdownMenuItem>
               <DropdownMenuItem className="py-2 focus:bg-accent/50 rounded-lg cursor-pointer pl-8">Healthcare</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator className="bg-[#222] my-2" />

          <DropdownMenuItem 
            className="flex gap-2 items-center py-2 focus:bg-accent/50 rounded-lg cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              setIncludeUnknownLocation(!includeUnknownLocation);
            }}
          >
            <div className="w-4 flex items-center justify-center">
              {includeUnknownLocation && <Check className="h-4 w-4" />}
            </div>
            <span className="flex-1 text-[13px]">Include unknown work location</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="flex gap-2 items-center py-2 focus:bg-accent/50 rounded-lg cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              setIncludeUnknownSalary(!includeUnknownSalary);
            }}
          >
            <div className="w-4 flex items-center justify-center">
              {includeUnknownSalary && <Check className="h-4 w-4" />}
            </div>
            <span className="flex-1 text-[13px]">Include unknown salary</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-[#222] my-2" />
          
          <DropdownMenuItem className="flex gap-2 items-center py-2.5 focus:bg-accent/50 focus:text-accent-foreground rounded-lg cursor-pointer">
            <Sparkles className="h-4 w-4 text-muted-foreground/70" />
            <span className="flex-1">Describe your search</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-[#222] my-2" />
          
          <DropdownMenuItem onClick={resetFilters} className="flex gap-2 items-center text-red-500 focus:text-red-400 focus:bg-red-500/10 py-2.5 rounded-lg cursor-pointer">
            <X className="h-4 w-4" />
            <span className="flex-1">Clear all filters</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
