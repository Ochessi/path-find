"use client";

import * as React from "react";
import { motion } from "framer-motion";
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { theme, setTheme } = useTheme();

  return (
    <motion.div
      className="max-w-4xl space-y-8 pb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences.
        </p>
      </motion.div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="bg-muted/50 border h-11 p-1 rounded-xl smooth-transition">
          <TabsTrigger value="account" className="h-9 px-4 rounded-lg data-[state=active]:bg-background smooth-transition">Account</TabsTrigger>
          <TabsTrigger value="notifications" className="h-9 px-4 rounded-lg data-[state=active]:bg-background smooth-transition">Notifications</TabsTrigger>
          <TabsTrigger value="appearance" className="h-9 px-4 rounded-lg data-[state=active]:bg-background smooth-transition">Appearance</TabsTrigger>
          <TabsTrigger value="data" className="h-9 px-4 rounded-lg data-[state=active]:bg-background smooth-transition">Privacy & Data</TabsTrigger>
        </TabsList>

        {/* Account Tab */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <TabsContent value="account" className="card-elevated space-y-6 mt-4">
            {/* Profile Information */}
            <motion.div className="space-y-4" variants={itemVariants}>
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">Profile Information</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Update your account details.
                </p>
              </div>
              <Separator className="gradient-divider" />
              <div className="grid gap-4 max-w-xl">
                <div className="space-y-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input id="name" defaultValue={user?.name} className="max-w-md form-input-enhanced" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue={user?.email} className="max-w-md form-input-enhanced" />
                </div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button className="w-fit mt-2 bg-emerald-600 hover:bg-emerald-700 text-white smooth-transition shadow-md hover:shadow-lg">Save Changes</Button>
                </motion.div>
              </div>
            </motion.div>

            {/* Password */}
            <motion.div className="space-y-4 pt-6" variants={itemVariants}>
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                   <Shield className="h-5 w-5 text-primary" /> Password
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Change your password.
                </p>
              </div>
              <Separator className="gradient-divider" />
              <div className="grid gap-4 max-w-xl">
                <div className="space-y-2">
                  <Label htmlFor="current">Current Password</Label>
                  <Input id="current" type="password" className="form-input-enhanced" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new">New Password</Label>
                  <Input id="new" type="password" className="form-input-enhanced" />
                </div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button className="w-fit mt-2 smooth-transition shadow-md hover:shadow-lg">Update Password</Button>
                </motion.div>
              </div>
            </motion.div>
          </TabsContent>
        </motion.div>

        {/* Notifications Tab */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <TabsContent value="notifications" className="card-elevated space-y-6 mt-4">
            <motion.div className="space-y-4" variants={itemVariants}>
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                   <Bell className="h-5 w-5 text-primary" /> Email Notifications
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose what updates you want to receive.
                </p>
              </div>
              <Separator className="gradient-divider" />
              <div className="space-y-4">
                <motion.div
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  whileHover={{ x: 4 }}
                  variants={itemVariants}
                >
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">New Job Matches</Label>
                    <p className="text-sm text-muted-foreground">Receive daily summaries of highly matched jobs.</p>
                  </div>
                  <Switch defaultChecked />
                </motion.div>
                <Separator />
                <motion.div
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  whileHover={{ x: 4 }}
                  variants={itemVariants}
                >
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Application Updates</Label>
                    <p className="text-sm text-muted-foreground">Get notified when a company views your application.</p>
                  </div>
                  <Switch defaultChecked />
                </motion.div>
                <Separator />
                <motion.div
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  whileHover={{ x: 4 }}
                  variants={itemVariants}
                >
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Follow-up Reminders</Label>
                    <p className="text-sm text-muted-foreground">Reminders to follow up on aging applications.</p>
                  </div>
                  <Switch defaultChecked />
                </motion.div>
              </div>
            </motion.div>
          </TabsContent>
        </motion.div>

        {/* Appearance Tab */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <TabsContent value="appearance" className="card-elevated space-y-6 mt-4">
            <motion.div className="space-y-4" variants={itemVariants}>
              <div>
                <h3 className="text-lg font-semibold">Theme Preferences</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Customize how Pathfind looks on your device.
                </p>
              </div>
              <Separator className="gradient-divider" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl pt-2">
                {[
                  { id: 'light', label: 'Light', Icon: Sun, color: 'text-orange-500' },
                  { id: 'dark', label: 'Dark', Icon: Moon, color: 'text-blue-500' },
                  { id: 'system', label: 'System', Icon: Laptop, color: 'text-slate-500' },
                ].map(({ id, label, Icon, color }) => (
                  <motion.button
                    key={id}
                    onClick={() => setTheme(id)}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all smooth-transition ${
                      theme === id
                        ? 'border-primary bg-primary/10 shadow-md shadow-primary/20'
                        : 'border-border hover:border-primary/50 hover:shadow-sm'
                    }`}
                  >
                    <Icon className={`h-8 w-8 ${color}`} />
                    <span className="font-medium">{label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </TabsContent>
        </motion.div>

        {/* Privacy & Data Tab */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <TabsContent value="data" className="card-elevated space-y-6 mt-4">
            <motion.div className="space-y-4" variants={itemVariants}>
              <div>
                <h3 className="text-lg font-semibold">Privacy & Data Management</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Control your data and GDPR settings.
                </p>
              </div>
              <Separator className="gradient-divider" />
              <div className="space-y-6 pt-2">
                 <motion.div variants={itemVariants}>
                    <h4 className="font-semibold mb-2">Export Data</h4>
                    <p className="text-sm text-muted-foreground mb-4 max-w-xl">
                      Download a full copy of all your profile data, applications, and generated cover letters in a machine-readable format.
                    </p>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button variant="outline" className="gap-2 smooth-transition hover:shadow-md">
                        <Download className="h-4 w-4" /> Export My Data
                      </Button>
                    </motion.div>
                 </motion.div>

                 <Separator className="gradient-divider" />

                 <motion.div variants={itemVariants}>
                    <h4 className="font-semibold mb-2 text-destructive">Danger Zone</h4>
                    <p className="text-sm text-muted-foreground mb-4 max-w-xl">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button variant="destructive" className="gap-2 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white border border-destructive/20 shadow-none smooth-transition hover:shadow-md hover:shadow-destructive/20">
                        <Trash2 className="h-4 w-4" /> Delete Account
                      </Button>
                    </motion.div>
                 </motion.div>
              </div>
            </motion.div>
          </TabsContent>
        </motion.div>

      </Tabs>
    </motion.div>
  );
}
