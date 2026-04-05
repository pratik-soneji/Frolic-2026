import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CalendarDays, Building2, Trophy } from "lucide-react";
import { apiAdmin } from "@/constants/api";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStats {
  totalEvents: number;
  totalParticipants: number;
  totalInstitutes: number;
  totalWinnersDeclared: number;
  recentActivity: { _id: string; count: number }[];
}

export default function AdminDashboardOverview() {
  const { data: stats, isLoading, isError } = useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await apiAdmin.get("/dashboard-stats");
      return res.data.data;
    },
  });

  const chartData = stats?.recentActivity?.map((item) => ({
    date: new Date(item._id).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    participants: item.count,
  })) || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="p-6 text-center text-red-500 bg-red-500/10 rounded-xl border border-red-500/20">
        Failed to load dashboard statistics.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Welcome to the Frolic Admin Panel. Here's a quick summary of the system.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-border/60 shadow-sm bg-card hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-indigo-400 to-indigo-500/0" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Events</CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500 group-hover:bg-indigo-500/15 group-hover:scale-110 transition-all duration-300">
              <CalendarDays className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{stats.totalEvents}</div>
            <p className="text-xs text-muted-foreground mt-1.5">Configured events</p>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden border-border/60 shadow-sm bg-card hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-sky-500 via-sky-400 to-sky-500/0" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Participants</CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500 group-hover:bg-sky-500/15 group-hover:scale-110 transition-all duration-300">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{stats.totalParticipants}</div>
            <p className="text-xs text-muted-foreground mt-1.5">Registered individuals</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-border/60 shadow-sm bg-card hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 via-violet-400 to-violet-500/0" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Institutes</CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500 group-hover:bg-violet-500/15 group-hover:scale-110 transition-all duration-300">
              <Building2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{stats.totalInstitutes}</div>
            <p className="text-xs text-muted-foreground mt-1.5">Participating colleges</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-border/60 shadow-sm bg-card hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500/0" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Results Declared</CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500/15 group-hover:scale-110 transition-all duration-300">
              <Trophy className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{stats.totalWinnersDeclared}</div>
            <p className="text-xs text-muted-foreground mt-1.5">Events with winners</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-border/60 shadow-sm bg-card hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Recent Registration Activity</CardTitle>
            <p className="text-xs text-muted-foreground">New participant registrations over the last 7 days</p>
          </CardHeader>
          <CardContent className="h-[300px] pt-4">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorParticipants" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    dy={10}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `${value}`} 
                    dx={-10}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderColor: 'hsl(var(--border))', 
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
                    }}
                    itemStyle={{ color: '#8b5cf6', fontWeight: 600 }}
                    labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: '4px' }}
                    cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="participants" 
                    name="Participants"
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorParticipants)" 
                    activeDot={{ r: 6, fill: '#8b5cf6', stroke: 'hsl(var(--background))', strokeWidth: 2 }}
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-muted/10 rounded-xl">
                <p className="text-sm text-muted-foreground">No recent registration activity.</p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="col-span-3 border-border/60 shadow-sm bg-card hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">System Status</CardTitle>
            <p className="text-xs text-muted-foreground">Real-time infrastructure health</p>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-[300px] bg-muted/5 rounded-b-xl">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="h-5 w-5 rounded-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]"></div>
                <div className="absolute inset-0 h-5 w-5 rounded-full bg-emerald-500 animate-ping opacity-20"></div>
              </div>
              <div className="text-center">
                <p className="text-base font-semibold text-foreground">All systems operational</p>
                <p className="text-xs text-muted-foreground mt-1.5 max-w-[200px]">Server is syncing correctly and connections are stable.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
