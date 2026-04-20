import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[100dvh] w-full bg-background">
      {/* Left panel - branding (hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between bg-primary/5 p-12 relative overflow-hidden">
        {/* Abstract background blobs */}
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-primary/10 blur-[120px] mix-blend-multiply" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[70%] rounded-full bg-blue-500/10 blur-[120px] mix-blend-multiply" />
        
        <div className="relative z-10 flex items-center gap-2 font-bold text-2xl tracking-tight text-primary">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
            P
          </div>
          Pathfind
        </div>
        
        <div className="relative z-10 max-w-xl mx-auto space-y-8 pb-12">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Your next career move, automated.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Stop rewriting your resume for every application. Pathfind uses AI to perfectly tailor your applications to each job, multiplying your chances of landing an interview.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center shadow-sm">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">AI-Powered Tailoring</h3>
                <p className="text-sm text-muted-foreground">Custom resumes and cover letters in seconds.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center shadow-sm">
                <div className="h-6 w-6 rounded-md bg-blue-500/20 flex items-center justify-center">
                  <div className="h-3 w-3 bg-blue-500 rounded-sm" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Centralized Tracking</h3>
                <p className="text-sm text-muted-foreground">Monitor every application from one dashboard.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 text-sm text-muted-foreground flex justify-between w-full">
          <span>© 2026 Pathfind AI.</span>
          <div className="space-x-4">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
          </div>
        </div>
      </div>
      
      {/* Right panel - form area */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-8 sm:p-12 relative z-10 bg-background/80 backdrop-blur-xl">
        <div className="w-full max-w-md mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
