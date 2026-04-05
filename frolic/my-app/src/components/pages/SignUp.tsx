import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegister } from "@/api/auth.queries";
import { NavLink } from "react-router-dom";
import { GraduationCap, Activity, Cpu, Trophy } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export interface signupFormProps {
  email: string
  password: string
  phone: Number
  userName: string
}

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<signupFormProps>()

  const { mutate, isPending, error } = useRegister()

  const onSubmit = (formData: signupFormProps) => {
    mutate(formData)
  }

  return (
    <div className="min-h-screen w-full flex bg-background text-foreground selection:bg-foreground/10">
      
      {/* LEFT PANEL — Branding */}
      <div className="hidden lg:flex lg:w-[45%] relative flex-col items-center justify-center p-14 border-r border-border bg-muted/20 overflow-hidden">
        {/* Apple-style clean background gradients */}
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-foreground/[0.02] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-foreground/[0.015] rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 max-w-md w-full">
          <div className="mb-10 inline-flex">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground text-background shadow-lg shadow-foreground/10">
              <GraduationCap className="h-7 w-7" />
            </div>
          </div>

          <p className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-widest">
            Darshan University
          </p>

          <h1 className="text-5xl font-black tracking-tight leading-tight">
            JOIN FROLIC
          </h1>
          
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-sm">
            Create an account to register for events, form teams, and manage your participation.
          </p>

          <Separator className="my-10 bg-border/60" />

          <div className="space-y-6">
            {[
              { icon: Activity, title: "Compete", label: "Join over 50+ cutting-edge events." },
              { icon: Trophy, title: "Win", label: "Massive cash prizes and trophies." },
              { icon: Cpu, title: "Innovate", label: "Showcase your best technical skills." },
            ].map(({ icon: Icon, title, label }) => (
              <div key={title} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-card border border-border/80 shadow-sm text-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-snug mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL — Form */}
      <div className="flex w-full lg:w-[55%] flex-col items-center justify-center relative px-6 py-10 lg:py-12 overflow-y-auto">
        {/* Mobile brand hidden on desktop */}
        <div className="mb-8 text-center lg:hidden relative z-10 flex flex-col items-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground text-background shadow-lg">
             <GraduationCap className="h-7 w-7" />
          </div>
          <span className="block text-3xl font-black tracking-tight">FROLIC 2026</span>
          <p className="mt-1 text-sm text-muted-foreground">Darshan University</p>
        </div>

        <div className="relative w-full max-w-[380px] my-auto">
          
          <div className="mb-8 text-center sm:text-left">
            <h2 className="text-[28px] font-bold tracking-tight text-foreground">Create account</h2>
            <p className="mt-2 text-sm text-muted-foreground">Enter your details to get started</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Username */}
            <div className="space-y-1.5">
              <Label htmlFor="signup-username" className="text-xs font-semibold text-muted-foreground uppercase tracking-widest pl-1">
                Username
              </Label>
              <Input
                id="signup-username"
                {...register("userName", { required: "Username is required" })}
                placeholder="johndoe"
                type="text"
                className="h-11 bg-card border-border/80 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-violet-500/30 focus-visible:border-violet-500/50 rounded-xl shadow-sm transition-all px-4"
              />
              {errors.userName && (
                <p className="text-xs text-red-500 pl-1">{String(errors.userName.message)}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="signup-email" className="text-xs font-semibold text-muted-foreground uppercase tracking-widest pl-1">
                Email
              </Label>
              <Input
                id="signup-email"
                {...register("email", { required: "Email is required" })}
                placeholder="you@example.com"
                type="email"
                className="h-11 bg-card border-border/80 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-violet-500/30 focus-visible:border-violet-500/50 rounded-xl shadow-sm transition-all px-4"
              />
              {errors.email && (
                <p className="text-xs text-red-500 pl-1">{String(errors.email.message)}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="signup-password" className="text-xs font-semibold text-muted-foreground uppercase tracking-widest pl-1">
                Password
              </Label>
              <Input
                id="signup-password"
                type="password"
                {...register("password", { required: "Password is required" })}
                placeholder="••••••••"
                className="h-11 bg-card border-border/80 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-violet-500/30 focus-visible:border-violet-500/50 rounded-xl shadow-sm transition-all px-4 font-mono tracking-widest"
              />
              {errors.password && (
                <p className="text-xs text-red-500 pl-1">{String(errors.password.message)}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label htmlFor="signup-phone" className="text-xs font-semibold text-muted-foreground uppercase tracking-widest pl-1">
                Phone
              </Label>
              <Input
                id="signup-phone"
                type="number"
                {...register("phone", { required: "Phone is required" })}
                placeholder="9876543210"
                className="h-11 bg-card border-border/80 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-violet-500/30 focus-visible:border-violet-500/50 rounded-xl shadow-sm transition-all px-4"
              />
              {errors.phone && (
                <p className="text-xs text-red-500 pl-1">{String(errors.phone.message)}</p>
              )}
            </div>

            {/* API Error */}
            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 mt-2">
                <p className="text-sm font-medium text-red-600 dark:text-red-400 text-center">
                  {String((error as any).response?.data?.message ?? "Signup failed")}
                </p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-11 mt-4 font-semibold bg-foreground hover:bg-foreground/90 text-background shadow-lg hover:shadow-xl transition-all rounded-xl flex justify-center items-center gap-2 group hover:scale-[1.01]"
            >
              {isPending ? "Creating account…" : "Continue"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground font-medium">
            <span>Already have an account? </span>
            <NavLink
              to="/login"
              className="text-foreground hover:underline font-semibold transition-all"
            >
              Sign in
            </NavLink>
          </div>
          
          <div className="mt-8 text-center flex items-center justify-center gap-2 text-xs text-muted-foreground font-medium">
            <span>By proceeding, you agree to our</span>
            <span className="text-foreground hover:underline cursor-pointer">Terms</span>
          </div>
        </div>
      </div>
    </div>
  )
}