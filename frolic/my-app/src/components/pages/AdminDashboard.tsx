import { Outlet } from "react-router-dom";
import { AppSidebar } from "../app-sidebar";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import { ShieldCheck, GraduationCap } from "lucide-react";

export default function EventsDashboard() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 w-full relative bg-[#F8FAFC]">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-[#E2E8F0] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 px-4 shadow-sm">
          <SidebarTrigger className="text-slate-500 hover:text-[#1E3A8A] hover:bg-blue-50 transition-colors" />
          <Separator orientation="vertical" className="h-5 bg-[#E2E8F0]" />

          {/* Left — Admin badge */}
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-[#1E3A8A] to-[#4F46E5] shadow-sm">
              <ShieldCheck className="h-4 w-4 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold text-[#0F172A] tracking-tight">Admin Panel</span>
              <span className="text-[10px] text-slate-400 font-medium">Frolic 2026</span>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1">
              <GraduationCap className="h-3.5 w-3.5 text-[#1E3A8A]" />
              <span className="text-xs font-semibold text-[#1E3A8A]">Darshan University</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  )
}