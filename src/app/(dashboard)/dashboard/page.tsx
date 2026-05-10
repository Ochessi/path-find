"use client";
import * as React from "react";

import { useApplicationStore } from "@/store/application.store";
import { useAuthStore } from "@/store/auth.store";
import { motion } from "framer-motion";
import {
  BarChart2,
  TrendingUp,
  Zap,
  ChevronRight,
  Sparkles,
  Clock,
  Target,
  Activity,
} from "lucide-react";
import Link from "next/link";


// ─── sub-components ────────────────────────────────────────────────────────

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-3 mb-6">
      <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <h2 className="text-base font-semibold leading-tight">{title}</h2>
        <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

// ─── 1. Application Velocity ────────────────────────────────────────────────

function ApplicationVelocityCard() {
  const { applications } = useApplicationStore();

  // Build the last 7 days of data
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dayLabels = days.map((d) => labels[d.getDay() === 0 ? 6 : d.getDay() - 1]);

  const thisWeekBars = days.map((d) => {
    const nextDay = new Date(d);
    nextDay.setDate(nextDay.getDate() + 1);
    return applications.filter((a) => {
      if (!a.appliedDate) return false;
      const ad = new Date(a.appliedDate);
      return ad >= d && ad < nextDay;
    }).length;
  });

  const lastWeekBars = days.map((d) => {
    const prevWeekDay = new Date(d);
    prevWeekDay.setDate(prevWeekDay.getDate() - 7);
    const nextDay = new Date(prevWeekDay);
    nextDay.setDate(nextDay.getDate() + 1);
    return applications.filter((a) => {
      if (!a.appliedDate) return false;
      const ad = new Date(a.appliedDate);
      return ad >= prevWeekDay && ad < nextDay;
    }).length;
  });

  const thisWeekTotal = thisWeekBars.reduce((sum, val) => sum + val, 0);
  const lastWeekTotal = lastWeekBars.reduce((sum, val) => sum + val, 0);

  const maxVal = Math.max(...thisWeekBars, ...lastWeekBars, 1);
  const delta = thisWeekTotal - lastWeekTotal;
  const pct = lastWeekTotal === 0 ? 100 : Math.round((delta / lastWeekTotal) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm"
    >
      <SectionHeader
        icon={BarChart2}
        title="Application Velocity"
        subtitle="This week vs. last week"
      />

      {/* Legend */}
      <div className="flex items-center gap-5 mb-5 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-primary inline-block" />
          This week
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-muted-foreground/30 inline-block" />
          Last week
        </span>
      </div>

      {/* Bar chart */}
      <div className="flex items-end gap-2 h-36 w-full">
        {thisWeekBars.map((val, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex items-end gap-0.5" style={{ height: "120px" }}>
              {/* Last week bar */}
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: "easeOut" }}
                style={{
                  height: `${(lastWeekBars[i] / maxVal) * 100}%`,
                  transformOrigin: "bottom",
                }}
                className="flex-1 rounded-t-md bg-muted-foreground/20"
              />
              {/* This week bar */}
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.5, delay: i * 0.07 + 0.05, ease: "easeOut" }}
                style={{
                  height: `${(val / maxVal) * 100}%`,
                  transformOrigin: "bottom",
                }}
                className="flex-1 rounded-t-md bg-primary/80"
              />
            </div>
            <span className="text-[10px] text-muted-foreground">{dayLabels[i]}</span>
          </div>
        ))}
      </div>

      {/* Summary row */}
      <div className="mt-5 flex items-center justify-between pt-4 border-t border-border/40">
        <div>
          <p className="text-2xl font-bold tabular-nums">
            {thisWeekBars.reduce((a, b) => a + b, 0)}
          </p>
          <p className="text-xs text-muted-foreground">apps this week</p>
        </div>
        <div
          className={`flex items-center gap-1 text-sm font-semibold px-2.5 py-1 rounded-full ${
            pct >= 0
              ? "bg-emerald-500/10 text-emerald-500"
              : "bg-red-500/10 text-red-500"
          }`}
        >
          <TrendingUp className="h-3.5 w-3.5" />
          {pct >= 0 ? "+" : ""}
          {pct}%
        </div>
      </div>
    </motion.div>
  );
}

