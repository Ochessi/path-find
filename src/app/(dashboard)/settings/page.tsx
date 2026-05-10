"use client";

import * as React from "react";
import { 
  Bell, 
  Shield, 
  Download, 
  Trash2, 
  Moon, 
  Sun,
  Laptop
} from "lucide-react";
import { useTheme } from "next-themes";

import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { theme, setTheme } = useTheme();
  
  return (
    <div className="max-w-4xl space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="bg-muted/50 border h-11 p-1">
          <TabsTrigger value="account" className="h-9 px-4 rounded-md">Account</TabsTrigger>
          <TabsTrigger value="notifications" className="h-9 px-4 rounded-md">Notifications</TabsTrigger>
          <TabsTrigger value="appearance" className="h-9 px-4 rounded-md">Appearance</TabsTrigger>
          <TabsTrigger value="data" className="h-9 px-4 rounded-md">Privacy & Data</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6 mt-4 border rounded-xl p-6 bg-card">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Profile Information</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Update your account details.
              </p>
            </div>
            <Separator />
            <div className="grid gap-4 max-w-xl">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input id="name" defaultValue={user?.full_name} className="max-w-md" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue={user?.email} className="max-w-md" />
              </div>
              <Button className="w-fit mt-2 bg-emerald-600 hover:bg-emerald-700 text-white">Save Changes</Button>
            </div>
          </div>
          
          <div className="space-y-4 pt-6">
            <div>
              <h3 className="text-lg font-medium flex items-center gap-2">
                 <Shield className="h-5 w-5 text-muted-foreground" /> Password
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Change your password.
              </p>
            </div>
            <Separator />
            <div className="grid gap-4 max-w-xl">
              <div className="space-y-2">
                <Label htmlFor="current">Current Password</Label>
                <Input id="current" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new">New Password</Label>
                <Input id="new" type="password" />
              </div>
              <Button className="w-fit mt-2">Update Password</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 mt-4 border rounded-xl p-6 bg-card">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium flex items-center gap-2">
                 <Bell className="h-5 w-5 text-muted-foreground" /> Email Notifications
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Choose what updates you want to receive.
              </p>
            </div>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">New Job Matches</Label>
                  <p className="text-sm text-muted-foreground">Receive daily summaries of highly matched jobs.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Application Updates</Label>
                  <p className="text-sm text-muted-foreground">Get notified when a company views your application.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Follow-up Reminders</Label>
                  <p className="text-sm text-muted-foreground">Reminders to follow up on aging applications.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6 mt-4 border rounded-xl p-6 bg-card">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Theme Preferences</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Customize how Pathfind looks on your device.
              </p>
            </div>
            <Separator />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl pt-2">
              <button 
                onClick={() => setTheme("light")} 
                className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all ${theme === 'light' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
              >
                <Sun className="h-8 w-8 text-orange-500" />
                <span className="font-medium">Light</span>
              </button>
              
              <button 
                onClick={() => setTheme("dark")} 
                className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all ${theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
              >
                <Moon className="h-8 w-8 text-blue-500" />
                <span className="font-medium">Dark</span>
              </button>

              <button 
                onClick={() => setTheme("system")} 
                className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all ${theme === 'system' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
              >
                <Laptop className="h-8 w-8 text-slate-500" />
                <span className="font-medium">System</span>
              </button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="data" className="space-y-6 mt-4 border rounded-xl p-6 bg-card">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Privacy & Data Management</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Control your data and GDPR settings.
              </p>
            </div>
            <Separator />
            <div className="space-y-6 pt-2">
               <div>
                  <h4 className="font-medium mb-2">Export Data</h4>
                  <p className="text-sm text-muted-foreground mb-4 max-w-xl">
                    Download a full copy of all your profile data, applications, and generated cover letters in a machine-readable format.
                  </p>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" /> Export My Data
                  </Button>
               </div>
               
               <Separator />

               <div>
                  <h4 className="font-medium mb-2 text-destructive">Danger Zone</h4>
                  <p className="text-sm text-muted-foreground mb-4 max-w-xl">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <Button variant="destructive" className="gap-2 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white border border-destructive/20 shadow-none">
                    <Trash2 className="h-4 w-4" /> Delete Account
                  </Button>
               </div>
            </div>
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
}
