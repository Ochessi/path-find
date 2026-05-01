"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { NotificationDropdown } from "@/components/shared/notification-dropdown";

export function Topbar() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl px-4 sm:px-6 shadow-sm shadow-slate-950/10">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            type="search"
            placeholder="Search jobs, skills, companies..."
            className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-11 py-3 text-slate-100 placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-sky-400/50"
          />
          <div className="absolute right-3 top-3 hidden md:flex h-5 items-center gap-1 rounded-full border border-white/10 px-2 text-[10px] font-mono font-medium text-slate-400">
            <span className="text-xs">⌘</span>K
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <NotificationDropdown />
      </div>
    </header>
  );
}
