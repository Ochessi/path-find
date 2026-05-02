"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Kanban, List, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { KanbanBoard } from "@/components/application/kanban-board";
import { ListView } from "@/components/application/list-view";
import { ManualApplicationModal } from "@/components/application/manual-application-modal";
import { Plus } from "lucide-react";

export default function ApplicationsPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [view, setView] = React.useState("board");
  const [manualModalOpen, setManualModalOpen] = React.useState(false);

  return (
    <motion.div
      className="flex flex-col h-[calc(100vh-theme(spacing.16))] gap-6 pb-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage your job applications pipeline.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <motion.div
            className="relative flex-1 sm:w-64"
            whileHover={{ scale: 1.02 }}
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search companies, roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10 w-full rounded-xl bg-card border-border/60 form-input-enhanced"
            />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => setManualModalOpen(true)}
              size="sm"
              className="h-10 rounded-xl gap-2 bg-emerald-600 hover:bg-emerald-700 text-white hidden sm:flex smooth-transition"
            >
              <Plus className="h-4 w-4" />
              Add Application
            </Button>
          </motion.div>

          <Tabs value={view} onValueChange={setView} className="hidden lg:block">
            <TabsList className="h-10 bg-card border rounded-xl smooth-transition">
              <TabsTrigger value="board" className="gap-2 rounded-lg data-[state=active]:bg-muted">
                <Kanban className="h-4 w-4" />
                Board
              </TabsTrigger>
              <TabsTrigger value="list" className="gap-2 rounded-lg data-[state=active]:bg-muted">
                <List className="h-4 w-4" />
                List
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        className="flex-1 overflow-hidden"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        {view === "board" ? (
          <KanbanBoard searchTerm={searchTerm} />
        ) : (
          <ListView searchTerm={searchTerm} />
        )}
      </motion.div>

      <ManualApplicationModal
        open={manualModalOpen}
        onOpenChange={setManualModalOpen}
      />
    </motion.div>
  );
}
