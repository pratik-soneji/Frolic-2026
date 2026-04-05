import { useState } from "react"
import { Menu, GraduationCap, Moon, Sun, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "@/helpers/useAuth"
import { Separator } from "./ui/separator"
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

  const nav = useNavigate()
  const { pathname } = useLocation()

  const [open, setOpen] = useState(false)

  const { isAuthenticated } = useAuth()
  const { mutate: handleLogout } = useLogout()

  const { theme, toggleTheme } = useTheme()

  const isDark = theme === "dark"

  const scrollToSection = (id: string) => {

    if (pathname !== "/") {
      nav(`/#${id}`)
      return
    }

    const element = document.getElementById(id)

    if (element) {
      const offset = 80
      const bodyRect = document.body.getBoundingClientRect().top
      const elementRect = element.getBoundingClientRect().top
      const elementPosition = elementRect - bodyRect
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  return (

    <header className="fixed top-3 left-1/2 z-50 w-[96%] max-w-7xl -translate-x-1/2">

      <div
        className={`
          flex items-center justify-between
          px-4 py-2.5
          rounded-2xl
          backdrop-blur-xl
          shadow-lg
          ring-1

          ${isDark
            ? "bg-[#0f172a]/85 border-white/10 ring-white/5"
            : "bg-white/90 border-black/10 ring-black/5"
          }
        `}
      >

        {/* Brand */}

        <div
          onClick={() => scrollToSection("hero")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div
            className={`
              flex h-9 w-9 items-center justify-center
              rounded-xl

              ${isDark
                ? "bg-gradient-to-br from-indigo-600 to-violet-600"
                : "bg-black"
              }
            `}
          >
            <GraduationCap className="h-4 w-4 text-white" />
          </div>

          <span
            className={`
              text-sm font-bold tracking-tight

              ${isDark
                ? "text-white"
                : "text-black"
              }
            `}
          >
            Frolic 2026
          </span>
        </div>

        {/* Desktop */}

        <nav className="hidden md:flex items-center gap-2">

          {navLinks.map((item) => (

            <button
              key={item.name}
              onClick={() => scrollToSection(item.id)}
              className={`
                px-4 py-1.5
                rounded-full
                text-sm
                transition

                ${isDark
                  ? "text-white/70 hover:text-white hover:bg-white/10"
                  : "text-black/60 hover:text-black hover:bg-black/5"
                }
              `}
            >
              {item.name}
            </button>

          ))}

        </nav>

        {/* Right Section */}

        <div className="flex items-center gap-2">

          {/* Theme */}

          <button
            onClick={toggleTheme}
            className={`
              flex h-9 w-9 items-center justify-center
              rounded-full transition

              ${isDark
                ? "text-white/70 hover:text-white hover:bg-white/10"
                : "text-black/60 hover:text-black hover:bg-black/5"
              }
            `}
          >
            {isDark
              ? <Sun className="h-4 w-4" />
              : <Moon className="h-4 w-4" />
            }
          </button>

          {/* Register or ProfileMenu */}

          {!isAuthenticated ? (

            <Button
              onClick={() => nav("/signup")}
              size="sm"
              className={`
                hidden md:flex
                rounded-full
                px-5
                text-[13px]
                font-semibold

                ${isDark
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600"
                  : "bg-black"
                }
              `}
            >
              Register
            </Button>

          ) : (
            <ProfileMenu handleLogout={handleLogout} />
          )}

          {/* Mobile Menu */}

          <Sheet open={open} onOpenChange={setOpen}>

            <SheetTrigger asChild>

              <Button
                size="icon"
                variant="ghost"
                className={`
                  md:hidden
                  h-9 w-9

                  ${isDark
                    ? "text-white/70 hover:text-white hover:bg-white/10"
                    : "text-black/60 hover:text-black hover:bg-black/5"
                  }
                `}
              >
                <Menu className="h-5 w-5" />
              </Button>

            </SheetTrigger>

            <SheetContent
              side="right"
              className={`
                w-[85%]
                max-w-[360px]
                p-0
                flex flex-col
                    [&>button]:hidden

                ${isDark
                  ? "bg-[#020617]"
                  : "bg-white"
                }
              `}
            >

              {/* Header */}

              <div className="flex items-center justify-between px-6 py-5">

                <div className="flex items-center gap-3">

                  <div
                    className={`
                      flex h-10 w-10 items-center justify-center
                      rounded-xl

                      ${isDark
                        ? "bg-gradient-to-br from-indigo-600 to-violet-600"
                        : "bg-black"
                      }
                    `}
                  >
                    <GraduationCap className="h-5 w-5 text-white" />
                  </div>

                  <span className="font-semibold text-lg">
                    Navigation
                  </span>

                </div>

                <button
                  onClick={() => setOpen(false)}
                  className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-black/10"
                >
                  <X className="h-5 w-5" />
                </button>

              </div>

              <Separator />

              {/* Links */}

              <div className="flex flex-col px-4 py-4 gap-1 flex-1 overflow-y-auto">

                {navLinks.map((item) => (

                  <button
                    key={item.name}
                    onClick={() => {
                      scrollToSection(item.id)
                      setOpen(false)
                    }}
                    className={`
                      w-full
                      text-left
                      px-4 py-3
                      rounded-xl
                      text-base
                      font-medium
                      transition

                      ${isDark
                        ? "text-white/80 hover:bg-white/10 hover:text-white"
                        : "text-black/70 hover:bg-black/5 hover:text-black"
                      }
                    `}
                  >
                    {item.name}
                  </button>

                ))}

              </div>

              <Separator />

              {/* Bottom Section */}

              <div className="p-4">

                {!isAuthenticated && (

                  <Button
                    onClick={() => nav("/signup")}
                    className="
                      w-full
                      rounded-xl
                      h-11
                      font-semibold
                    "
                  >
                    Register
                  </Button>

                )}

              </div>

            </SheetContent>

          </Sheet>

        </div>

      </div>

    </header>
  )
}