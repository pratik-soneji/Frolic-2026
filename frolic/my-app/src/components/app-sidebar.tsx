import * as React from "react"
import {
  LayoutDashboard,
  Building2,
  School,
  CalendarDays,
  Users,
  Trophy,
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
  { title: "Participants", url: "/admin/participants", icon: Users },
]

const navResults = [
  { title: "Winners", url: "/admin/winners", icon: Trophy },

]

const NavItem = ({ item, isActive }: { item: typeof navMain[0], isActive: boolean }) => (
  <SidebarMenuItem>
    <SidebarMenuButton
      asChild
      tooltip={item.title}
      isActive={isActive}
      className={`  
        transition-all duration-200 
        group-data-[collapsible=icon]:justify-center
        ${isActive
          ? "bg-sidebar-accent text-sidebar-foreground font-semibold shadow-sm rounded-lg"
          : "text-sidebar-foreground/50 hover:text-sidebar-foreground/90 hover:bg-sidebar-accent/60 rounded-lg"
        }
      `}
    >
      <Link to={item.url} className="flex items-center gap-3">
        <item.icon className={`h-4.5 w-4.5 shrink-0 transition-colors ${isActive ? 'text-violet-500 dark:text-violet-400' : ''}`} />
        <span className="text-sm truncate">{item.title}</span>
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
      className="border-r border-sidebar-border/50"
      {...props}
    >
      {/* Header */}
      <SidebarHeader className="border-b border-sidebar-border/50 pb-3 pt-4 px-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-transparent p-0 active:bg-transparent">
              <Link to="/admin" className="flex items-center gap-3">
                <div className="flex shrink-0 aspect-square size-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-sm ring-1 ring-white/10 group-data-[collapsible=icon]:mx-auto">
                  <ShieldCheck className="size-4.5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-bold tracking-tight text-[15px] text-sidebar-foreground">Frolic Admin</span>
                  <span className="truncate text-[10px] uppercase tracking-wider font-semibold text-sidebar-foreground/50">Dashboard</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="py-2 px-1">
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
              onClick={() => handleLogout()}
              className="text-sidebar-foreground/50 hover:text-red-500 hover:bg-red-500/[0.08] rounded-xl transition-all duration-200 font-medium border border-transparent hover:border-red-500/10"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm">Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}