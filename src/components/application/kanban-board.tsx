"use client";

import * as React from "react";
import { motion } from "framer-motion";
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

  if (!mounted) return null;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex h-full gap-6 overflow-x-auto pb-4 snap-x">
        {COLUMNS.map((column, columnIndex) => {
          const columnApps = filteredApplications.filter(
            (app) => app.status === column.id
          );

          return (
            <motion.div
              key={column.id}
              className="flex flex-col min-w-[320px] max-w-[320px] snap-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: columnIndex * 0.1, duration: 0.4 }}
            >
              {/* Column Header */}
              <motion.div
                className="flex items-center justify-between mb-4 px-1"
                whileHover={{ y: -2 }}
              >
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-sm tracking-tight">{column.title}</h3>
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`text-xs font-bold px-2.5 py-1 rounded-full transition-all duration-300 ${column.color} border border-current/20`}
                  >
                    {columnApps.length}
                  </motion.span>
                </div>
              </motion.div>

              {/* Droppable Area */}
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <motion.div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    animate={{
                      backgroundColor: snapshot.isDraggingOver
                        ? "var(--muted)"
                        : "transparent",
                    }}
                    transition={{ duration: 0.2 }}
                    className={`flex-1 rounded-2xl p-4 min-h-[150px] border-2 transition-all duration-300 ${
                      snapshot.isDraggingOver
                        ? "border-primary/40 shadow-inner shadow-primary/5 scale-[1.01]"
                        : "border-transparent hover:border-primary/20 hover:bg-muted/20"
                    }`}
                  >
                    <div className="flex flex-col gap-3">
                      {columnApps.map((app, index) => (
                        <KanbanCard
                          key={app.id}
                          application={app}
                          index={index}
                        />
                      ))}
                      {provided.placeholder}

                      {/* Empty State */}
                      {columnApps.length === 0 && !snapshot.isDraggingOver && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.5 }}
                          className="flex items-center justify-center h-32 text-center text-muted-foreground text-sm"
                        >
                          <p>Drop items here</p>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </Droppable>
            </motion.div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
