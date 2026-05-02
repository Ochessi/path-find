"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Clock, MoreHorizontal, Building2, Sparkles } from "lucide-react";
import { Draggable } from "@hello-pangea/dnd";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Application, ApplicationStatus } from "@/types";

interface KanbanCardProps {
  application: Application;
  index: number;
}

const statusColors: Record<ApplicationStatus, string> = {
  saved: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
  applied: "status-badge-applied",
  interviewing: "status-badge-interviewing",
  offer: "status-badge-offer",
  rejected: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
};

export function KanbanCard({ application, index }: KanbanCardProps) {
  const { job } = application;
  const hasAI = application.aiResume || application.aiCoverLetter;

  return (
    <Draggable draggableId={application.id} index={index}>
      {(provided, snapshot) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={!snapshot.isDragging ? { y: -4 } : {}}
          className={`p-4 rounded-xl border bg-card transition-all ${
            snapshot.isDragging
              ? "shadow-lg ring-2 ring-primary/40 scale-105"
              : "hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5"
          }`}
        >
          {/* Accent bar */}
          <div className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-primary via-primary/50 to-transparent rounded-t-xl w-full" />

          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-3">
              <motion.div
                className="h-10 w-10 shrink-0 rounded-lg bg-gradient-to-br from-sky-400 to-violet-500 border border-primary/20 flex items-center justify-center font-bold text-white shadow-sm"
                whileHover={{ scale: 1.1 }}
              >
                {job.companyLogo || job.company[0]}
              </motion.div>
              <div>
                <h4 className="font-semibold text-sm leading-tight line-clamp-1 p-0.5 group-hover:text-primary transition-colors">
                  {job.title}
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                  <Building2 className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{job.company}</span>
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger className="h-8 w-8 -mr-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-110 shrink-0 inline-flex flex-col items-center justify-center outline-none transition-all duration-200">
                <MoreHorizontal className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 rounded-xl">
                <DropdownMenuItem>View Details</DropdownMenuItem>
                <DropdownMenuItem>Edit Notes</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-3">
            {application.notes && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-muted-foreground line-clamp-2 bg-muted/50 p-2.5 rounded-lg border border-muted/50 hover:border-primary/20 hover:bg-muted/70 transition-all duration-200"
              >
                {application.notes}
              </motion.p>
            )}

            {hasAI && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-violet-500/10 text-violet-600 border border-violet-500/20 w-fit"
              >
                <Sparkles className="h-3 w-3" />
                <span className="font-semibold">AI-powered</span>
              </motion.div>
            )}

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/40">
              <Badge
                variant="outline"
                className={`capitalize text-[10px] font-semibold px-2 py-1 border smooth-transition-fast ${statusColors[application.status]}`}
              >
                {application.status}
              </Badge>

              <motion.div
                className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                whileHover={{ x: 2 }}
              >
                <Clock className="h-3 w-3" />
                <span>
                  {application.appliedDate
                    ? formatDistanceToNow(parseISO(application.appliedDate), {
                        addSuffix: true,
                      })
                    : application.lastActivity}
                </span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </Draggable>
  );
}
