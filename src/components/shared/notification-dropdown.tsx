"use client";

import * as React from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { 
  Bell, 
  Check, 
  Sparkles, 
  RefreshCw, 
  Clock, 
  Info 
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sampleNotifications } from "@/lib/data/applications";
import { Notification } from "@/types";

const iconMap: Record<Notification["type"], React.ReactNode> = {
  match: <Sparkles className="h-4 w-4 text-emerald-500" />,
  status: <RefreshCw className="h-4 w-4 text-blue-500" />,
  followup: <Clock className="h-4 w-4 text-orange-500" />,
  system: <Info className="h-4 w-4 text-violet-500" />,
};

export function NotificationDropdown() {
  const router = useRouter();
  const [notifications, setNotifications] = React.useState<Notification[]>(
    sampleNotifications
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationClick = (actionUrl?: string) => {
    if (actionUrl) {
      router.push(actionUrl);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative h-10 w-10 flex items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground outline-none">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-background border-none animate-pulse" />
        )}
        <span className="sr-only">Notifications</span>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-[380px] rounded-2xl p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/20 rounded-t-2xl">
          <DropdownMenuLabel className="p-0 font-semibold text-base">
            Notifications
          </DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="h-auto p-0 text-xs text-primary hover:text-primary hover:bg-transparent"
            >
              Mark all as read
            </Button>
          )}
        </div>
        
        <DropdownMenuGroup className="max-h-[400px] overflow-y-auto py-1">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              You&apos;re all caught up!
            </div>
          ) : (
             notifications.map((notification) => (
                <DropdownMenuItem 
                  key={notification.id}
                  className={`flex items-start gap-4 p-4 cursor-pointer focus:bg-muted ${!notification.read ? 'bg-primary/5' : ''}`}
                  onClick={() => handleNotificationClick(notification.actionUrl)}
                >
                  <div className={`shrink-0 mt-0.5 p-1.5 rounded-full ${!notification.read ? 'bg-background shadow-sm ring-1 ring-border' : 'bg-muted'}`}>
                    {iconMap[notification.type]}
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between gap-2">
                       <p className={`text-sm leading-none ${!notification.read ? 'font-semibold' : 'font-medium'}`}>
                         {notification.title}
                       </p>
                       <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                         {notification.createdAt}
                       </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="shrink-0 mt-1 h-2 w-2 rounded-full bg-primary" />
                  )}
                </DropdownMenuItem>
             ))
          )}
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator className="m-0" />
        
        <div className="p-2">
           <Button variant="ghost" className="w-full text-xs h-8 justify-center rounded-xl text-muted-foreground hover:text-foreground">
              View all notifications
           </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
