
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"

import { useForm } from "react-hook-form"
import { useLogin } from "@/api/auth.queries"
import { NavLink } from "react-router-dom"
import { GraduationCap, ArrowRight, Activity, Cpu, Box, Trophy } from "lucide-react"

export interface loginFormProps {
  email: string
  password: string
}

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginFormProps>()

  const { mutate, isPending, error } = useLogin()

  const onSubmit = (formData: loginFormProps) => {
    mutate(formData)
  }

  return (
    <div className="min-h-screen w-full flex bg-background text-foreground selection:bg-foreground/10">
      
      {/* LEFT PANEL — Branding */}
      <div className="hidden lg:flex lg:w-[45%] relative flex-col items-center justify-center p-14 border-r border-border bg-muted/20 overflow-hidden">
        {/* Apple-style clean background gradients */}
        <div className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-foreground/[0.02] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50rem] h-[50rem] bg-foreground/[0.015] rounded-full blur-[120px] pointer-events-none" />
        
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
            FROLIC 2026
          </h1>
          
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-sm">
            The premier state-level technical symposium. Elevate your skills.
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
      <div className="flex w-full lg:w-[55%] flex-col items-center justify-center relative px-6 py-12">
        {/* Mobile brand hidden on desktop */}
        <div className="mb-10 text-center lg:hidden relative z-10 flex flex-col items-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground text-background shadow-lg">
             <GraduationCap className="h-7 w-7" />
          </div>
          <span className="block text-3xl font-black tracking-tight">FROLIC 2026</span>
          <p className="mt-1 text-sm text-muted-foreground">Darshan University</p>
        </div>

        <div className="relative w-full max-w-[380px]">
          
          <div className="mb-8 text-center sm:text-left">
            <h2 className="text-[28px] font-bold tracking-tight text-foreground">Sign in</h2>
            <p className="mt-2 text-sm text-muted-foreground">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="login-email" className="text-xs font-semibold text-muted-foreground uppercase tracking-widest pl-1">
                Email
              </Label>
              <Input
                id="login-email"
                {...register("email", { required: "Email is required" })}
                placeholder="you@example.com"
                type="text"
                className="h-12 bg-card border-border/80 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-foreground focus-visible:border-foreground rounded-xl shadow-sm transition-all text-base px-4"
              />
              {errors.email && (
                <p className="text-xs text-red-500 pl-1">{String(errors.email.message)}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="login-password" className="text-xs font-semibold text-muted-foreground uppercase tracking-widest pl-1">
                Password
              </Label>
              <Input
                id="login-password"
                type="password"
                {...register("password", { required: "Password is required" })}
                placeholder="••••••••"
                className="h-12 bg-card border-border/80 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-foreground focus-visible:border-foreground rounded-xl shadow-sm transition-all text-base px-4 font-mono tracking-widest"
              />
              {errors.password && (
                <p className="text-xs text-red-500 pl-1">{String(errors.password.message)}</p>
              )}
            </div>

            {/* Remember me row */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2.5 pl-1">
                <Checkbox id="login-remember" defaultChecked className="border-muted-foreground/40 data-[state=checked]:bg-foreground data-[state=checked]:border-foreground rounded-[4px]" />
                <Label htmlFor="login-remember" className="text-sm text-muted-foreground cursor-pointer font-medium select-none">
                  Remember me
                </Label>
              </div>
              <NavLink
                to="/signup"
                className="text-sm font-semibold text-foreground hover:text-foreground/70 transition-colors"
              >
                 Create an account
              </NavLink>
            </div>

            {/* API Error */}
            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 mt-2">
                <p className="text-sm font-medium text-red-600 dark:text-red-400 text-center">
                  {String((error as any).response?.data?.message ?? "Login failed")}
                </p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-12 mt-4 font-semibold bg-foreground hover:bg-foreground/90 text-background shadow-md transition-all rounded-xl text-base flex justify-center items-center gap-2 group"
            >
              {isPending ? "Authenticating…" : "Continue"}
            </Button>
          </form>

          <div className="mt-8 text-center flex items-center justify-center gap-2 text-xs text-muted-foreground font-medium">
            <span>By proceeding, you agree to our</span>
            <span className="text-foreground hover:underline cursor-pointer">Terms</span>
            <span>&amp;</span>
            <span className="text-foreground hover:underline cursor-pointer">Privacy</span>
          </div>
        </div>
      </div>
    </div>
  )
}
