"use client";

import { motion } from "framer-motion";
import { Target, CheckCircle2, Calendar, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useApplicationStore } from "@/store/application.store";

export function StatsCards() {
  const { applications } = useApplicationStore();

  const totalApplications = applications.length;
  const activePipeline = applications.filter((a) => !["saved", "rejected"].includes(a.status)).length;
  const aiPowered = applications.filter((a) => a.aiResume || a.aiCoverLetter).length;
  const interviewsCount = applications.filter((a) => a.status === "interviewing").length;
  const responseRate = totalApplications > 0 ? Math.round((applications.filter((a) => a.status === "interviewing" || a.status === "offer").length / totalApplications) * 100) : 0;
  const avgMatch = totalApplications
    ? Math.round(applications.reduce((sum, a) => sum + (a.job.matchScore ?? 0), 0) / totalApplications)
    : 0;

  const stats = [
    {
      title: "Avg Match Score",
      value: `${avgMatch}%`,
      description: avgMatch >= 80 ? "+5% from last week" : "Stay focused on high-fit roles",
      icon: Target,
      color: "text-sky-500",
      ring: "from-sky-500 via-cyan-500 to-teal-500",
      progress: avgMatch / 100,
    },
    {
      title: "AI Applications",
      value: `${aiPowered}`,
      description: `${Math.max(aiPowered - 2, 1)} powered by AI, ${activePipeline} active in pipeline`,
      icon: CheckCircle2,
      color: "text-fuchsia-500",
      ring: "from-fuchsia-500 via-pink-500 to-rose-500",
      progress: Math.min(aiPowered / 16, 1),
    },
    {
      title: "Interviews",
      value: `${interviewsCount}`,
      description: "Live conversations in progress",
      icon: Calendar,
      color: "text-violet-500",
      ring: "from-violet-500 via-purple-500 to-fuchsia-500",
      progress: Math.min(interviewsCount / 8, 1),
    },
    {
      title: "Response Rate",
      value: `${responseRate}%`,
      description: responseRate >= 30 ? "Above average" : "Room to improve",
      icon: TrendingUp,
      color: "text-emerald-500",
      ring: "from-emerald-500 via-lime-500 to-teal-500",
      progress: responseRate / 100,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.08 }}
        >
          <Card className="overflow-hidden border-0 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)]">
            <CardContent className="p-6 bg-slate-950/95 border border-white/10">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold tracking-tight mt-3 text-white">{stat.value}</p>
                </div>
                <div className="relative h-11 w-11 rounded-full overflow-hidden">
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${stat.ring} opacity-90`} />
                  <div className="absolute inset-1 rounded-full bg-slate-950/90 shadow-inner" />
                  <motion.svg
                    viewBox="0 0 40 40"
                    className="absolute inset-0 h-11 w-11"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
                  >
                    <circle
                      cx="20"
                      cy="20"
                      r="15.5"
                      stroke="rgba(255,255,255,0.12)"
                      strokeWidth="3"
                      fill="none"
                    />
                    <motion.circle
                      cx="20"
                      cy="20"
                      r="15.5"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                      strokeDasharray="97.4"
                      strokeDashoffset={97.4}
                      style={{ rotate: -90, transformOrigin: "center" }}
                      initial={{ strokeDashoffset: 97.4 }}
                      animate={{ strokeDashoffset: 97.4 * (1 - Math.max(stat.progress, 0.08)) }}
                      transition={{ duration: 0.9, ease: "easeOut" }}
                    />
                  </motion.svg>
                  <div className="relative z-10 flex h-full w-full items-center justify-center">
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </div>
              <p className="mt-5 text-xs text-muted-foreground leading-relaxed">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
