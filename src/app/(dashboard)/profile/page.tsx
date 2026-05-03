"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Globe,
  Plus,
  Pencil,
} from "lucide-react";

import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = React.useState(false);
  const [profileData, setProfileData] = React.useState({
    name: user?.name || "Alex Johnson",
    email: user?.email || "alex@pathfind.ai",
    location: "San Francisco, CA",
    role: "Senior Software Engineer",
    summary:
      "Passionate software engineer with 5+ years of experience in building scalable web applications. Strong focus on React, Node.js, and cloud architecture.",
    skills: ["React", "TypeScript", "Node.js", "AWS", "GraphQL", "Tailwind CSS"],
    experience: [
      {
        title: "Software Engineer",
        company: "Tech Solutions Inc.",
        period: "2021 - Present",
      },
      {
        title: "Frontend Developer",
        company: "Creative Digital",
        period: "2018 - 2021",
      },
    ],
    education: [
      {
        degree: "B.S. Computer Science",
        school: "University of Technology",
        year: "2018",
      },
    ],
  });

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <motion.div
      className="max-w-4xl space-y-8 pb-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your personal information, experience, and preferences.
        </p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row gap-8"
      >
        {/* Sidebar */}
        <motion.div
          className="w-full md:w-[300px] space-y-6 shrink-0 md:border-r md:border-gradient-divider md:pr-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Avatar Section */}
          <motion.div
            className="flex flex-col items-center pb-6"
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="relative group">
              <div className="h-32 w-32 rounded-full border-4 border-background shadow-lg overflow-hidden animate-border-glow">
                <div className="absolute inset-0 bg-secondary/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-foreground hover:bg-transparent hover:scale-110 transition-transform"
                  >
                    <Pencil className="h-5 w-5" />
                  </Button>
                </div>
                <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-4xl text-white font-bold">
                  {profileData.name.charAt(0)}
                </div>
              </div>
              <motion.div
                className="absolute -bottom-1 -right-1 bg-gradient-to-br from-sky-400 to-violet-500 rounded-full p-2 text-white text-xs font-bold flex items-center justify-center h-8 w-8"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                85%
              </motion.div>
            </div>
            <h2 className="text-xl font-bold mt-4">{profileData.name}</h2>
            <p className="text-muted-foreground text-sm">{profileData.role}</p>
          </motion.div>

          {/* Profile Completeness */}
          <motion.div
            className="card-content-elevated"
            variants={itemVariants}
          >
            <div className="flex justify-between text-sm mb-3">
              <span className="font-medium">Profile Completeness</span>
              <span className="gradient-text font-semibold">85%</span>
            </div>
            <Progress value={85} className="h-2" />
            <p className="text-xs text-muted-foreground mt-3">
              Add 2 more skills to reach 100%
            </p>
          </motion.div>

          <Separator className="my-2" />

          {/* Contact Info */}
          <motion.div className="space-y-4" variants={itemVariants}>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Contact Info
            </h3>
            <div className="space-y-3">
              <motion.div
                className="flex items-center gap-3 text-sm p-2.5 rounded-lg hover:bg-muted/50 transition-colors duration-200"
                whileHover={{ x: 4 }}
              >
                <User className="h-4 w-4 text-primary shrink-0" />
                <span>{profileData.name}</span>
              </motion.div>
              <motion.div
                className="flex items-center gap-3 text-sm p-2.5 rounded-lg hover:bg-muted/50 transition-colors duration-200"
                whileHover={{ x: 4 }}
              >
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span>{profileData.email}</span>
              </motion.div>
              <motion.div
                className="flex items-center gap-3 text-sm p-2.5 rounded-lg hover:bg-muted/50 transition-colors duration-200"
                whileHover={{ x: 4 }}
              >
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span>{profileData.location}</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          className="flex-1 space-y-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Details Header */}
          <div className="flex items-center justify-between border-b border-gradient-divider pb-4">
            <h3 className="text-lg font-semibold">Details</h3>
            {isEditing ? (
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  className="smooth-transition"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white smooth-transition"
                >
                  Save Changes
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="smooth-transition hover:bg-primary/10"
              >
                <Pencil className="h-4 w-4 mr-2" /> Edit Profile
              </Button>
            )}
          </div>

          {/* Content Sections */}
          <motion.div className="space-y-8" variants={containerVariants}>
            {/* Professional Summary */}
            <motion.div className="space-y-3" variants={itemVariants}>
              <Label className="text-base font-semibold">Professional Summary</Label>
              {isEditing ? (
                <Textarea
                  value={profileData.summary}
                  onChange={(e) =>
                    setProfileData({ ...profileData, summary: e.target.value })
                  }
                  rows={4}
                  className="form-input-glow"
                />
              ) : (
                <motion.p
                  className="text-sm leading-relaxed p-4 bg-muted/30 rounded-xl border border-muted hover:border-primary/30 hover:bg-muted/40 smooth-transition"
                  whileHover={{ borderColor: "var(--primary)" }}
                >
                  {profileData.summary}
                </motion.p>
              )}
            </motion.div>

            {/* Experience */}
            <motion.div className="space-y-4" variants={itemVariants}>
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-base font-semibold">
                  <Briefcase className="h-5 w-5 text-primary" /> Experience
                </Label>
                {isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-emerald-600 hover:bg-emerald-500/10"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                {profileData.experience.map((exp, i) => (
                  <motion.div
                    key={i}
                    className="card-content-elevated group"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">
                          {exp.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {exp.company} · {exp.period}
                        </p>
                      </div>
                      {isEditing && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Education */}
            <motion.div className="space-y-4" variants={itemVariants}>
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-base font-semibold">
                  <GraduationCap className="h-5 w-5 text-primary" /> Education
                </Label>
                {isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-emerald-600 hover:bg-emerald-500/10"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                {profileData.education.map((edu, i) => (
                  <motion.div
                    key={i}
                    className="card-content-elevated group"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">
                          {edu.degree}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {edu.school} · {edu.year}
                        </p>
                      </div>
                      {isEditing && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Skills */}
            <motion.div className="space-y-4" variants={itemVariants}>
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Skills</Label>
                {isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-emerald-600 hover:bg-emerald-500/10"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Badge
                      variant={isEditing ? "default" : "secondary"}
                      className="rounded-lg px-3 py-1.5 transition-all duration-300 hover:shadow-md hover:shadow-sky-500/20"
                    >
                      {skill}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
