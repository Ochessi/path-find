"use client";

import * as React from "react";
import { 
  Bell, 
  Settings,
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { sampleNotifications } from "@/lib/data/applications";
import { Notification } from "@/types";

const iconMap: Record<Notification["type"], React.ReactNode> = {
  match: <Sparkles className="h-4 w-4 text-emerald-500" />,
  status: <RefreshCw className="h-4 w-4 text-blue-500" />,
  followup: <Clock className="h-4 w-4 text-orange-500" />,
  system: <Info className="h-4 w-4 text-violet-500" />,
};

// For demonstrating the empty state as seen in the image, you might want to switch 
// between empty and populated states, but let's implement the layout assuming it can be empty
// Set to true to test empty state
const SHOW_EMPTY_STATE = true; 

export function NotificationDropdown() {
  const router = useRouter();
  const [notifications, setNotifications] = React.useState<Notification[]>(
    SHOW_EMPTY_STATE ? [] : sampleNotifications
  );
  
  // Also showing the empty state unread count as 0 like in the screenshot
  const [activeTab, setActiveTab] = React.useState("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (actionUrl?: string) => {
    if (actionUrl) {
      router.push(actionUrl);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === "unread") return !n.read;
    return true;
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative h-10 w-10 flex items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground outline-none">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-background border-none animate-pulse" />
        )}
        <span className="sr-only">Notifications</span>
      </DropdownMenuTrigger>
      
      {/* 
        Matches the black/dark popup look with the tabs layout seen in the image.
        Dimensions and styling approximated to match "All" / "Unread" toggle and exact layout.
      */}
      <DropdownMenuContent align="end" className="w-[380px] rounded-2xl p-0 bg-[#0A0A0A] border-border/40">
        <div className="flex flex-col p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold tracking-tight text-white/90">
              Notifications
            </span>
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md hover:bg-white/10 text-muted-foreground hover:text-white">
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full bg-[#18181A] rounded-xl h-9 p-1 border border-white/5">
              <TabsTrigger 
                value="all" 
                className="w-full rounded-lg text-xs font-medium text-muted-foreground data-[state=active]:bg-[#27272A] data-[state=active]:text-white transition-all"
              >
                All
              </TabsTrigger>
              <TabsTrigger 
                value="unread" 
                className="w-full rounded-lg text-xs font-medium text-muted-foreground data-[state=active]:bg-[#27272A] data-[state=active]:text-white transition-all"
              >
                Unread ({unreadCount})
              </TabsTrigger>
            </TabsList>
            
            <div className="mt-4 min-h-[250px] flex flex-col">
              <TabsContent value="all" className="m-0 flex-1 flex flex-col outline-none">
                {filteredNotifications.length === 0 ? (
                  <EmptyState />
                ) : (
                  <NotificationList items={filteredNotifications} onClick={handleNotificationClick} />
                )}
              </TabsContent>
              <TabsContent value="unread" className="m-0 flex-1 flex flex-col outline-none">
                {filteredNotifications.length === 0 ? (
                  <EmptyState />
                ) : (
                  <NotificationList items={filteredNotifications} onClick={handleNotificationClick} />
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-10 space-y-4">
      <div className="h-16 w-16 bg-[#18181A] border border-white/5 rounded-2xl flex items-center justify-center shadow-sm">
        <Bell className="h-6 w-6 text-white/40" />
      </div>
      <div className="space-y-1.5 text-center">
        <p className="text-sm font-medium text-white/90">No notifications</p>
        <p className="text-xs text-muted-foreground">
          You&apos;re all caught up! Check back later.
        </p>
      </div>
    </div>
  );
}

function NotificationList({ 
  items, 
  onClick 
}: { 
  items: Notification[]; 
  onClick: (url?: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1 overflow-y-auto max-h-[300px]">
      {items.map((notification) => (
        <div 
          key={notification.id}
          className={`group relative flex items-start gap-4 p-3 rounded-xl cursor-pointer hover:bg-white/5 transition-colors ${!notification.read ? 'bg-white/5' : ''}`}
          onClick={() => onClick(notification.actionUrl)}
        >
          <div className="shrink-0 mt-0.5 p-1.5 rounded-full bg-[#18181A] border border-white/5">
            {iconMap[notification.type]}
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className={`text-sm leading-tight text-white/90 ${!notification.read ? 'font-semibold' : 'font-medium'}`}>
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
             <div className="absolute top-1/2 -right-1 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-primary" />
          )}
        </div>
      ))}
    </div>
  );
}
