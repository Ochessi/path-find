"use client";

import * as React from "react";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";

import { useApplicationStore } from "@/store/application.store";
import { ApplicationStatus } from "@/types";
import { KanbanCard } from "./kanban-card";

const COLUMNS: { id: ApplicationStatus; title: string; color: string }[] = [
  { id: "saved", title: "Saved", color: "bg-slate-500/10 text-slate-700 dark:text-slate-300" },
  { id: "applied", title: "Applied", color: "bg-blue-500/10 text-blue-700 dark:text-blue-300" },
  { id: "interviewing", title: "Interviewing", color: "bg-violet-500/10 text-violet-700 dark:text-violet-300" },
  { id: "offer", title: "Offer", color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" },
  { id: "rejected", title: "Rejected", color: "bg-orange-500/10 text-orange-700 dark:text-orange-300" },
];

interface KanbanBoardProps {
  searchTerm: string;
}

export function KanbanBoard({ searchTerm }: KanbanBoardProps) {
  const { applications, updateStatus } = useApplicationStore();

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const filteredApplications = React.useMemo(() => {
    if (!searchTerm) return applications;
    const term = searchTerm.toLowerCase();
    return applications.filter(
      (app) =>
        app.job.title.toLowerCase().includes(term) ||
        app.job.company.toLowerCase().includes(term)
    );
  }, [applications, searchTerm]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as ApplicationStatus;
    updateStatus(draggableId, newStatus);
  };

  if (!mounted) return null; // Prevent hydration mismatch with drag and drop

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex h-full gap-6 overflow-x-auto pb-4 snap-x">
        {COLUMNS.map((column) => {
          const columnApps = filteredApplications.filter(
            (app) => app.status === column.id
          );

          return (
            <div
              key={column.id}
              className="flex flex-col min-w-[320px] max-w-[320px] snap-center"
            >
              <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{column.title}</h3>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${column.color}`}>
                    {columnApps.length}
                  </span>
                </div>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 rounded-2xl p-3 min-h-[150px] transition-colors border-2 ${
                      snapshot.isDraggingOver
                        ? "bg-muted/50 border-primary/20 border-dashed"
                        : "bg-muted/20 border-transparent"
                    }`}
                  >
                    <div className="flex flex-col gap-3">
                      {columnApps.map((app, index) => (
                        <KanbanCard key={app.id} application={app} index={index} />
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
