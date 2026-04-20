"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

export function PreferencesSetup() {
  const [selectedTypes, setSelectedTypes] = useState(["Full-time"]);
  const [selectedIndustries, setSelectedIndustries] = useState(["SaaS", "FinTech"]);
  const [salary, setSalary] = useState([120]);

  const jobTypes = ["Full-time", "Part-time", "Contract", "Freelance", "Internship"];
  const industries = ["SaaS", "FinTech", "HealthTech", "EdTech", "E-commerce", "AI/ML", "Web3"];

  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleIndustry = (ind: string) => {
    setSelectedIndustries(prev => 
      prev.includes(ind) ? prev.filter(i => i !== ind) : [...prev, ind]
    );
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Label>Job Type</Label>
        <div className="flex flex-wrap gap-2">
          {jobTypes.map(type => (
            <Badge 
              key={type}
              variant={selectedTypes.includes(type) ? "default" : "outline"}
              className={`cursor-pointer px-3 py-1 ${selectedTypes.includes(type) ? 'bg-primary' : 'hover:bg-muted'}`}
              onClick={() => toggleType(type)}
            >
              {type}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label>Preferred Industries</Label>
        <div className="flex flex-wrap gap-2">
          {industries.map(ind => (
            <Badge 
              key={ind}
              variant={selectedIndustries.includes(ind) ? "default" : "outline"}
              className={`cursor-pointer px-3 py-1 ${selectedIndustries.includes(ind) ? 'bg-primary' : 'hover:bg-muted'}`}
              onClick={() => toggleIndustry(ind)}
            >
              {ind}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Label>Minimum Base Salary</Label>
          <span className="font-semibold">${salary[0]}k+ / yr</span>
        </div>
        <Slider 
          value={salary} 
          onValueChange={(val) => setSalary(val as number[])} 
          max={300} 
          min={50} 
          step={10} 
          className="py-4"
        />
      </div>

      <div className="flex items-center justify-between border rounded-lg p-4">
        <div className="space-y-0.5">
          <Label>Open to Remote</Label>
          <p className="text-sm text-muted-foreground">
            Include fully remote positions in my matches
          </p>
        </div>
        <Switch defaultChecked />
      </div>
    </div>
  );
}
