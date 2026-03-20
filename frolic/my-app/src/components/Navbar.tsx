import { useState } from "react"
import { LogOut, Menu, GraduationCap, Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/helpers/useAuth"
import { Separator } from "./ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useAuthStore } from "@/store/useAuthStore"
import { useMutation } from "@tanstack/react-query"
import ProfileMenu from "./profile-menu"
import { useTheme } from "@/hooks/useTheme"

const navLinks = [
  { name: "Home", id: "hero" },
  { name: "Events", id: "events" },
  { name: "Rules", id: "rules" },
  { name: "Facilities", id: "facilities" },
  { name: "FAQ", id: "faq" },
  { name: "Contact Us", id: "contact" },
]

const useLogout = () => {
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      navigate("/login")
    },
  })
}

export default function Navbar() {
  const nav = useNavigate();
  const [open, setOpen] = useState(false)
  const { isAuthenticated, user } = useAuth();
  const { mutate: handleLogout } = useLogout();
  const { theme, toggleTheme } = useTheme();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const isDark = theme === "dark"

  return (
    <header className="fixed top-4 left-1/2 z-50 w-[95%] max-w-7xl -translate-x-1/2">
      <div className={`flex items-center justify-between rounded-full border px-5 py-2.5 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] ring-1 transition-all duration-300
        ${isDark
          ? "border-white/10 bg-[#0a0f1e]/85 ring-white/5"
          : "border-black/[0.08] bg-white/90 ring-black/5 shadow-[0_8px_40px_rgba(0,0,0,0.06)]"
        }`}
      >

        {/* LEFT — Brand */}
        <div
          className="flex items-center gap-2.5 cursor-pointer select-none"
          onClick={() => scrollToSection('hero')}
        >
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg shadow-sm
            ${isDark
              ? "bg-gradient-to-br from-[#1E3A8A] to-[#4F46E5]"
              : "bg-black"
            }`}
          >
            <GraduationCap className="h-4 w-4 text-white" />
          </div>
          <span className={`text-sm font-bold tracking-tight hidden sm:block ${isDark ? "text-white/95" : "text-black"}`}>
            Frolic <span className={isDark ? "text-sky-400" : "text-gray-500"}>2026</span>
          </span>
        </div>

        {/* CENTER — Desktop Nav */}
        <nav className="hidden md:flex items-center gap-0.5 text-sm font-medium">
          {navLinks.map((item) => (
            <button
              key={item.name}
              onClick={() => scrollToSection(item.id)}
              className={`px-3.5 py-1.5 rounded-full transition-all duration-200 bg-transparent border-none cursor-pointer text-[13px] font-medium
                ${isDark
                  ? "text-white/55 hover:text-white hover:bg-white/8"
                  : "text-black/50 hover:text-black hover:bg-black/[0.05]"
                }`}
            >
              {item.name}
            </button>
          ))}
        </nav>

        {/* RIGHT — Theme toggle + Auth */}
        <div className="hidden md:flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 cursor-pointer border-none
              ${isDark
                ? "text-white/50 hover:text-white hover:bg-white/10"
                : "text-black/40 hover:text-black hover:bg-black/[0.06]"
              }`}
          >
            {isDark
              ? <Sun className="h-4 w-4" />
              : <Moon className="h-4 w-4" />
            }
          </button>

          {!isAuthenticated ? (
            <Button
              onClick={() => nav('/signup')}
              size="sm"
              className={`rounded-full text-white px-5 transition-all border-0 text-[13px] font-semibold
                ${isDark
                  ? "bg-gradient-to-r from-[#1E3A8A] to-[#4F46E5] hover:from-[#1e40af] hover:to-[#4338ca] shadow-[0_0_20px_rgba(30,58,138,0.4)] hover:shadow-[0_0_30px_rgba(30,58,138,0.6)]"
                  : "bg-black hover:bg-black/80"
                }`}
            >
              Register
            </Button>
          ) : (
            <ProfileMenu handleLogout={handleLogout} />
          )}
        </div>

        {/* MOBILE MENU */}
        <div className="flex items-center gap-1.5 md:hidden">
          {/* Mobile theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 cursor-pointer border-none
              ${isDark
                ? "text-white/50 hover:text-white hover:bg-white/10"
                : "text-black/40 hover:text-black hover:bg-black/[0.06]"
              }`}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost" className={`h-8 w-8 ${isDark ? "text-white/70 hover:text-white hover:bg-white/10" : "text-black/50 hover:text-black hover:bg-black/[0.06]"}`}>
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className={`w-72 ${isDark ? "bg-[#0a0f1e]/98 border-white/10" : "bg-white border-black/10"}`}>
              <div className="flex flex-col gap-6 pt-8">
                <div className="mb-2">
                  <p className={`text-xs font-semibold uppercase tracking-widest px-1 mb-3 ${isDark ? "text-white/30" : "text-black/30"}`}>Navigation</p>
                  {navLinks.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => {
                        scrollToSection(item.id);
                        setOpen(false);
                      }}
                      className={`w-full text-left text-base font-medium px-3 py-2.5 rounded-lg transition-all bg-transparent border-none cursor-pointer
                        ${isDark ? "text-white/70 hover:text-white hover:bg-white/8" : "text-black/60 hover:text-black hover:bg-black/[0.05]"}`}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>

                <Separator className={isDark ? "bg-white/10" : "bg-black/10"} />

                {!isAuthenticated && (
                  <Button
                    onClick={() => { nav('/signup'); setOpen(false); }}
                    className={`rounded-full text-white font-semibold border-0
                      ${isDark ? "bg-gradient-to-r from-[#1E3A8A] to-[#4F46E5]" : "bg-black hover:bg-black/80"}`}
                  >
                    Register
                  </Button>
                )}

                {isAuthenticated && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 px-1">
                      <Avatar className={`h-9 w-9 shrink-0 ring-2 ${isDark ? "ring-[#4F46E5]/30" : "ring-black/10"}`}>
                        {user?.avatar && <AvatarImage src={user.avatar} alt={user?.userName} />}
                        <AvatarFallback className={`text-sm font-bold ${isDark ? "bg-gradient-to-br from-[#1E3A8A] to-[#4F46E5] text-white" : "bg-black text-white"}`}>
                          {user?.userName?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className={`text-sm font-semibold truncate ${isDark ? "text-white" : "text-black"}`}>{user?.userName}</p>
                        <p className={`text-xs truncate ${isDark ? "text-white/40" : "text-black/40"}`}>{user?.email}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => { handleLogout(); setOpen(false); }}
                      variant="outline"
                      className={`${isDark ? "border-white/10 bg-white/5 text-white/70 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30" : "border-black/10 text-black/60 hover:bg-red-50 hover:text-red-600 hover:border-red-200"}`}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
