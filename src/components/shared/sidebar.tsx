"use client";

import { useAuthStore } from "@/store/auth.store";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Settings,
  HelpCircle,
  Search,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Job Discovery", href: "/jobs", icon: Search },
  { name: "Applications", href: "/applications", icon: Briefcase },
  { name: "Profile", href: "/profile", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Help", href: "/help", icon: HelpCircle },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  return (
    <aside className="hidden w-72 flex-col border-r border-white/10 bg-slate-950/80 backdrop-blur-2xl shadow-2xl shadow-slate-950/20 md:flex">
      <div className="flex h-16 items-center px-5 border-b border-white/10">
        <Link href="/dashboard" className="flex items-center gap-3 font-bold text-xl tracking-tight text-white">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-sky-500 via-violet-500 to-fuchsia-500 shadow-lg shadow-sky-500/20 flex items-center justify-center text-base font-black text-white">
            P
          </div>
          <span className="text-white">Pathfind</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link key={item.name} href={item.href}>
              <span
                className={cn(
                  "group flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-sky-500/10 to-violet-500/10 text-white ring-1 ring-sky-500/20"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5",
                    isActive ? "text-sky-400" : "text-slate-400 group-hover:text-white"
                  )}
                />
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-3 bg-slate-950/60">
        <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-3 py-3 shadow-inner shadow-slate-950/20 transition-all hover:bg-white/10">
          <Avatar className="h-11 w-11 ring-1 ring-white/10 shadow-sm shadow-slate-950/20">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col truncate">
            <span className="text-sm font-medium leading-none text-white">{user?.name ?? "Guest"}</span>
            <span className="text-xs text-slate-400 truncate">{user?.email ?? "Not signed in"}</span>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-2 border-white/10 text-white hover:bg-white/10"
          onClick={() => useAuthStore.getState().logout()}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
