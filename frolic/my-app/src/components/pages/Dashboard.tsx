import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/helpers/useAuth";
import RulesSection from "../RulesSection";
import FaqSection from "../FaqSection";
import SocialMediaDock from "../SocialMedia";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";
import EventsPublicPage from "./EventsPublicPage";
import FacilitiesSection from "../FacilitiesSection";
import ContactUsSection from "../ContactUsSection";
import useScrollRestoration from "@/hooks/scroll";
import { useLocation } from "react-router-dom";

export default function StudentWelcome() {
  const navigate = useNavigate();
  const { hash } = useLocation();
  const { isAuthenticated } = useAuth();
  const checkAuth = useAuthStore((s) => s.checkAuth);

  useScrollRestoration();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const id = hash.replace('#', '');
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
      }, 100);
    }
  }, [hash]);

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

  return (
    <div className="relative min-h-screen w-full bg-background text-foreground font-sans selection:bg-foreground/10 overflow-hidden">

      {/* --- HERO SECTION --- */}
      <section id="hero" className="relative min-h-screen w-full flex flex-col items-center pt-32 pb-16">

        {/* Subtle top badge */}
        <div className="animate-in fade-in zoom-in duration-700 slide-in-from-bottom-4 mb-6">
          <Badge
            variant="outline"
            className="px-4 py-1.5 rounded-full border-border/40 bg-foreground/[0.02] text-foreground/50 tracking-widest text-[10px] uppercase font-semibold backdrop-blur-md transition-colors hover:bg-foreground/[0.04]"
          >
            <Sparkles className="w-3 h-3 mr-2 opacity-50" />
            Darshan University Presents
          </Badge>
        </div>

        {/* Apple-style typography */}
        <div className="flex flex-col items-center text-center px-4 z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-6xl md:text-7xl lg:text-[5.5rem] font-semibold tracking-tight text-foreground leading-[1.1]">
            Frolic 2026
          </h1>
          <p className="mt-4 text-xl md:text-2xl font-medium text-foreground/70 tracking-tight max-w-2xl">
            The extraordinary cultural phenomenon.
            <br className="hidden md:block" />
            <span className="text-foreground/45">Experience the ultimate fest.</span>
          </p>
        </div>

        {/* Apple-style action buttons */}
        <div className="mt-8 mb-16 flex flex-row items-center gap-4 z-10 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-150">
          {!isAuthenticated && (
            <Button
              onClick={() => navigate("/login")}
              className="rounded-full bg-[#0071e3] hover:bg-[#0077ED] text-white px-6 h-10 text-[15px] font-medium transition-all"
            >
              Enter as Student
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => scrollToSection('events')}
            className="rounded-full border-[#0071e3] text-[#0071e3] hover:bg-[#0071e3]/10 bg-transparent px-6 h-10 text-[15px] font-medium transition-all"
          >
            Explore Events
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </div>

        {/* MEANINGFUL CENTERPIECE (Event Bento Grid) */}
        <div className="relative w-full max-w-6xl px-4 flex-1 flex flex-col justify-end items-center animate-in fade-in slide-in-from-bottom-24 duration-1200 delay-300">
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mt-12 mb-8">

            {/* Box 1: Music & Arts */}
            <div className="relative  aspect-square md:aspect-auto md:h-100 rounded-[2.5rem] bg-card overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.02)] border border-border/40 -translate-y-8">
              <img
                src="/image4.png"
                alt="Music & Arts"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/40 to-purple-500/0 opacity-60 transition-opacity group-hover:opacity-100" />
              <div className="absolute inset-0 flex flex-col justify-end p-8 z-10">
                <h3 className="text-2xl font-bold tracking-tight text-white mb-2">Music & Arts</h3>
                <p className="text-white/90 text-sm font-medium drop-shadow-sm">Immerse in unparalleled melodies and creative showcases.</p>
              </div>
            </div>

            {/* Box 2: Tech & Innovation (Center - Largest) */}
            <div className="relative aspect-square md:aspect-auto md:h-90 col-span-1 md:col-span-1 border border-border/40 rounded-[2.5rem] bg-card overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.02)] translate-y-0 md:-translate-y-3">
              <img
                src="/finger-pointing-bulb-draw_1134-183.avif"
                alt="Innovation"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 opacity-60 transition-opacity group-hover:opacity-100" />
              <div className="absolute inset-0 flex flex-col justify-end items-center text-center p-8 z-10">
                {/* <div className="w-16 h-16 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 border border-white/20">
                  <Sparkles className="w-8 h-8 text-sky-400" />
                </div> */}
                <h3 className="text-3xl font-bold tracking-tight text-white mb-2">Innovation</h3>
                <p className="text-white/90 text-sm font-medium px-4 drop-shadow-sm">50+ cutting edge tech competitions & hackathons.</p>
              </div>
            </div>

            {/* Box 3: Sports & E-Sports */}
            <div className="relative aspect-square md:aspect-auto md:h-80 md:w-100 rounded-[2.5rem] bg-card overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.02)] border border-border/40">
              <img
                src="/image2.png"
                alt="Sports & Gaming"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-bl from-amber-500/40 to-orange-500/0 opacity-60 transition-opacity group-hover:opacity-100" />
              <div className="absolute inset-0 flex flex-col justify-end p-8 text-right z-10">
                <h3 className="text-2xl font-bold tracking-tight text-white mb-2">Sports & Gaming</h3>
                <p className="text-white/90 text-sm font-medium drop-shadow-sm">Compete in high-stakes physical and digital tournaments.</p>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* REMAINDER OF THE PAGE */}
      <div className="relative z-20 bg-background">
        <Outlet />
        <SocialMediaDock />
        <section id="events">
          <EventsPublicPage />
        </section>
        <section id="rules">
          <RulesSection />
        </section>
        <FacilitiesSection />
        <section id="faq">
          <FaqSection />
        </section>
        <ContactUsSection />
      </div>

    </div>
  );
}