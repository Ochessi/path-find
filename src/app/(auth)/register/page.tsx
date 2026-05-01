"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import { useAuthStore } from "@/store/auth.store";
import { registerSchema } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, isLoading } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: FormData) => {
    await registerUser(data.name, data.email, data.password);
    router.push("/onboarding");
  };

  return (
    <div className="relative isolate overflow-hidden rounded-[40px] bg-slate-950/70 p-6 shadow-[0_48px_140px_-90px_rgba(139,92,246,0.35)] before:absolute before:-left-20 before:top-8 before:h-44 before:w-44 before:rounded-full before:bg-violet-500/20 before:blur-3xl after:absolute after:-right-16 after:bottom-10 after:h-56 after:w-56 after:rounded-full after:bg-sky-500/15 after:blur-3xl">
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-md rounded-[32px] border border-white/10 bg-slate-950/90 p-8 shadow-[0_32px_120px_-80px_rgba(15,23,42,0.7)] backdrop-blur-2xl"
      >
        <div className="space-y-2 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-violet-300/80">Create your account</p>
          <h1 className="text-4xl font-semibold tracking-tight text-white">Join Pathfind</h1>
          <p className="text-slate-400">
            Start your AI-powered job search with a tailored application experience.
          </p>
        </div>

      <div className="mt-8 grid gap-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              disabled={isLoading}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm font-medium text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm font-medium text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Must be at least 8 characters"
              disabled={isLoading}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm font-medium text-destructive">
                {errors.password.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create account
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-950 px-2 text-slate-400">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" disabled={isLoading}>
            Google
          </Button>
          <Button variant="outline" disabled={isLoading}>
            LinkedIn
          </Button>
        </div>
      </div>

      <p className="text-center text-sm text-slate-400 pb-8">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-violet-300 hover:text-violet-200 hover:underline"
        >
          Sign in
        </Link>
      </p>
      </motion.div>
    </div>
  );
}
