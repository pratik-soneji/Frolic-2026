import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiAdmin } from "@/constants/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trophy, CalendarDays, Award } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface Event {
  _id: string;
  eventName: string;
  departmentId: { departmentName: string };
}

interface Winner {
  _id: string;
  eventId: { _id: string; eventName: string };
  groupId: { _id: string; groupName: string };
  sequence: number;
}

export default function WinnersTable() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const { data: eventsData, isLoading: loadingEvents } = useQuery({
    queryKey: ["admin-events"],
    queryFn: async () => {
      const res = await apiAdmin.get("/getallevents");
      return res.data.data as Event[];
    },
  });

  const { data: winnersData, isLoading: loadingWinners } = useQuery({
    queryKey: ["admin-winners"],
    queryFn: async () => {
      const res = await apiAdmin.get("/winners");
      return res.data.data as Winner[];
    },
  });

  // Calculate event winner statuses
  const events = eventsData || [];
  const winners = winnersData || [];

  return (
    <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
      <div className="flex items-center justify-between gap-4 flex-wrap px-6 py-5 border-b border-border/60">
        <div className="flex items-center gap-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/[0.05] border border-border/60">
            <Trophy className="h-5 w-5 text-foreground/70" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground tracking-tight">Event Winners</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Declare and manage winners for events</p>
          </div>
        </div>
      </div>

      <div className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border/60 bg-muted/40">
              <TableHead className="pl-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Event Name</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Department</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</TableHead>
              <TableHead className="text-right pr-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loadingEvents || loadingWinners ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i} className="border-border/40">
                  <TableCell className="pl-6"><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                  <TableCell className="text-right pr-6"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : (
              events.map((event) => {
                const eventWinners = winners.filter(w => w.eventId._id === event._id);
                const hasWinners = eventWinners.length > 0;

                return (
                  <TableRow key={event._id} className="group border-border/40 hover:bg-muted/50 transition-colors">
                    <TableCell className="pl-6 font-semibold text-foreground">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        {event.eventName}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {event.departmentId?.departmentName || "N/A"}
                    </TableCell>
                    <TableCell>
                      {hasWinners ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shadow-none">
                          <Award className="h-3 w-3 mr-1" /> Declared
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-muted text-muted-foreground">
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button
                        variant={hasWinners ? "outline" : "default"}
                        size="sm"
                        onClick={() => setSelectedEvent(event)}
                      >
                        {hasWinners ? "Manage Winners" : "Declare Winners"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {selectedEvent && (
        <DeclareWinnersDialog 
          event={selectedEvent} 
          currentWinners={winners.filter((w) => w.eventId._id === selectedEvent._id)}
          onClose={() => setSelectedEvent(null)} 
        />
      )}
    </div>
  );
}

function DeclareWinnersDialog({ event, currentWinners, onClose }: { event: Event, currentWinners: Winner[], onClose: () => void }) {
  const queryClient = useQueryClient();
  const [firstPlace, setFirstPlace] = useState<string>(currentWinners.find(w => w.sequence === 1)?.groupId._id || "none");
  const [secondPlace, setSecondPlace] = useState<string>(currentWinners.find(w => w.sequence === 2)?.groupId._id || "none");
  const [thirdPlace, setThirdPlace] = useState<string>(currentWinners.find(w => w.sequence === 3)?.groupId._id || "none");
  
  const { data: participants, isLoading } = useQuery({
    queryKey: ["admin-event-participants", event._id],
    queryFn: async () => {
      const res = await apiAdmin.get(`/events/${event._id}/participants`);
      return res.data.data;
    },
  });

  const uniqueGroups = participants ? Array.from(new Map(
    participants.map((p: any) => [p.group?.id, p.group])
  ).values()).filter(Boolean) as { id: string, name: string }[] : [];

  const declareMutation = useMutation({
    mutationFn: async (winners: {sequence: number, groupId: string}[]) => {
      const res = await apiAdmin.post(`/winners/${event._id}`, { winners });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Winners declared successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-winners"] });
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to declare winners");
    }
  });

  const revokeMutation = useMutation({
    mutationFn: async () => {
      const res = await apiAdmin.delete(`/winners/${event._id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Winners revoked successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-winners"] });
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to revoke winners");
    }
  });

  const handleSave = () => {
    const winners = [];
    if (firstPlace && firstPlace !== "none") winners.push({ sequence: 1, groupId: firstPlace });
    if (secondPlace && secondPlace !== "none") winners.push({ sequence: 2, groupId: secondPlace });
    if (thirdPlace && thirdPlace !== "none") winners.push({ sequence: 3, groupId: thirdPlace });
    
    if (winners.length === 0) {
      toast.error("Please select at least one winner");
      return;
    }
    declareMutation.mutate(winners);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Declare Winners: {event.eventName}</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="py-6 flex justify-center"><Skeleton className="h-8 w-32" /></div>
        ) : uniqueGroups.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground">
            No participants found for this event.
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <span className="text-yellow-500 font-bold">1st</span> Place
              </label>
              <Select value={firstPlace} onValueChange={setFirstPlace}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a team/participant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {uniqueGroups.map((g) => (
                    <SelectItem key={g.id} value={g.id}>{g.name || 'Individual'}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <span className="text-gray-400 font-bold">2nd</span> Place
              </label>
              <Select value={secondPlace} onValueChange={setSecondPlace}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a team/participant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {uniqueGroups.map((g) => (
                    <SelectItem key={g.id} value={g.id}>{g.name || 'Individual'}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <span className="text-amber-600 font-bold">3rd</span> Place
              </label>
              <Select value={thirdPlace} onValueChange={setThirdPlace}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a team/participant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {uniqueGroups.map((g) => (
                    <SelectItem key={g.id} value={g.id}>{g.name || 'Individual'}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-border/40">
          {currentWinners.length > 0 ? (
            <Button 
                variant="destructive" 
                onClick={() => revokeMutation.mutate()} 
                disabled={revokeMutation.isPending}
            >
                Revoke All
            </Button>
          ) : <div></div>}
          
          <div className="space-x-3">
             <Button variant="outline" onClick={onClose}>Cancel</Button>
             <Button onClick={handleSave} disabled={declareMutation.isPending || uniqueGroups.length === 0}>
                {declareMutation.isPending ? "Saving..." : "Save Winners"}
             </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
