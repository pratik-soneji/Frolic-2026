import {
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";

const XLogo = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    aria-hidden="true"
  >
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
  </svg>
);

export default function SocialMediaDock() {
  const socialLinks = [
    { 
      icon: Linkedin, 
      href: "https://www.linkedin.com/school/darshan-university/", 
      label: "LinkedIn",
      hoverColor: "hover:text-[#0077b5]" 
    },
    { 
      icon: Instagram, 
      href: "https://www.instagram.com/darshan_university/", 
      label: "Instagram",
      hoverColor: "hover:text-[#E4405F]" 
    },
    { 
      icon: XLogo, 
      href: "https://x.com/darshan_univ", 
      label: "X (Twitter)",
      hoverColor: "hover:text-[#1DA1F2]" 
    },
    { 
      icon: Facebook, 
      href: "#", 
      label: "Facebook",
      hoverColor: "hover:text-[#1877F2]" 
    },
    { 
      icon: Youtube, 
      href: "#", 
      label: "YouTube",
      hoverColor: "hover:text-[#FF0000]" 
    },
  ];

  return (
    <div className="flex justify-center w-full py-12 bg-background border-t border-border/40">
      <div className="relative group">
        {/* The Main Pill Container */}
        <div className="relative flex items-center gap-7 rounded-full border-border/60 bg-card px-10 py-5 shadow-sm transition-all duration-500 hover:border-border hover:shadow-md">
          {socialLinks.map((social, index) => {
            const Icon = social.icon;
            return (
              <a
                key={index}
                href={social.href}
                aria-label={social.label}
                className="group/icon relative flex items-center justify-center"
              >
                <Icon className={`h-6 w-6 text-muted-foreground transition-all duration-300 group-hover/icon:-translate-y-1 group-hover/icon:scale-125 ${social.hoverColor}`} />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}