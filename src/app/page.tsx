import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Target, Zap, LayoutDashboard } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background selection:bg-primary/20">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 border-b bg-background/80 backdrop-blur-xl transition-all">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
              P
            </div>
            Pathfind
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
              Log in
            </Link>
            <Link href="/register" className={buttonVariants({ size: "sm", className: "rounded-full" })}>
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 overflow-hidden">
          {/* Abstract background elements */}
          <div className="absolute top-0 inset-x-0 h-[500px] pointer-events-none -z-10 overflow-hidden">
            <div className="absolute left-[50%] top-0 -translate-x-[50%] w-[1000px] h-[500px] opacity-20 dark:opacity-10 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-500 rounded-full blur-[100px] mix-blend-multiply" />
            </div>
          </div>

          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary mb-8 text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Sparkles className="h-4 w-4" />
              <span>The future of job applications is here</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl mx-auto mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
              Land your dream job, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">fully automated.</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
              Pathfind uses AI to perfectly tailor your resume and cover letter for every application. Retain complete control while multiplying your interview rate.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
              <Link href="/register" className={buttonVariants({ size: "lg", className: "rounded-full px-8 h-14 text-base w-full sm:w-auto" })}>
                Start for free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="/login" className={buttonVariants({ variant: "outline", size: "lg", className: "rounded-full px-8 h-14 text-base w-full sm:w-auto" })}>
                View Demo
              </Link>
            </div>
            
            {/* Mockup Preview */}
            <div className="mt-20 relative max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-blue-500 rounded-2xl blur opacity-30" />
              <div className="relative rounded-xl overflow-hidden border bg-background shadow-2xl">
                <div className="h-10 border-b bg-muted/50 flex items-center px-4 gap-2">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-400" />
                    <div className="h-3 w-3 rounded-full bg-amber-400" />
                    <div className="h-3 w-3 rounded-full bg-green-400" />
                  </div>
                </div>
                <div className="aspect-[16/9] bg-muted/20 p-8 flex items-center justify-center">
                  <p className="text-muted-foreground flex items-center gap-2">
                    <LayoutDashboard className="h-5 w-5" />
                    Interactive dashboard preview
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Why use Pathfind?</h2>
              <p className="text-lg text-muted-foreground">
                We&apos;ve rethinking the entire job application pipeline so you can focus on interviewing, not applying.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-background border rounded-2xl p-8 shadow-sm">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Semantic Matching</h3>
                <p className="text-muted-foreground">
                  Our AI doesn&apos;t just look for keywords. It understands your experience and matches it with job requirements semantically.
                </p>
              </div>
              
              <div className="bg-background border rounded-2xl p-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3">
                  <Badge className="bg-blue-500 hover:bg-blue-600">Core Feature</Badge>
                </div>
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6">
                  <Sparkles className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">Instant Tailoring</h3>
                <p className="text-muted-foreground">
                  Generate perfectly crafted, ATS-friendly resumes and cover letters specifically tailored to each individual job posting.
                </p>
              </div>
              
              <div className="bg-background border rounded-2xl p-8 shadow-sm">
                <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-6">
                  <Zap className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">1-Click Apply</h3>
                <p className="text-muted-foreground">
                  Review the automatically generated materials, tweak if necessary, and submit your application with a single click.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 bg-background">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight text-primary">
            <div className="h-6 w-6 rounded border bg-primary flex items-center justify-center text-primary-foreground text-xs">
              P
            </div>
            Pathfind
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Pathfind AI. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground">Privacy</Link>
            <Link href="#" className="hover:text-foreground">Terms</Link>
            <Link href="#" className="hover:text-foreground">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
