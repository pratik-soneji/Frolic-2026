import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, CalendarDays, Phone, Mail } from "lucide-react";
import { apiAdmin } from "@/constants/api";
import { useQuery } from "@tanstack/react-query";

interface Participant {
  _id: string;
  participantName: string;
  participantEmail: string;
  participantMobile: string;
  isGroupLeader: boolean;
  event: {
    eventId: string;
    eventName: string;
  } | null;
  registrationDate: string;
}

export default function ParticipantsTable() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-participants"],
    queryFn: async () => {
      const res = await apiAdmin.get("/participants");
      return res.data.data as Participant[];
    }
  });

  const participants = data || [];

  return (
    <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
      <div className="flex items-center justify-between gap-4 flex-wrap px-6 py-5 border-b border-border/60">
        <div className="flex items-center gap-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/[0.05] border border-border/60">
            <Users className="h-5 w-5 text-foreground/70" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground tracking-tight">Participants</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Manage event registrations</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="text-xs font-semibold gap-1 rounded-full text-blue-600 bg-blue-500/10 border border-blue-500/20">
            {isLoading ? "…" : `${participants.length} Total`}
          </Badge>
        </div>
      </div>

      <div className="p-0">
        {isError && (
          <div className="mx-6 mb-4 mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
            <span className="text-sm text-red-400 font-medium">Failed to load participants.</span>
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border/60 bg-muted/40">
              <TableHead className="pl-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Participant</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Contact</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Event</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Date registered</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-border/40">
                  <TableCell className="pl-6"><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                </TableRow>
              ))
              : participants.map((participant) => (
                <TableRow key={participant._id} className="group border-border/40 hover:bg-muted/50 transition-colors">
                  <TableCell className="pl-6">
                    <span className="font-semibold text-foreground">{participant.participantName}</span>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center text-xs text-muted-foreground gap-1.5">
                        <Mail className="h-3 w-3" /> {participant.participantEmail}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground gap-1.5">
                        <Phone className="h-3 w-3" /> {participant.participantMobile}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    {participant.event ? (
                      <Badge variant="outline" className="text-xs font-semibold gap-1 rounded-full">
                        <CalendarDays className="h-3 w-3" />
                        {participant.event.eventName}
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">No Event Assigned</span>
                    )}
                  </TableCell>

                  <TableCell className="text-muted-foreground text-xs font-mono">
                    {new Date(participant.registrationDate).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
