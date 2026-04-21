"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { NotificationDropdown } from "@/components/shared/notification-dropdown";

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/50 backdrop-blur-xl px-4 sm:px-6">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-sm hidden sm:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search jobs, skills, companies..."
            className="w-full bg-muted/50 pl-9 border-none focus-visible:ring-1"
          />
          <div className="absolute right-2 top-2 hidden md:flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <NotificationDropdown />
      </div>
    </header>
  );
}
