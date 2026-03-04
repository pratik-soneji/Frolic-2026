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
import { Link, useLocation } from "react-router-dom" // Assuming react-router-dom for MERN

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

// Menu items based on Frolic SRS Admin Modules
const navMain = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Institutes",
    url: "/admin/institutes",
    icon: Building2,
  },
  {
    title: "Departments",
    url: "/admin/departments",
    icon: School,
  },
  {
    title: "Events",
    url: "/admin/events",
    icon: CalendarDays,
  },
]

const navPeople = [
  {
    title: "Users & Coordinators",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "Groups & Participants",
    url: "/admin/groups",
    icon: Users,
  },
]

const navResults = [
  {
    title: "Winners",
    url: "/admin/winners",
    icon: Trophy,
  },
  {
    title: "Reports",
    url: "/admin/reports",
    icon: FileText,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Optional: Used to highlight active link
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Header — Deep Blue Brand */}
      <SidebarHeader className="border-b border-sidebar-border pb-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/admin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-blue-300 shadow-sm">
                  <ShieldCheck className="size-4 text-white" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold text-sidebar-foreground">Frolic Admin</span>
                  <span className="truncate text-xs text-sidebar-foreground/60">Event Manager · 2026</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Management Group */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-widest text-sidebar-foreground/50 px-3 py-2">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={location.pathname === item.url}
                    className="text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent data-[active=true]:bg-sidebar-primary/20 data-[active=true]:text-sidebar-primary data-[active=true]:font-semibold transition-colors"
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* People & Participants Group */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-widest text-sidebar-foreground/50 px-3 py-2">
            People
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navPeople.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={location.pathname === item.url}
                    className="text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent data-[active=true]:bg-sidebar-primary/20 data-[active=true]:text-sidebar-primary data-[active=true]:font-semibold transition-colors"
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Results Group */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-widest text-sidebar-foreground/50 px-3 py-2">
            Results
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navResults.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={location.pathname === item.url}
                    className="text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent data-[active=true]:bg-sidebar-primary/20 data-[active=true]:text-sidebar-primary data-[active=true]:font-semibold transition-colors"
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator className="bg-sidebar-border/60" />

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Settings"
              className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            >
              <Link to="/admin/settings">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors font-medium">
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}