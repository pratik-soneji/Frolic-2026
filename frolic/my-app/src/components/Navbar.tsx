import { useState } from "react"
import { LogOut, Menu, GraduationCap } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/helpers/useAuth"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import { Separator } from "./ui/separator"
import { Avatar, AvatarFallback } from "./ui/avatar"

const navLinks = [
  { name: "Home", id: "hero" },
  { name: "Events", id: "events" },
  { name: "Rules", id: "rules" },
  { name: "Facilities", id: "facilities" },
  { name: "FAQ", id: "faq" },
  { name: "Contact Us", id: "contact" },
]

export default function Navbar() {
  const nav = useNavigate();
  const [open, setOpen] = useState(false)
  const { isAuthenticated, user } = useAuth();

  // Function to handle smooth scrolling with offset
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
  console.log(user);

  const logOut = () => {
    localStorage.removeItem("token");
    nav("/login");
  }

  return (
    <header className="fixed top-4 left-1/2 z-50 w-[95%] max-w-7xl -translate-x-1/2">
      <div className="flex items-center justify-between rounded-full border border-white/10 bg-[#0a0f1e]/85 px-5 py-2.5 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.5)] ring-1 ring-white/5">

        {/* LEFT — Brand */}
        <div
          className="flex items-center gap-2.5 cursor-pointer select-none"
          onClick={() => scrollToSection('hero')}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#1E3A8A] to-[#4F46E5] shadow-md">
            <GraduationCap className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-bold tracking-tight text-white/95 hidden sm:block">
            Frolic <span className="text-sky-400">2026</span>
          </span>
        </div>

        {/* CENTER — Desktop Nav */}
        <nav className="hidden md:flex items-center gap-0.5 text-sm font-medium">
          {navLinks.map((item) => (
            <button
              key={item.name}
              onClick={() => scrollToSection(item.id)}
              className="px-3.5 py-1.5 rounded-full text-white/55 hover:text-white hover:bg-white/8 transition-all duration-200 bg-transparent border-none cursor-pointer text-[13px]"
            >
              {item.name}
            </button>
          ))}
        </nav>

        {/* RIGHT — Auth */}
        <div className="hidden md:flex items-center gap-2">
          {!isAuthenticated ? (
            <Button
              onClick={() => nav('/signup')}
              size="sm"
              className="rounded-full bg-gradient-to-r from-[#1E3A8A] to-[#4F46E5] hover:from-[#1e40af] hover:to-[#4338ca] text-white px-5 shadow-[0_0_20px_rgba(30,58,138,0.4)] hover:shadow-[0_0_30px_rgba(30,58,138,0.6)] transition-all border-0 text-[13px] font-semibold"
            >
              Register
            </Button>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#4F46E5] text-white text-sm font-bold shadow-[0_0_16px_rgba(30,58,138,0.5)] hover:scale-105 transition-transform cursor-pointer border-none ring-2 ring-white/10">
                  {user?.userName?.charAt(0).toUpperCase()}
                </button>
              </DialogTrigger>

              <DialogContent className="border-white/10 bg-[#0b0f1a] backdrop-blur-xl p-6 max-w-xs rounded-2xl">
                {/* Avatar */}
                <div className="flex flex-col items-center gap-4 pt-2">
                  <Avatar className="h-16 w-16 ring-2 ring-[#4F46E5]/50">
                    <AvatarFallback className="bg-gradient-to-br from-[#1E3A8A] to-[#4F46E5] text-2xl font-bold text-white">
                      {user?.userName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <p className="text-base font-semibold text-white">{user?.userName}</p>
                    <p className="text-sm text-white/50">{user?.email}</p>
                  </div>
                  <Separator className="bg-white/10 w-full" />
                  <Button
                    onClick={logOut}
                    variant="outline"
                    className="w-full border-white/10 bg-white/5 text-white hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* MOBILE MENU */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button size="icon" variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 h-8 w-8">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="bg-[#0a0f1e]/98 border-white/10 w-72">
            <div className="flex flex-col gap-6 pt-8">
              <div className="mb-2">
                <p className="text-xs font-semibold text-white/30 uppercase tracking-widest px-1 mb-3">Navigation</p>
                {navLinks.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      scrollToSection(item.id);
                      setOpen(false);
                    }}
                    className="w-full text-left text-base font-medium text-white/70 hover:text-white px-3 py-2.5 rounded-lg hover:bg-white/8 transition-all bg-transparent border-none cursor-pointer"
                  >
                    {item.name}
                  </button>
                ))}
              </div>

              <Separator className="bg-white/10" />

              {!isAuthenticated && (
                <Button
                  onClick={() => { nav('/signup'); setOpen(false); }}
                  className="rounded-full bg-gradient-to-r from-[#1E3A8A] to-[#4F46E5] text-white shadow-[0_0_20px_rgba(30,58,138,0.3)] border-0 font-semibold"
                >
                  Register
                </Button>
              )}

              {isAuthenticated && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 px-1">
                    <Avatar className="h-9 w-9 ring-2 ring-[#4F46E5]/30 shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-[#1E3A8A] to-[#4F46E5] text-white text-sm font-bold">
                        {user?.userName?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{user?.userName}</p>
                      <p className="text-xs text-white/40 truncate">{user?.email}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => nav("/logout")}
                    variant="outline"
                    className="border-white/10 bg-white/5 text-white/70 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30"
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
    </header>
  )
}
