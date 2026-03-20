import * as React from "react"
import {
  LayoutDashboard,
  Building2,
  School,
  CalendarDays,
  Users,
  Trophy,
  FileText,
  Settings,
  LogOut,
  ShieldCheck
} from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { useAuthStore } from "@/store/useAuthStore"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"

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

const navMain = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Institutes", url: "/admin/institutes", icon: Building2 },
  { title: "Departments", url: "/admin/departments", icon: School },
  { title: "Events", url: "/admin/events", icon: CalendarDays },
]

const navPeople = [
  { title: "Users & Coordinators", url: "/admin/users", icon: Users },
  { title: "Groups & Participants", url: "/admin/groups", icon: Users },
]

const navResults = [
  { title: "Winners", url: "/admin/winners", icon: Trophy },
  { title: "Reports", url: "/admin/reports", icon: FileText },
]

const NavItem = ({ item, isActive }: { item: typeof navMain[0], isActive: boolean }) => (
  <SidebarMenuItem>
    <SidebarMenuButton
      asChild
      tooltip={item.title}
      isActive={isActive}
      className={`
        transition-all duration-150 rounded-lg
        ${isActive
          ? "bg-foreground/[0.08] text-foreground font-semibold border border-foreground/[0.08]"
          : "text-foreground/45 hover:text-foreground/80 hover:bg-foreground/[0.05] border border-transparent"
        }
      `}
    >
      <Link to={item.url} className="flex items-center gap-2.5">
        <item.icon className="h-4 w-4" />
        <span className="text-sm">{item.title}</span>
      </Link>
    </SidebarMenuButton>
  </SidebarMenuItem>
)

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const { mutate: handleLogout } = useLogout();

  return (
    <Sidebar
      collapsible="icon"
      {...props}
    >
      {/* Header */}
      <SidebarHeader className="border-b border-sidebar-border pb-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-sidebar-accent/50">
              <Link to="/admin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
                  <ShieldCheck className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold text-sidebar-foreground">Frolic Admin</span>
                  <span className="truncate text-xs text-sidebar-foreground/50">Event Manager · 2026</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2 py-2">
        {/* Management Group */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-widest text-sidebar-foreground/30 px-2 py-2">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {navMain.map((item) => (
                <NavItem key={item.title} item={item} isActive={location.pathname === item.url} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* People Group */}
        <SidebarGroup className="mt-2">
          <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-widest text-sidebar-foreground/30 px-2 py-2">
            People
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {navPeople.map((item) => (
                <NavItem key={item.title} item={item} isActive={location.pathname === item.url} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Results Group */}
        <SidebarGroup className="mt-2">
          <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-widest text-sidebar-foreground/30 px-2 py-2">
            Results
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {navResults.map((item) => (
                <NavItem key={item.title} item={item} isActive={location.pathname === item.url} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator className="bg-sidebar-border/60" />

      <SidebarFooter className="px-2 py-2">
        <SidebarMenu className="space-y-0.5">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Settings"
              className="text-sidebar-foreground/40 hover:text-sidebar-foreground/70 hover:bg-sidebar-accent/50 rounded-lg transition-colors border border-transparent"
            >
              <Link to="/admin/settings" className="flex items-center gap-2.5">
                <Settings className="h-4 w-4" />
                <span className="text-sm font-medium">Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => handleLogout()}
              className="text-red-500/70 hover:text-red-500 hover:bg-red-500/[0.08] rounded-lg transition-colors font-medium border border-transparent"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}