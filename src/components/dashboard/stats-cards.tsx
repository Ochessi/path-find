"use client";

import { motion } from "framer-motion";
import { Target, CheckCircle2, Calendar, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function StatsCards() {
  const stats = [
    {
      title: "Avg Match Score",
      value: "86%",
      description: "+2% from last week",
      icon: Target,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "AI Applications",
      value: "34",
      description: "12 sent this week",
      icon: CheckCircle2,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      title: "Interviews",
      value: "4",
      description: "2 scheduled this week",
      icon: Calendar,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "Response Rate",
      value: "28%",
      description: "+5% from average",
      icon: TrendingUp,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
        >
          <Card className="border-muted shadow-sm overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-1">
                <span className="text-3xl font-bold tracking-tight">{stat.value}</span>
                <span className="text-xs text-muted-foreground">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