// ─── 2. Conversion Funnel ───────────────────────────────────────────────────

const FUNNEL_STAGES = [
  { key: "applied",      label: "Applied",      color: "bg-blue-500",   text: "text-blue-500",   glow: "shadow-blue-500/20" },
  { key: "interviewing", label: "Interviewing",  color: "bg-violet-500", text: "text-violet-500", glow: "shadow-violet-500/20" },
  { key: "offer",        label: "Offer",         color: "bg-emerald-500",text: "text-emerald-500",glow: "shadow-emerald-500/20" },
] as const;

function ConversionFunnelCard() {
  const { applications } = useApplicationStore();

  const counts = {
    applied:      applications.filter((a) => a.status === "applied").length,
    interviewing: applications.filter((a) => a.status === "interviewing").length,
    offer:        applications.filter((a) => a.status === "offer").length,
  };

  const max = counts.applied || 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm"
    >
      <SectionHeader
        icon={Target}
        title="Conversion Funnel"
        subtitle="How applications progress through stages"
      />

      <div className="space-y-4">
        {FUNNEL_STAGES.map((stage, i) => {
          const count = counts[stage.key];
          const prevCount = i === 0 ? max : counts[FUNNEL_STAGES[i - 1].key] || 1;
          const convRate = i === 0 ? 100 : Math.round((count / prevCount) * 100);
          const barPct = (count / max) * 100;

          return (
            <div key={stage.key}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium">{stage.label}</span>
                <div className="flex items-center gap-3">
                  {i > 0 && (
                    <span className={`text-xs font-semibold ${stage.text}`}>
                      {convRate}% from prev
                    </span>
                  )}
                  <span className="text-sm font-bold tabular-nums w-5 text-right">
                    {count}
                  </span>
                </div>
              </div>
              <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${barPct}%` }}
                  transition={{ duration: 0.7, delay: i * 0.15, ease: "easeOut" }}
                  className={`h-full rounded-full ${stage.color} shadow-lg ${stage.glow}`}
                />
              </div>
              {i < FUNNEL_STAGES.length - 1 && (
                <div className="flex justify-center mt-2">
                  <ChevronRight className="h-4 w-4 text-muted-foreground rotate-90" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Overall rate */}
      <div className="mt-5 pt-4 border-t border-border/40 flex items-center gap-3">
        <Activity className="h-4 w-4 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">
          Overall offer rate:{" "}
          <span className="font-semibold text-foreground">
            {counts.applied > 0
              ? Math.round((counts.offer / counts.applied) * 100)
              : 0}
            %
          </span>{" "}
          of applied → offer
        </p>
      </div>
    </motion.div>
  );
}

// ─── 3. AI Time Saved ───────────────────────────────────────────────────────

const MINS_PER_RESUME    = 45;
const MINS_PER_COVER     = 30;
const MINS_PER_TAILORING = 20;

function AiTimeSavedCard() {
  const { applications } = useApplicationStore();

  const aiApps = applications.filter(
    (a) => a.aiResume || a.aiCoverLetter
  ).length;

  const totalMins =
    aiApps * (MINS_PER_RESUME + MINS_PER_COVER + MINS_PER_TAILORING);
  const hours = Math.floor(totalMins / 60);
  const mins  = totalMins % 60;

  // Fun equivalents
  const coffees    = Math.floor(totalMins / 5);
  const episodes   = Math.floor(totalMins / 45);

  const milestones = [
    { threshold: 2,  label: "Getting started", icon: "🌱" },
    { threshold: 5,  label: "Building momentum", icon: "🔥" },
    { threshold: 10, label: "Power user", icon: "⚡" },
    { threshold: 20, label: "AI champion", icon: "🏆" },
  ];
  const milestone = [...milestones].reverse().find((m) => hours >= m.threshold) ?? milestones[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm lg:col-span-1"
    >
      <SectionHeader
        icon={Sparkles}
        title="AI Time Saved"
        subtitle="Hours reclaimed thanks to AI automation"
      />

      {/* Hero number */}
      <div className="relative flex flex-col items-center py-6">
        {/* Glow rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-32 w-32 rounded-full bg-primary/5 animate-pulse" />
          <div className="absolute h-24 w-24 rounded-full bg-primary/8" />
        </div>

        <motion.p
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
          className="relative text-6xl font-black tracking-tighter text-primary tabular-nums"
        >
          {hours}
          <span className="text-2xl font-bold text-muted-foreground">h </span>
          {mins}
          <span className="text-2xl font-bold text-muted-foreground">m</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-3 flex items-center gap-1.5 bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-semibold"
        >
          <span className="text-base">{milestone.icon}</span>
          {milestone.label}
        </motion.div>
      </div>

      {/* Fun equivalents */}
      <div className="grid grid-cols-2 gap-3 mt-2">
        <div className="flex flex-col items-center gap-1 bg-muted/50 rounded-xl p-3">
          <span className="text-2xl">☕</span>
          <span className="text-xl font-bold tabular-nums">{coffees}</span>
          <span className="text-[10px] text-muted-foreground text-center leading-tight">
            coffees you could have enjoyed
          </span>
        </div>
        <div className="flex flex-col items-center gap-1 bg-muted/50 rounded-xl p-3">
          <span className="text-2xl">📺</span>
          <span className="text-xl font-bold tabular-nums">{episodes}</span>
          <span className="text-[10px] text-muted-foreground text-center leading-tight">
            episodes you could have watched
          </span>
        </div>
      </div>

      {/* Breakdown */}
      <div className="mt-4 pt-4 border-t border-border/40 space-y-2 text-xs">
        {[
          { label: "AI Resume tailoring",   mins: MINS_PER_RESUME,    count: aiApps },
          { label: "AI Cover letter",        mins: MINS_PER_COVER,     count: aiApps },
          { label: "Manual research saved",  mins: MINS_PER_TAILORING, count: aiApps },
        ].map((row) => (
          <div key={row.label} className="flex items-center justify-between text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3 w-3" />
              {row.label}
            </span>
            <span className="font-semibold text-foreground">
              {row.mins * row.count} min
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── 4. Quick-stats strip ───────────────────────────────────────────────────

function QuickStatStrip() {
  const { applications } = useApplicationStore();
  const total     = applications.length;
  const active    = applications.filter((a) => !["saved", "rejected"].includes(a.status)).length;
  const aiApps    = applications.filter((a) => a.aiResume || a.aiCoverLetter).length;
  const responses = applications.filter((a) => a.status === "interviewing" || a.status === "offer").length;
  const responseRate = total > 0 ? Math.round((responses / total) * 100) : 0;

  const stats = [
    { label: "Total Applications", value: total,         color: "text-foreground" },
    { label: "Active Pipeline",    value: active,        color: "text-blue-500" },
    { label: "AI-Powered",         value: `${aiApps}`,   color: "text-violet-500" },
    { label: "Response Rate",      value: `${responseRate}%`, color: "text-emerald-500" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.06 }}
          className="bg-card border border-border/60 rounded-xl px-4 py-3 shadow-sm"
        >
          <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function OverviewPage() {
  const { user } = useAuthStore();
  const { fetchApplications } = useApplicationStore();
  const firstName = (user?.full_name && typeof user.full_name === "string")
    ? user.full_name.split(" ")[0] || "there"
    : "there";

  React.useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return (
    <div className="space-y-6 pb-10">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-3"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {firstName} 👋
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Here&apos;s how your job search is performing.
          </p>
        </div>
        <Link
          href="/applications"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          View all applications
          <ChevronRight className="h-4 w-4" />
        </Link>
      </motion.div>

      {/* Quick stats */}
      <QuickStatStrip />

      {/* 3-column analytics grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <ApplicationVelocityCard />
        <ConversionFunnelCard />
        <AiTimeSavedCard />
      </div>

      {/* Footer hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2"
      >
        <Zap className="h-3.5 w-3.5" />
        Metrics update in real time as you manage your applications.
      </motion.div>
    </div>
  );
}
