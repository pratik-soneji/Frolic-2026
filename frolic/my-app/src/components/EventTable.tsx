import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { MoreHorizontal, CalendarDays } from "lucide-react";
import { apiAdmin } from "@/constants/api";
import { useEffect, useState } from "react";

export interface Event {
  _id: string;
  eventName: string;
  eventTagline?: string;
  eventImageUrl?: string;
  eventDescription?: string;
  groupMinParticipants?: number;
  groupMaxParticipants?: number;
  evetFees: number;
  eventFirstPrice?: string;
  eventSecondPrice?: string;
  eventThirdPrice?: string;
  departmentId: string;
  eventCoOrdinatorId?: string;
  eventMainStudentCoordinator?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  eventLocation?: string;
  maxGroupsAllowed: number;
  modifiedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventsTableProps {
  users: Event[];
}

export default function EventsTable() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const res = await apiAdmin.get("/getallevents");
      setEvents(res.data.data);
      console.log(res);
      console.log(events);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <Card className="border-[#E2E8F0] shadow-sm bg-white overflow-hidden">
      {/* Blue gradient top bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#1E3A8A] via-[#4F46E5] to-[#0EA5E9]" />

      <CardHeader className="pb-4 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#4F46E5] shadow-sm">
              <CalendarDays className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-[#0F172A]">Events</CardTitle>
              <CardDescription className="text-sm text-slate-500">
                Manage Frolic 2026 events
              </CardDescription>
            </div>
          </div>
          <Badge
            variant="outline"
            className="text-xs font-semibold border-blue-200 text-[#1E3A8A] bg-blue-50"
          >
            {isLoading ? "Loading…" : `${events.length} events`}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-[#E2E8F0] bg-[#F8FAFC]">
              <TableHead className="pl-6 font-semibold text-[#0F172A] text-xs uppercase tracking-wide">Event Name</TableHead>
              <TableHead className="font-semibold text-[#0F172A] text-xs uppercase tracking-wide">Department ID</TableHead>
              <TableHead className="font-semibold text-[#0F172A] text-xs uppercase tracking-wide">Fees</TableHead>
              <TableHead className="text-right pr-6 font-semibold text-[#0F172A] text-xs uppercase tracking-wide">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-[#E2E8F0]">
                  <TableCell className="pl-6"><Skeleton className="h-4 w-36" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell className="text-right pr-6"><Skeleton className="h-8 w-8 ml-auto rounded-md" /></TableCell>
                </TableRow>
              ))
              : events.map((user) => (
                <TableRow key={user._id} className="group border-[#E2E8F0] hover:bg-blue-50/50 transition-colors">
                  <TableCell className="pl-6 font-semibold text-[#0F172A]">{user.eventName}</TableCell>
                  <TableCell className="text-slate-500 text-sm font-mono">{user.departmentId}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold text-xs border"
                    >
                      ₹{user.evetFees}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-100 hover:text-[#1E3A8A]">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36 border-[#E2E8F0] shadow-lg">
                        <DropdownMenuItem className="cursor-pointer hover:bg-blue-50 hover:text-[#1E3A8A]">View</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer hover:bg-blue-50 hover:text-[#1E3A8A]">Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer focus:bg-red-50">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}