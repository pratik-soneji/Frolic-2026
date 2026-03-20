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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreHorizontal, CalendarDays, Eye, Pencil, Trash2 } from "lucide-react";
import { apiAdmin } from "@/constants/api";
import { useEffect, useState } from "react";
import { AddEventDialog } from "./AddEventDialog";

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
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);

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
    <>
      <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border/60">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/[0.05] border border-border/60">
              <CalendarDays className="h-5 w-5 text-foreground/70" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground tracking-tight">Events</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Manage Frolic 2026 events</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => setIsAddEventOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Add Event
            </Button>
            <Badge
              variant="outline"
              className="text-xs font-semibold rounded-full px-3"
            >
              {isLoading ? "Loading…" : `${events.length} events`}
            </Badge>
          </div>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border/60 bg-muted/40">
              <TableHead className="pl-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Event Name</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Department ID</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Fees</TableHead>
              <TableHead className="text-right pr-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-border/40">
                  <TableCell className="pl-6"><Skeleton className="h-4 w-36" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                  <TableCell className="text-right pr-6"><Skeleton className="h-7 w-7 ml-auto rounded-lg" /></TableCell>
                </TableRow>
              ))
              : events.map((user) => (
                <TableRow key={user._id} className="group border-border/40 hover:bg-muted/50 transition-colors">
                  <TableCell className="pl-6 font-semibold text-foreground">{user.eventName}</TableCell>
                  <TableCell className="text-muted-foreground text-xs font-mono">{user.departmentId}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20 font-semibold text-xs border rounded-full"
                    >
                      ₹{user.evetFees}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-all hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36 bg-popover border-border shadow-lg rounded-xl">
                        <DropdownMenuItem className="cursor-pointer text-foreground/70 hover:bg-muted rounded-lg gap-2">
                          <Eye className="h-3.5 w-3.5" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer text-foreground/70 hover:bg-muted rounded-lg gap-2">
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border" />
                        <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer focus:bg-destructive/10 rounded-lg gap-2">
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <AddEventDialog 
        open={isAddEventOpen} 
        onOpenChange={setIsAddEventOpen}
        onSuccess={() => {
          // Re-fetch events if needed when an event is added
          fetchEvents();
        }}
      />
    </>
  );
}