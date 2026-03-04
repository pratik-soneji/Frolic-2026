import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, PlayCircle, ChevronDown } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/helpers/useAuth";
import EventImageGrid from "../EventImageGrid";
import RulesSection from "../RulesSection";
import FaqSection from "../FaqSection";
import SocialMediaDock from "../SocialMedia";

export default function StudentWelcome() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  console.log(isAuthenticated);

  return (
    <div className="relative min-h-screen w-full bg-transparent text-white font-sans selection:bg-indigo-500/30">

      {/* --- HERO SECTION --- */}
      <section id="hero" className="relative min-h-screen w-full overflow-hidden bg-[#04070f]">

        {/* Ambient glows */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-[-15%] left-[10%] h-[45rem] w-[45rem] rounded-full bg-[#1E3A8A]/25 blur-[160px]" />
          <div className="absolute top-[-10%] right-[5%] h-[35rem] w-[35rem] rounded-full bg-[#4F46E5]/20 blur-[140px]" />
          <div className="absolute bottom-[-5%] left-[35%] h-[30rem] w-[30rem] rounded-full bg-[#0EA5E9]/15 blur-[120px]" />
        </div>

        {/* Subtle grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
        />

        {/* HERO CONTENT */}
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center pt-20">

          <div className="animate-in fade-in zoom-in duration-700 slide-in-from-bottom-4">
            <Badge
              variant="outline"
              className="mb-6 px-4 py-1.5 rounded-full border-sky-500/30 bg-sky-500/10 text-sky-200 backdrop-blur-md uppercase tracking-widest text-xs font-semibold shadow-[0_0_15px_-3px_rgba(14,165,233,0.4)]"
            >
              <Sparkles className="w-3 h-3 mr-2 text-sky-400" />
              Darshan University Presents
            </Badge>
          </div>

          <h1 className="max-w-5xl mx-auto text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white drop-shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
            FROLIC
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-[#4F46E5]">
              2026
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-lg md:text-xl text-zinc-300 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
            The ultimate cultural phenomenon. Compete, celebrate, and create memories
            in a symphony of <span className="text-sky-400 font-semibold">music</span>,{" "}
            <span className="text-indigo-400 font-semibold">art</span>, and{" "}
            <span className="text-blue-400 font-semibold">passion</span>.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
            {!isAuthenticated && (
              <Button
                size="lg"
                onClick={() => navigate("/login")}
                className="group relative h-12 rounded-full bg-gradient-to-r from-[#1E3A8A] to-[#4F46E5] hover:from-[#1e40af] hover:to-[#4338ca] px-8 text-base font-semibold text-white shadow-[0_0_40px_-10px_rgba(30,58,138,0.7)] hover:shadow-[0_0_60px_-10px_rgba(30,58,138,0.9)] hover:scale-105 transition-all duration-300 border-none"
              >
                Enter as Student
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            )}

            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/events")}
              className="h-12 rounded-full border-white/15 bg-white/5 backdrop-blur-md px-8 text-base font-medium text-white hover:bg-white/10 hover:border-sky-500/40 hover:text-sky-300 transition-all duration-300"
            >
              <PlayCircle className="mr-2 h-4 w-4 text-sky-400" />
              Explore Events
            </Button>
          </div>

          {/* Scroll cue */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40 animate-bounce">
            <span className="text-xs text-white/60 tracking-widest uppercase">Scroll</span>
            <ChevronDown className="h-4 w-4 text-white/60" />
          </div>
        </div>
      </section>

      <div className="relative z-20">
        <Outlet />
      </div>

      <SocialMediaDock />
      <EventImageGrid />
      <RulesSection />
      <FaqSection />
    </div>
  );
}