"use client";

import * as React from "react";
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

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = React.useState(false);
  const [profileData, setProfileData] = React.useState({
    name: "",
    email: "",
    location: "",
    role: "",
    summary: "",
    skills: [] as string[],
    experience: [] as { title: string; company: string; period: string }[],
    education: [] as { degree: string; school: string; year: string }[],
  });

  React.useEffect(() => {
    if (user) {
      setProfileData({
        name: user.full_name || "",
        email: user.email || "",
        location: user.profile?.location || user.location || "",
        role: user.profile?.headline || user.headline || "",
        summary: user.summary || user.profile?.bio || "",
        skills: user.skills || [],
        experience:
          user.experience?.map((exp) => ({
            title: exp.title,
            company: exp.company,
            period: `${new Date(exp.start_date).getFullYear()} - ${
              exp.current || !exp.end_date
                ? "Present"
                : new Date(exp.end_date).getFullYear()
            }`,
          })) || [],
        education:
          user.education?.map((edu) => ({
            degree: edu.degree,
            school: edu.institution,
            year: edu.end_date
              ? new Date(edu.end_date).getFullYear().toString()
              : edu.start_date
              ? new Date(edu.start_date).getFullYear().toString()
              : "",
          })) || [],
      });
    }
  }, [user]);

  const handleSave = () => {
    // Simulate save
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your personal information, experience, and preferences.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-[300px] space-y-6 shrink-0 border-r border-border md:pr-8">
          <div className="flex flex-col items-center pb-6">
            <div className="h-32 w-32 rounded-full border-4 border-background shadow-lg overflow-hidden relative group">
               <div className="absolute inset-0 bg-secondary/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <Button variant="ghost" size="icon" className="text-foreground hover:bg-transparent">
                   <Pencil className="h-5 w-5" />
                 </Button>
               </div>
               <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-4xl text-white font-bold">
                 {profileData.name.charAt(0)}
               </div>
            </div>
            <h2 className="text-xl font-bold mt-4">{profileData.name || "Add Your Name"}</h2>
            <p className="text-muted-foreground text-sm">{profileData.role || "Add Your Headline/Role"}</p>
          </div>

          <div className="space-y-4">
             <div>
               <div className="flex justify-between text-sm mb-2">
                 <span className="font-medium">Profile Completeness</span>
                 <span className="text-emerald-600 font-semibold">{user?.completeness || 0}%</span>
               </div>
               <Progress value={user?.completeness || 0} className="h-2" />
               {(user?.completeness || 0) < 100 && (
                 <p className="text-xs text-muted-foreground mt-2">
                   Complete your profile to stand out to employers
                 </p>
               )}
             </div>
          </div>

          <Separator />
          
          <div className="space-y-4">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Info</h3>
              <div className="space-y-3">
                 <div className="flex items-center gap-3 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className={profileData.name ? "" : "text-muted-foreground"}>{profileData.name || "Add Name"}</span>
                 </div>
                 <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className={profileData.email ? "" : "text-muted-foreground"}>{profileData.email || "Add Email"}</span>
                 </div>
                 <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className={profileData.location ? "" : "text-muted-foreground"}>{profileData.location || "Add Location"}</span>
                 </div>
              </div>
          </div>
        </div>

        <div className="flex-1 space-y-8">
           <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Details</h3>
              {isEditing ? (
                 <div className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button size="sm" onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white">Save Changes</Button>
                 </div>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                   <Pencil className="h-4 w-4 mr-2" /> Edit Profile
                </Button>
              )}
           </div>

           <div className="space-y-6">
               <div className="space-y-3">
                 <Label>Professional Summary</Label>
                 {isEditing ? (
                    <Textarea 
                      value={profileData.summary}
                      onChange={(e) => setProfileData({...profileData, summary: e.target.value})}
                      rows={4}
                      placeholder="Write a brief professional summary..."
                    />
                 ) : (
                    <p className={`text-sm leading-relaxed p-4 rounded-xl border ${profileData.summary ? 'bg-muted/30 border-muted' : 'border-dashed border-muted-foreground/30 text-muted-foreground'}`}>
                      {profileData.summary || "You haven't added a professional summary yet."}
                    </p>
                 )}
              </div>

              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" /> Experience
                    </Label>
                    {isEditing && (
                       <Button variant="ghost" size="sm" className="h-8 text-emerald-600">
                          <Plus className="h-4 w-4 mr-1" /> Add
                       </Button>
                    )}
                 </div>
                 
                 <div className="space-y-3">
                    {profileData.experience.length > 0 ? profileData.experience.map((exp, i) => (
                       <div key={i} className="p-4 rounded-xl border flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-sm">{exp.title}</h4>
                            <p className="text-sm text-muted-foreground">{exp.company} · {exp.period}</p>
                          </div>
                          {isEditing && (
                             <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                <Pencil className="h-4 w-4" />
                             </Button>
                          )}
                       </div>
                    )) : (
                      <div className="p-6 rounded-xl border border-dashed border-muted-foreground/30 flex items-center justify-center">
                         <span className="text-sm text-muted-foreground">No experience listed</span>
                      </div>
                    )}
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" /> Education
                    </Label>
                    {isEditing && (
                       <Button variant="ghost" size="sm" className="h-8 text-emerald-600">
                          <Plus className="h-4 w-4 mr-1" /> Add
                       </Button>
                    )}
                 </div>
                 
                 <div className="space-y-3">
                    {profileData.education.length > 0 ? profileData.education.map((edu, i) => (
                       <div key={i} className="p-4 rounded-xl border flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-sm">{edu.degree}</h4>
                            <p className="text-sm text-muted-foreground">{edu.school} · {edu.year}</p>
                          </div>
                          {isEditing && (
                             <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                <Pencil className="h-4 w-4" />
                             </Button>
                          )}
                       </div>
                    )) : (
                      <div className="p-6 rounded-xl border border-dashed border-muted-foreground/30 flex items-center justify-center">
                         <span className="text-sm text-muted-foreground">No education listed</span>
                      </div>
                    )}
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <Label>Skills</Label>
                    {isEditing && (
                       <Button variant="ghost" size="sm" className="h-8 text-emerald-600">
                          <Plus className="h-4 w-4 mr-1" /> Add
                       </Button>
                    )}
                 </div>
                 <div className="flex flex-wrap gap-2">
                    {profileData.skills.length > 0 ? profileData.skills.map((skill, i) => (
                       <Badge key={i} variant={isEditing ? "default" : "secondary"} className="rounded-lg px-3 py-1">
                          {skill}
                       </Badge>
                    )) : (
                      <span className="text-sm text-muted-foreground">No skills added yet</span>
                    )}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
