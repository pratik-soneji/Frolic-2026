import { Outlet } from "react-router-dom";
import { AppSidebar } from "../app-sidebar";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import { ShieldCheck, GraduationCap } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { Moon, Sun } from "lucide-react";

export default function EventsDashboard() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 w-full relative bg-background min-h-screen">

        {/* Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border/50 bg-background/85 backdrop-blur-2xl backdrop-saturate-150 px-6">
          <SidebarTrigger className="text-foreground/40 hover:text-foreground hover:bg-foreground/[0.06] transition-all duration-200 rounded-lg" />
          <Separator orientation="vertical" className="h-5 bg-border/50" />

          {/* Left — Admin badge */}
          <div className="flex items-center gap-2.5">
            <div className={`flex h-7 w-7 items-center justify-center rounded-lg shadow-sm ${isDark ? "bg-gradient-to-br from-indigo-500 to-blue-600" : "bg-black"}`}>
              <ShieldCheck className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold text-foreground tracking-tight">Admin Panel</span>
              <span className="text-[10px] text-foreground/35 font-medium">Frolic 2026</span>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className={`flex items-center gap-1.5 rounded-full border px-3 py-1 transition-colors ${isDark ? "border-indigo-500/20 bg-indigo-500/10 hover:bg-indigo-500/15" : "border-black/10 bg-black/[0.04] hover:bg-black/[0.06]"}`}>
              <GraduationCap className={`h-3.5 w-3.5 ${isDark ? "text-indigo-400" : "text-black/60"}`} />
              <span className={`text-xs font-semibold ${isDark ? "text-indigo-300" : "text-black/70"}`}>Darshan University</span>
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-foreground/40 hover:text-foreground hover:bg-foreground/[0.06] transition-all duration-200 cursor-pointer border-none bg-transparent"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 lg:p-8 relative z-10">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  )
}