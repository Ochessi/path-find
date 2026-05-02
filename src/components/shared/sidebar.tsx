"use client";

import { motion } from "framer-motion";
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
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="hidden w-72 flex-col border-r border-white/10 bg-slate-950/80 backdrop-blur-2xl shadow-2xl shadow-slate-950/20 md:flex"
    >
      <div className="flex h-16 items-center px-5 border-b border-white/10">
        <Link href="/dashboard" className="flex items-center gap-3 font-bold text-xl tracking-tight text-white hover:opacity-80 transition-opacity">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="h-10 w-10 rounded-2xl bg-gradient-to-br from-sky-500 via-violet-500 to-fuchsia-500 shadow-lg shadow-sky-500/30 flex items-center justify-center text-base font-black text-white"
          >
            P
          </motion.div>
          <span className="text-white">Pathfind</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item, index) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={item.href}>
                <motion.span
                  whileHover={{ x: 4 }}
                  className={cn(
                    "group flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-sky-500/10 to-violet-500/10 text-white ring-1 ring-sky-500/20 shadow-lg shadow-sky-500/10"
                      : "text-slate-300 hover:bg-white/10 hover:text-white hover:shadow-md"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 transition-all duration-200",
                      isActive ? "text-sky-400" : "text-slate-400 group-hover:text-white group-hover:scale-110"
                    )}
                  />
                  {item.name}
                </motion.span>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-3 bg-slate-950/60">
        <motion.div
          whileHover={{ y: -2 }}
          className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-3 py-3 shadow-inner shadow-slate-950/20 transition-all hover:bg-white/10 hover:border-white/20 cursor-pointer"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
          >
            <Avatar className="h-11 w-11 ring-1 ring-white/10 shadow-sm shadow-slate-950/20">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
            </Avatar>
          </motion.div>
          <div className="flex flex-col truncate">
            <span className="text-sm font-medium leading-none text-white">{user?.name ?? "Guest"}</span>
            <span className="text-xs text-slate-400 truncate">{user?.email ?? "Not signed in"}</span>
          </div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 border-white/10 text-white hover:bg-white/10 hover:border-white/20 smooth-transition"
            onClick={() => useAuthStore.getState().logout()}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </motion.div>
      </div>
    </motion.aside>
  );
}
