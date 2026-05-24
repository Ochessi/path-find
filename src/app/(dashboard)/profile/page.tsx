"use client";

import * as React from "react";
import {
  User, Mail, MapPin, Briefcase, GraduationCap,
  Plus, Pencil, Trash2, Loader2, CheckCircle2, X,
  Phone, Globe, Link2,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { Experience, Education } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function fmtYear(dateStr?: string | null) {
  if (!dateStr) return "";
  try { return new Date(dateStr).getFullYear().toString(); } catch { return ""; }
}

// ---------------------------------------------------------------------------
// Experience Modal
// ---------------------------------------------------------------------------
const BLANK_EXP: Experience = {
  title: "", company: "", location: "", start_date: "", end_date: null, current: false, description: "",
};

function ExperienceModal({
  open, initial, onClose, onSave,
}: {
  open: boolean;
  initial: Experience | null;
  onClose: () => void;
  onSave: (exp: Experience) => void;
}) {
  const [form, setForm] = React.useState<Experience>(BLANK_EXP);
  React.useEffect(() => { setForm(initial ?? BLANK_EXP); }, [initial, open]);
  const set = (k: keyof Experience, v: string | boolean | null) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Experience" : "Add Experience"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1 col-span-2">
              <Label>Job Title</Label>
              <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Software Engineer" />
            </div>
            <div className="space-y-1">
              <Label>Company</Label>
              <Input value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Acme Corp" />
            </div>
            <div className="space-y-1">
              <Label>Location</Label>
              <Input value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="Remote" />
            </div>
            <div className="space-y-1">
              <Label>Start Date</Label>
              <Input type="month" value={form.start_date?.slice(0, 7) ?? ""} onChange={(e) => set("start_date", e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>End Date</Label>
              <Input type="month" disabled={form.current} value={form.end_date?.slice(0, 7) ?? ""} onChange={(e) => set("end_date", e.target.value)} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={form.current} onCheckedChange={(v) => set("current", v)} id="current" />
            <Label htmlFor="current">Currently working here</Label>
          </div>
          <div className="space-y-1">
            <Label>Description</Label>
            <Textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Describe your role and achievements..." />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(form)} disabled={!form.title || !form.company}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Education Modal
// ---------------------------------------------------------------------------
const BLANK_EDU: Education = { institution: "", degree: "", field: "", start_date: "", end_date: "" };

function EducationModal({
  open, initial, onClose, onSave,
}: {
  open: boolean;
  initial: Education | null;
  onClose: () => void;
  onSave: (edu: Education) => void;
}) {
  const [form, setForm] = React.useState<Education>(BLANK_EDU);
  React.useEffect(() => { setForm(initial ?? BLANK_EDU); }, [initial, open]);
  const set = (k: keyof Education, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Education" : "Add Education"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1">
            <Label>Institution</Label>
            <Input value={form.institution} onChange={(e) => set("institution", e.target.value)} placeholder="University of Nairobi" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Degree</Label>
              <Input value={form.degree} onChange={(e) => set("degree", e.target.value)} placeholder="B.Sc." />
            </div>
            <div className="space-y-1">
              <Label>Field of Study</Label>
              <Input value={form.field} onChange={(e) => set("field", e.target.value)} placeholder="Computer Science" />
            </div>
            <div className="space-y-1">
              <Label>Start Year</Label>
              <Input type="month" value={form.start_date?.slice(0, 7) ?? ""} onChange={(e) => set("start_date", e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>End Year</Label>
              <Input type="month" value={form.end_date?.slice(0, 7) ?? ""} onChange={(e) => set("end_date", e.target.value)} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(form)} disabled={!form.institution || !form.degree}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Skills Modal
// ---------------------------------------------------------------------------
function SkillsModal({
  open, initial, onClose, onSave,
}: {
  open: boolean;
  initial: string[];
  onClose: () => void;
  onSave: (skills: string[]) => void;
}) {
  const [skills, setSkills] = React.useState<string[]>([]);
  const [input, setInput] = React.useState("");
  React.useEffect(() => { setSkills(initial); setInput(""); }, [initial, open]);

  const add = () => {
    const s = input.trim();
    if (s && !skills.includes(s)) setSkills((prev) => [...prev, s]);
    setInput("");
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Edit Skills</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
              placeholder="Type a skill and press Enter"
            />
            <Button variant="outline" onClick={add} disabled={!input.trim()}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2 min-h-[60px] p-3 rounded-xl border bg-muted/20">
            {skills.length === 0 && <span className="text-sm text-muted-foreground">No skills yet</span>}
            {skills.map((s) => (
              <Badge key={s} variant="secondary" className="gap-1 pr-1">
                {s}
                <button onClick={() => setSkills((prev) => prev.filter((x) => x !== s))} className="hover:text-destructive transition-colors">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(skills)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function ProfilePage() {
  const { user, updateProfile, isSaving } = useAuthStore();

  // ---------- top-level editable fields ----------
  const [isEditing, setIsEditing] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [saveError, setSaveError] = React.useState<string | null>(null);
  const [form, setForm] = React.useState({
    full_name: "", headline: "", summary: "", location: "", phone: "",
    linkedin: "", website: "",
  });

  // ---------- sub-section modals ----------
  const [expModal, setExpModal] = React.useState<{ open: boolean; index: number | null }>({ open: false, index: null });
  const [eduModal, setEduModal] = React.useState<{ open: boolean; index: number | null }>({ open: false, index: null });
  const [skillsModal, setSkillsModal] = React.useState(false);

  // derived lists from user store
  const experience: Experience[] = (user?.experience as Experience[]) ?? [];
  const education: Education[] = (user?.education as Education[]) ?? [];
  const skills: string[] = (user?.skills as string[]) ?? [];

  // populate form whenever user loads
  React.useEffect(() => {
    if (!user) return;
    setForm({
      full_name: user.full_name ?? "",
      headline: user.profile?.headline ?? user.headline ?? "",
      summary: user.profile?.bio ?? user.summary ?? "",
      location: user.profile?.location ?? user.location ?? "",
      phone: user.profile?.phone ?? user.phone ?? "",
      linkedin: user.profile?.linkedin_url ?? user.linkedin ?? "",
      website: user.profile?.portfolio_url ?? user.website ?? "",
    });
  }, [user]);

  // ---------- save top-level details ----------
  const handleSave = async () => {
    setSaveError(null);
    try {
      await updateProfile({
        full_name: form.full_name,
        headline: form.headline,
        summary: form.summary,
        location: form.location,
        phone: form.phone,
        linkedin: form.linkedin,
        website: form.website,
      });
      setIsEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Save failed.");
    }
  };

  // ---------- experience CRUD ----------
  const handleSaveExp = async (exp: Experience, index: number | null) => {
    const next = [...experience];
    if (index === null) next.push(exp); else next[index] = exp;
    await updateProfile({ experience: next as never });
    setExpModal({ open: false, index: null });
  };
  const handleDeleteExp = async (index: number) => {
    const next = experience.filter((_, i) => i !== index);
    await updateProfile({ experience: next as never });
  };

  // ---------- education CRUD ----------
  const handleSaveEdu = async (edu: Education, index: number | null) => {
    const next = [...education];
    if (index === null) next.push(edu); else next[index] = edu;
    await updateProfile({ education: next as never });
    setEduModal({ open: false, index: null });
  };
  const handleDeleteEdu = async (index: number) => {
    const next = education.filter((_, i) => i !== index);
    await updateProfile({ education: next as never });
  };

  // ---------- skills ----------
  const handleSaveSkills = async (newSkills: string[]) => {
    await updateProfile({ skills: newSkills as never });
    setSkillsModal(false);
  };

  const displayName = form.full_name || user?.full_name || "Your Name";
  const displayRole = form.headline || user?.profile?.headline || "";

  return (
    <div className="max-w-4xl space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your personal information, experience, and preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* ── Sidebar ── */}
        <div className="w-full md:w-[280px] space-y-6 shrink-0 border-r border-border md:pr-8">
          {/* Avatar */}
          <div className="flex flex-col items-center pb-4">
            <div className="h-28 w-28 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-4xl text-white font-bold shadow-lg">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-bold mt-4 text-center">{displayName}</h2>
            <p className="text-muted-foreground text-sm text-center">{displayRole || "Add Your Headline"}</p>
          </div>

          {/* Completeness */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">Profile Completeness</span>
              <span className="text-emerald-600 font-semibold">{user?.completeness ?? 0}%</span>
            </div>
            <Progress value={user?.completeness ?? 0} className="h-2" />
          </div>

          <Separator />

          {/* Quick info */}
          <div className="space-y-3">
            {[
              { icon: User, value: displayName },
              { icon: Mail, value: user?.email },
              { icon: MapPin, value: form.location },
              { icon: Phone, value: form.phone },
              { icon: Link2, value: form.linkedin },
              { icon: Globe, value: form.website },
            ].map(({ icon: Icon, value }, i) => (
              <div key={i} className={cn("flex items-center gap-3 text-sm", !value && "text-muted-foreground")}>
                <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate">{value || "—"}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Main ── */}
        <div className="flex-1 space-y-8 min-w-0">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Details</h3>
            {saved && (
              <span className="flex items-center gap-1.5 text-sm text-emerald-600">
                <CheckCircle2 className="h-4 w-4" /> Saved
              </span>
            )}
            {saveError && <span className="text-sm text-destructive">{saveError}</span>}
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button size="sm" onClick={handleSave} disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5">
                  {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                  Save Changes
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Pencil className="h-4 w-4 mr-2" /> Edit Details
              </Button>
            )}
          </div>

          {/* Basic fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Full Name", key: "full_name" as const, placeholder: "Jane Doe" },
              { label: "Headline / Role", key: "headline" as const, placeholder: "Senior Engineer" },
              { label: "Location", key: "location" as const, placeholder: "Nairobi, Kenya" },
              { label: "Phone", key: "phone" as const, placeholder: "+254 700 000 000" },
              { label: "LinkedIn URL", key: "linkedin" as const, placeholder: "linkedin.com/in/you" },
              { label: "Website / Portfolio", key: "website" as const, placeholder: "yoursite.com" },
            ].map(({ label, key, placeholder }) => (
              <div key={key} className="space-y-1">
                <Label>{label}</Label>
                {isEditing ? (
                  <Input value={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} placeholder={placeholder} />
                ) : (
                  <p className={cn("text-sm py-2", !form[key] && "text-muted-foreground")}>{form[key] || placeholder}</p>
                )}
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <Label>Professional Summary</Label>
            {isEditing ? (
              <Textarea rows={4} value={form.summary} onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))} placeholder="Write a brief professional summary..." />
            ) : (
              <p className={cn("text-sm leading-relaxed p-4 rounded-xl border", form.summary ? "bg-muted/30 border-muted" : "border-dashed border-muted-foreground/30 text-muted-foreground")}>
                {form.summary || "No professional summary yet."}
              </p>
            )}
          </div>

          <Separator />

          {/* Experience */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 text-base font-semibold"><Briefcase className="h-4 w-4" /> Experience</Label>
              <Button variant="ghost" size="sm" className="h-8 text-emerald-600" onClick={() => setExpModal({ open: true, index: null })}>
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
            {experience.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-muted-foreground/30 text-center text-sm text-muted-foreground">No experience listed</div>
            ) : (
              <div className="space-y-2">
                {experience.map((exp, i) => (
                  <div key={i} className="p-4 rounded-xl border flex justify-between items-start gap-3">
                    <div>
                      <h4 className="font-semibold text-sm">{exp.title}</h4>
                      <p className="text-sm text-muted-foreground">{exp.company}{exp.location ? ` · ${exp.location}` : ""}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {fmtYear(exp.start_date)} – {exp.current ? "Present" : fmtYear(exp.end_date ?? "")}
                      </p>
                      {exp.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{exp.description}</p>}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setExpModal({ open: true, index: i })}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive" onClick={() => handleDeleteExp(i)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Education */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 text-base font-semibold"><GraduationCap className="h-4 w-4" /> Education</Label>
              <Button variant="ghost" size="sm" className="h-8 text-emerald-600" onClick={() => setEduModal({ open: true, index: null })}>
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
            {education.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-muted-foreground/30 text-center text-sm text-muted-foreground">No education listed</div>
            ) : (
              <div className="space-y-2">
                {education.map((edu, i) => (
                  <div key={i} className="p-4 rounded-xl border flex justify-between items-start gap-3">
                    <div>
                      <h4 className="font-semibold text-sm">{edu.degree} {edu.field ? `in ${edu.field}` : ""}</h4>
                      <p className="text-sm text-muted-foreground">{edu.institution}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{fmtYear(edu.start_date)} – {fmtYear(edu.end_date)}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEduModal({ open: true, index: i })}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive" onClick={() => handleDeleteEdu(i)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Skills */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Skills</Label>
              <Button variant="ghost" size="sm" className="h-8 text-emerald-600" onClick={() => setSkillsModal(true)}>
                <Pencil className="h-4 w-4 mr-1" /> Edit
              </Button>
            </div>
            {skills.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-muted-foreground/30 text-center text-sm text-muted-foreground">No skills added yet</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {skills.map((s, i) => (
                  <Badge key={i} variant="secondary" className="rounded-lg px-3 py-1">{s}</Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      <ExperienceModal
        open={expModal.open}
        initial={expModal.index !== null ? experience[expModal.index] : null}
        onClose={() => setExpModal({ open: false, index: null })}
        onSave={(exp) => handleSaveExp(exp, expModal.index)}
      />
      <EducationModal
        open={eduModal.open}
        initial={eduModal.index !== null ? education[eduModal.index] : null}
        onClose={() => setEduModal({ open: false, index: null })}
        onSave={(edu) => handleSaveEdu(edu, eduModal.index)}
      />
      <SkillsModal
        open={skillsModal}
        initial={skills}
        onClose={() => setSkillsModal(false)}
        onSave={handleSaveSkills}
      />
    </div>
  );
}
