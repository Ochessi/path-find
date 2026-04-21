"use client";

import * as React from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Clock, MoreHorizontal, Building2 } from "lucide-react";
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
  applied: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  interviewing: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
  offer: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  rejected: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
};

export function KanbanCard({ application, index }: KanbanCardProps) {
  const { job } = application;

  return (
    <Draggable draggableId={application.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-4 rounded-xl border bg-card transition-shadow ${
            snapshot.isDragging ? "shadow-lg ring-1 ring-primary/20" : "hover:border-primary/20 hover:shadow-sm"
          }`}
        >
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 shrink-0 rounded-lg bg-background border flex items-center justify-center font-bold text-muted-foreground">
                {job.companyLogo || job.company[0]}
              </div>
              <div>
                <h4 className="font-semibold text-sm leading-tight line-clamp-1 p-0.5">
                  {job.title}
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                  <Building2 className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{job.company}</span>
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger className="h-8 w-8 -mr-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground shrink-0 inline-flex flex-col items-center justify-center outline-none">
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
              <p className="text-xs text-muted-foreground line-clamp-2 bg-muted/50 p-2 rounded-md">
                {application.notes}
              </p>
            )}

            <div className="flex items-center justify-between mt-4">
              <Badge variant="outline" className={`capitalize text-[10px] font-semibold px-2 py-0 border ${statusColors[application.status]}`}>
                {application.status}
              </Badge>
              
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>
                  {application.appliedDate
                    ? formatDistanceToNow(parseISO(application.appliedDate), {
                        addSuffix: true,
                      })
                    : application.lastActivity}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
