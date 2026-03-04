
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"

import { useForm } from "react-hook-form"
import { useLogin } from "@/api/auth.queries"
import { NavLink } from "react-router-dom"
import { GraduationCap, ShieldCheck, CalendarDays, Trophy } from "lucide-react"

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
    <div className="min-h-screen w-full flex">
      {/* LEFT PANEL — Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#1E3A8A] via-[#1e40af] to-[#4F46E5] p-12">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute top-[-10%] left-[-10%] h-72 w-72 rounded-full bg-sky-500/20 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] h-72 w-72 rounded-full bg-indigo-500/20 blur-[100px]" />

        {/* Content */}
        <div className="relative z-10 max-w-md text-center">
          {/* Logo */}
          <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl">
            <GraduationCap className="h-10 w-10 text-white" />
          </div>

          <h1 className="text-5xl font-black tracking-tighter text-white mb-2">
            FROLIC
            <span className="block text-sky-300">2026</span>
          </h1>
          <p className="mt-4 text-blue-200 text-base leading-relaxed">
            Darshan University's Premier State-Level Cultural &amp; Technical Fest
          </p>

          <Separator className="my-8 bg-white/20" />

          {/* Feature bullets */}
          <div className="space-y-4 text-left">
            {[
              { icon: CalendarDays, label: "Register for 50+ events" },
              { icon: Trophy, label: "Win exciting cash prizes" },
              { icon: ShieldCheck, label: "Secure student portal" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 border border-white/20">
                  <Icon className="h-4 w-4 text-sky-300" />
                </div>
                <span className="text-sm font-medium text-blue-100">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL — Form */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center bg-[#F8FAFC] px-6 py-12">
        {/* Mobile brand */}
        <div className="mb-8 text-center lg:hidden">
          <div className="mx-auto mb-3 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#4F46E5]">
            <GraduationCap className="h-7 w-7 text-white" />
          </div>
          <span className="block text-2xl font-black tracking-tight text-[#0F172A]">
            Frolic <span className="text-[#1E3A8A]">2026</span>
          </span>
          <p className="mt-1 text-sm text-slate-500">Darshan University</p>
        </div>

        <Card className="w-full max-w-[440px] shadow-xl border-[#E2E8F0] bg-white">
          {/* Blue accent top bar */}
          <div className="h-1 w-full rounded-t-lg bg-gradient-to-r from-[#1E3A8A] via-[#4F46E5] to-[#0EA5E9]" />

          <CardHeader className="space-y-1 pt-6 pb-4">
            <CardTitle className="text-2xl font-bold tracking-tight text-[#0F172A]">
              Welcome back
            </CardTitle>
            <CardDescription className="text-slate-500">
              Sign in to your Frolic student account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-sm font-medium text-[#0F172A]">
                  Email address
                </Label>
                <Input
                  id="login-email"
                  {...register("email", { required: "Email is required" })}
                  placeholder="you@example.com"
                  type="text"
                  className="h-11 border-[#E2E8F0] focus-visible:ring-[#1E3A8A] bg-[#F8FAFC]"
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{String(errors.email.message)}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-sm font-medium text-[#0F172A]">
                  Password
                </Label>
                <Input
                  id="login-password"
                  type="password"
                  {...register("password", { required: "Password is required" })}
                  placeholder="••••••••"
                  className="h-11 border-[#E2E8F0] focus-visible:ring-[#1E3A8A] bg-[#F8FAFC]"
                />
                {errors.password && (
                  <p className="text-xs text-destructive">{String(errors.password.message)}</p>
                )}
              </div>

              {/* Remember me row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox id="login-remember" defaultChecked />
                  <Label htmlFor="login-remember" className="text-sm font-normal text-slate-500 cursor-pointer">
                    Remember me
                  </Label>
                </div>
                <NavLink
                  to="/signup"
                  className="text-sm text-[#1E3A8A] hover:text-[#4F46E5] font-medium transition-colors"
                >
                  Don't have an account?
                </NavLink>
              </div>

              {/* API Error */}
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3">
                  <p className="text-sm text-red-600 text-center">
                    {String((error as any).response?.data?.message ?? "Login failed")}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-11 font-semibold bg-gradient-to-r from-[#1E3A8A] to-[#4F46E5] hover:from-[#1e40af] hover:to-[#4338ca] text-white shadow-md hover:shadow-lg transition-all duration-200 border-0"
              >
                {isPending ? "Signing in…" : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-6 text-xs text-slate-400 text-center">
          By continuing, you agree to Frolic's{" "}
          <span className="underline cursor-pointer hover:text-[#1E3A8A] transition-colors">Terms of Service</span>
        </p>
      </div>
    </div>
  )
}
