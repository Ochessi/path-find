"use client";

import * as React from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Copy, MoreHorizontal, FileText, ArrowUpDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useApplicationStore } from "@/store/application.store";
import { ApplicationStatus } from "@/types";

interface ListViewProps {
  searchTerm: string;
}

const statusColors: Record<ApplicationStatus, string> = {
  saved: "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20",
  applied: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
  interviewing: "bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/20",
  offer: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
  rejected: "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20",
};

export function ListView({ searchTerm }: ListViewProps) {
  const { applications, updateStatus } = useApplicationStore();
  const [sortField, setSortField] = React.useState<"company" | "status" | "date">("date");
  const [sortAsc, setSortAsc] = React.useState(false);

  const toggleSort = (field: "company" | "status" | "date") => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const filteredAndSorted = React.useMemo(() => {
    let result = applications;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (app) =>
          app.job.title.toLowerCase().includes(term) ||
          app.job.company.toLowerCase().includes(term)
      );
    }

    return result.sort((a, b) => {
      let comparison = 0;
      if (sortField === "company") {
        comparison = a.job.company.localeCompare(b.job.company);
      } else if (sortField === "status") {
        comparison = a.status.localeCompare(b.status);
      } else if (sortField === "date") {
        const dateA = a.appliedDate ? new Date(a.appliedDate).getTime() : 0;
        const dateB = b.appliedDate ? new Date(b.appliedDate).getTime() : 0;
        comparison = dateA - dateB;
      }
      return sortAsc ? comparison : -comparison;
    });
  }, [applications, searchTerm, sortField, sortAsc]);

  return (
    <div className="bg-card border rounded-2xl overflow-hidden h-full flex flex-col">
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/40 sticky top-0 z-10 hidden sm:table-header-group">
            <tr>
              <th className="px-4 py-3 font-medium cursor-pointer hover:text-foreground transition-colors" onClick={() => toggleSort("company")}>
                <div className="flex items-center gap-1">
                  Company / Role
                  {sortField === "company" && <ArrowUpDown className="h-3 w-3" />}
                </div>
              </th>
              <th className="px-4 py-3 font-medium cursor-pointer hover:text-foreground transition-colors" onClick={() => toggleSort("status")}>
                <div className="flex items-center gap-1">
                  Status
                  {sortField === "status" && <ArrowUpDown className="h-3 w-3" />}
                </div>
              </th>
              <th className="px-4 py-3 font-medium cursor-pointer hover:text-foreground transition-colors" onClick={() => toggleSort("date")}>
                <div className="flex items-center gap-1">
                  Applied
                  {sortField === "date" && <ArrowUpDown className="h-3 w-3" />}
                </div>
              </th>
              <th className="px-4 py-3 font-medium">Notes</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y block sm:table-row-group">
            {filteredAndSorted.map((app) => (
              <tr key={app.id} className="hover:bg-muted/20 transition-colors block sm:table-row py-4 sm:py-0 border-b sm:border-b-0 last:border-b-0">
                <td className="px-4 sm:py-4 block sm:table-cell">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-[10px] bg-background border flex items-center justify-center font-bold text-muted-foreground hidden sm:flex">
                      {app.job.companyLogo || app.job.company[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-sm sm:text-base">{app.job.company}</div>
                      <div className="text-muted-foreground w-full sm:w-[250px] truncate">{app.job.title}</div>
                    </div>
                  </div>
                </td>
                
                <td className="px-4 sm:py-4 mt-2 sm:mt-0 block sm:table-cell">
                  <span className="sm:hidden text-xs text-muted-foreground mb-1 block">Status</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="focus:outline-none">
                      <Badge variant="outline" className={`capitalize px-2.5 py-0.5 border cursor-pointer hover:opacity-80 ${statusColors[app.status]}`}>
                        {app.status}
                      </Badge>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {Object.keys(statusColors).map((status) => (
                        <DropdownMenuItem 
                          key={status} 
                          className="capitalize cursor-pointer"
                          onClick={() => updateStatus(app.id, status as ApplicationStatus)}
                        >
                          {status}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
                
                <td className="px-4 sm:py-4 mt-2 sm:mt-0 block sm:table-cell">
                  <span className="sm:hidden text-xs text-muted-foreground mr-2">Applied:</span>
                  <span className="text-muted-foreground whitespace-nowrap">
                    {app.appliedDate
                      ? formatDistanceToNow(parseISO(app.appliedDate), {
                          addSuffix: true,
                        })
                      : "Unsubmitted"}
                  </span>
                </td>
                
                <td className="px-4 sm:py-4 mt-2 sm:mt-0 block sm:table-cell w-full sm:max-w-[300px]">
                  <span className="sm:hidden text-xs text-muted-foreground mb-1 block">Notes</span>
                  <p className="text-xs text-muted-foreground truncate">
                    {app.notes || "No notes added"}
                  </p>
                </td>
                
                <td className="px-4 sm:py-4 mt-4 sm:mt-0 block sm:table-cell text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm" className="h-8 hidden sm:flex">
                      <FileText className="h-3.5 w-3.5 mr-1" />
                      View
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground inline-flex items-center justify-center outline-none">
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 rounded-xl">
                        <DropdownMenuItem className="sm:hidden">View Details</DropdownMenuItem>
                        <DropdownMenuItem>Copy Job Link</DropdownMenuItem>
                        <DropdownMenuItem>Add Notes</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
            
            {filteredAndSorted.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-muted-foreground block sm:table-cell">
                  No applications found. Try adjusting your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
