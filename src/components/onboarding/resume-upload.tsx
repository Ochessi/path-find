"use client";

import { useState } from "react";
import { UploadCloud, File, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResumeUploadProps {
  onUploadComplete: () => void;
}

export function ResumeUpload({ onUploadComplete }: ResumeUploadProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(e.target.files[0]);
    }
  };

  const handleUpload = (selectedFile: File) => {
    setFile(selectedFile);
    setIsUploading(true);
    
    // Simulate upload progress
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
          // Optional: auto-advance
          // onUploadComplete();
        }, 500);
      }
    }, 200);
  };

  const resetUpload = () => {
    setFile(null);
    setProgress(0);
    setIsUploading(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {!file ? (
        <div 
          className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center transition-colors cursor-pointer
            ${isHovering ? "border-primary bg-primary/5" : "border-muted-foreground/25"}`}
          onDragOver={(e) => { e.preventDefault(); setIsHovering(true); }}
          onDragLeave={() => setIsHovering(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsHovering(false);
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              handleUpload(e.dataTransfer.files[0]);
            }
          }}
          onClick={() => document.getElementById("resume-upload")?.click()}
        >
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <UploadCloud className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Click or drag and drop to upload</h3>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            Supported formats: PDF, DOCX (Max 5MB)
          </p>
          <input 
            type="file" 
            id="resume-upload" 
            className="hidden" 
            accept=".pdf,.doc,.docx" 
            onChange={handleFileSelect}
          />
        </div>
      ) : (
        <div className="border rounded-xl p-6 flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <File className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="font-medium truncate max-w-[200px] sm:max-w-xs">{file.name}</p>
                <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            {!isUploading && progress === 100 ? (
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={resetUpload}>
                <X className="h-4 w-4" />
              </Button>
            ) : null}
          </div>
          
          {isUploading || progress === 100 ? (
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium text-muted-foreground">
                <span>{progress < 100 ? "Uploading..." : "Complete"}</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-200" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
            </div>
          ) : null}

          {!isUploading && progress === 100 && (
             <div className="bg-green-500/10 text-green-600 dark:text-green-400 p-3 rounded-lg flex items-center gap-2 text-sm mt-2">
               <CheckCircle2 className="h-4 w-4" />
               Upload successful. Ready to parse.
             </div>
          )}
        </div>
      )}

      {!file && (
        <div className="flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Don't have a resume? <Button variant="link" className="p-0 h-auto">Skip this step</Button>
          </p>
        </div>
      )}
    </div>
  );
}
