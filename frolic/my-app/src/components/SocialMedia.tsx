import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Sparkles
} from "lucide-react";

export default function SocialMediaDock() {
  const socialLinks = [
    { icon: Linkedin, href: "#", label: "LinkedIn", color: "group-hover/icon:text-sky-400" },
    { icon: Instagram, href: "#", label: "Instagram", color: "group-hover/icon:text-indigo-400" },
    { icon: Twitter, href: "#", label: "Twitter", color: "group-hover/icon:text-sky-300" },
    { icon: Facebook, href: "#", label: "Facebook", color: "group-hover/icon:text-blue-400" },
    { icon: Youtube, href: "#", label: "YouTube", color: "group-hover/icon:text-red-400" },
  ];

  return (
    <div className="flex justify-center w-full py-12 bg-[#04070f]">
      <div className="relative group">
        {/* The Main Pill Container */}
        <div className="relative flex items-center gap-7 rounded-full border border-zinc-800 bg-zinc-900/80 px-10 py-5 backdrop-blur-xl shadow-2xl shadow-black/50 transition-all duration-500 hover:border-sky-500/30 hover:shadow-[0_0_40px_-5px_rgba(14,165,233,0.2)]">

          {/* Decorative Sparkle */}
          <Sparkles className="absolute -top-3 -right-2 h-5 w-5 text-sky-500 animate-pulse" />

          {socialLinks.map((social, index) => {
            const Icon = social.icon;
            return (
              <a
                key={index}
                href={social.href}
                aria-label={social.label}
                className="group/icon relative flex items-center justify-center"
              >
                {/* Glow blob */}
                <div className="absolute inset-0 -z-10 h-full w-full scale-0 rounded-full bg-sky-600/50 blur-xl transition-all duration-300 group-hover/icon:scale-150 group-hover/icon:opacity-100 opacity-0" />

                {/* Icon */}
                <Icon className={`h-6 w-6 text-zinc-500 transition-all duration-300 group-hover/icon:-translate-y-1 group-hover/icon:scale-125 ${social.color}`} />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}