import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarDays, MapPin, Users, ArrowLeft, Trophy, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { PublicEvent } from "./EventsPublicPage";

import { API_BASE_URL } from "@/constants/url";

export default function EventDetailsUser() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState("");
  const [participants, setParticipants] = useState<{ name: string; email: string; phone: string }[]>([
    { name: "", email: "", phone: "" }
  ]);

  const { data: event, isLoading, error, refetch } = useQuery<PublicEvent>({
    queryKey: ["public-event", eventId],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/events/public/${eventId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch event");
      const json = await res.json();
      return json.data;
    },
    enabled: !!eventId
  });

  useEffect(() => {
    if (event && event.groupMinParticipants > participants.length) {
      setParticipants([...participants, ...Array(event.groupMinParticipants - participants.length).fill({ name: "", email: "", phone: "" })]);
    }
  }, [event]);

  const registerMutation = useMutation({
    mutationFn: async (data: { groupName: string; participants: { name: string; email: string; phone: string }[]; eventId: string }) => {
      const res = await fetch(`${API_BASE_URL}/api/participants/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Registration failed");
      return json;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Registration Successful");
      setTeamName("");
      setParticipants([{ name: "", email: "", phone: "" }]);
      refetch(); // update remaining slots
    },
    onError: (error: any) => {
      toast.error(error.message || "Something went wrong.");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventId) return;
    registerMutation.mutate({ groupName: teamName, participants, eventId });
  };

  const updateParticipant = (index: number, field: string, value: string) => {
    const newParticipants = [...participants];
    newParticipants[index] = { ...newParticipants[index], [field]: value };
    setParticipants(newParticipants);
  };

  const handleParticipantCountChange = (count: number) => {
    if (count < 1) return;
    const max = event?.groupMaxParticipants || 1;
    if (count > max) return;

    if (count > participants.length) {
      const diff = count - participants.length;
      setParticipants([...participants, ...Array(diff).fill({ name: "", email: "", phone: "" })]);
    } else {
      setParticipants(participants.slice(0, count));
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-5xl pt-28">
        <Skeleton className="h-64 w-full rounded-2xl mb-8" />
        <Skeleton className="h-10 w-1/3 mb-4" />
        <Skeleton className="h-32 w-full mb-8" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container mx-auto px-4 py-12 text-center pt-28">
        <div className="text-destructive font-semibold mb-4">Event not found or failed to load.</div>
        <Button variant="outline" onClick={() => navigate("/events")}>Back to Events</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl pt-28">
      <Button
        variant="ghost"
        className="mb-6 -ml-4 text-muted-foreground hover:text-foreground gap-2 transition-colors"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Events
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Event Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-card rounded-2xl border border-border/60 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            {event.imageUrl ? (
              <div className="relative overflow-hidden">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-80 object-cover transition-transform duration-700 hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>
            ) : (
              <div className="w-full h-48 bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
                <CalendarDays className="h-16 w-16 text-primary/30" />
              </div>
            )}

            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <Badge
                  variant={event.status === "Open" ? "default" : "destructive"}
                  className={`font-semibold ${event.status === "Open" ? "bg-emerald-500/90 hover:bg-emerald-500 shadow-sm" : ""}`}
                >
                  {event.status}
                </Badge>
                <div className="flex bg-muted/60 rounded-full px-4 py-1 text-sm font-medium text-muted-foreground border border-border/40">
                  <Sparkles className="h-3.5 w-3.5 mr-1.5 text-amber-500" />
                  {event.remainingSlots} Slots Left
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4 tracking-tight">
                {event.title}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-foreground/80 bg-muted/20 p-6 rounded-2xl border border-border/40">
                <div className="flex items-center gap-3">
                  <div className="bg-background p-2.5 rounded-xl border border-border/60 shadow-sm">
                    <CalendarDays className="h-5 w-5 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Date</p>
                    <p className="font-medium">{new Date(event.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-background p-2.5 rounded-xl border border-border/60 shadow-sm">
                    <MapPin className="h-5 w-5 text-rose-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Venue</p>
                    <p className="font-medium">{event.venue}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-background p-2.5 rounded-xl border border-border/60 shadow-sm">
                    <Users className="h-5 w-5 text-sky-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Capacity</p>
                    <p className="font-medium">{event.registeredParticipantsCount} / {event.totalSlots} Registered</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 tracking-tight">About the Event</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {event.description || "No specific details provided for this event."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Panel (Registration or Winners) */}
        <div className="lg:col-span-1">
          {event?.winners && event.winners.length > 0 ? (
            <div className="bg-card rounded-2xl border border-border/60 shadow-md overflow-hidden relative sticky top-8">
              <div className="bg-gradient-to-br from-amber-100 via-amber-300 to-amber-500 dark:from-amber-900/60 dark:via-amber-700/40 dark:to-amber-600/30 p-6">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="h-6 w-6 text-amber-700 dark:text-amber-300" />
                  <h2 className="text-2xl font-extrabold text-amber-900 dark:text-amber-100">Results Declared!</h2>
                </div>
                <p className="text-amber-800/80 dark:text-amber-200/60 font-medium text-sm">Congratulations to the winners of {event.title}</p>
              </div>
              <div className="p-6 space-y-4 bg-card">
                {event.winners.map((winner) => (
                  <div key={winner.sequence} className="p-4 border border-border/60 rounded-xl bg-muted/10 relative overflow-hidden hover:bg-muted/20 transition-colors duration-200">
                    {winner.sequence === 1 && <div className="absolute top-0 right-0 w-1.5 h-full bg-gradient-to-b from-yellow-400 to-amber-500"></div>}
                    {winner.sequence === 2 && <div className="absolute top-0 right-0 w-1.5 h-full bg-gradient-to-b from-gray-300 to-gray-500"></div>}
                    {winner.sequence === 3 && <div className="absolute top-0 right-0 w-1.5 h-full bg-gradient-to-b from-amber-500 to-amber-700"></div>}

                    <h3 className="font-bold flex items-center gap-2 mb-2">
                      <span className={`flex items-center justify-center h-7 w-7 rounded-full text-xs font-bold text-white shadow-md ${winner.sequence === 1 ? 'bg-gradient-to-br from-yellow-400 to-amber-500' : winner.sequence === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500' : 'bg-gradient-to-br from-amber-500 to-amber-700'}`}>
                        {winner.sequence}
                      </span>
                      <span className="text-foreground">{winner.groupName || "Individual Participant"}</span>
                    </h3>

                    <div className="text-sm text-foreground/80 pl-9 space-y-1">
                      {winner.participants.map((p, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <span className="font-medium">{p.name}</span>
                          {p.isLeader ? <Badge variant="secondary" className="text-[9px] px-1.5 h-4 border-primary/20 rounded-full">Leader</Badge> : null}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-2xl border border-border/60 shadow-md p-6 sticky top-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight">Register</h2>
                <p className="text-sm text-muted-foreground mt-1">Complete the form below to secure your spot.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {(event?.groupMaxParticipants || 1) > 1 && (
                  <>
                    <div className="space-y-2 mb-4">
                      <Label htmlFor="teamName" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Team / Group Name</Label>
                      <Input
                        id="teamName"
                        placeholder="e.g. The Avengers"
                        required
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        disabled={event.status === "Full" || registerMutation.isPending}
                        className="h-11 rounded-xl border-border/60 bg-muted/20 focus-visible:ring-2 focus-visible:ring-violet-500/30 focus-visible:border-violet-500/50 transition-all"
                      />
                    </div>
                    <div className="space-y-2 mb-6">
                      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Number of Participants</Label>
                      <div className="flex gap-2">
                        {[...Array((event?.groupMaxParticipants || 1) - (event?.groupMinParticipants || 1) + 1)].map((_, i) => {
                          const count = (event?.groupMinParticipants || 1) + i;
                          return (
                            <Button
                              key={count}
                              type="button"
                              variant={participants.length === count ? "default" : "outline"}
                              onClick={() => handleParticipantCountChange(count)}
                              disabled={event.status === "Full" || registerMutation.isPending}
                              className={`flex-1 rounded-xl transition-all ${participants.length === count ? 'shadow-sm' : 'border-border/60'}`}
                            >
                              {count}
                            </Button>
                          )
                        })}
                      </div>
                    </div>
                  </>
                )}

                <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4">
                  {participants.map((p, index) => (
                    <div key={index} className="p-4 bg-muted/10 border border-border/40 rounded-2xl space-y-3 hover:border-border/60 transition-colors">
                      <h3 className="font-semibold text-sm flex items-center gap-2">
                        <span className="flex items-center justify-center bg-primary text-primary-foreground h-5 w-5 rounded-full text-[10px] font-bold">
                          {index + 1}
                        </span>
                        {index === 0 ? "Team Leader" : `Member ${index + 1}`}
                      </h3>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-muted-foreground">Full Name</Label>
                        <Input
                          placeholder="John Doe"
                          required
                          value={p.name}
                          onChange={(e) => updateParticipant(index, "name", e.target.value)}
                          disabled={event.status === "Full" || registerMutation.isPending}
                          className="h-10 rounded-xl border-border/50 bg-background focus-visible:ring-2 focus-visible:ring-violet-500/30 focus-visible:border-violet-500/50 transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-muted-foreground">Email Address</Label>
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          required
                          value={p.email}
                          onChange={(e) => updateParticipant(index, "email", e.target.value)}
                          disabled={event.status === "Full" || registerMutation.isPending}
                          className="h-10 rounded-xl border-border/50 bg-background focus-visible:ring-2 focus-visible:ring-violet-500/30 focus-visible:border-violet-500/50 transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-muted-foreground">Phone Number</Label>
                        <Input
                          type="tel"
                          placeholder="+91 98765 43210"
                          required
                          value={p.phone}
                          onChange={(e) => updateParticipant(index, "phone", e.target.value)}
                          disabled={event.status === "Full" || registerMutation.isPending}
                          className="h-10 rounded-xl border-border/50 bg-background focus-visible:ring-2 focus-visible:ring-violet-500/30 focus-visible:border-violet-500/50 transition-all"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    className={`w-full py-6 text-base font-semibold rounded-xl transition-all duration-300 ${event.status === "Full" ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground hover:scale-[1.01] hover:shadow-lg shadow-sm"
                      }`}
                    disabled={event.status === "Full" || registerMutation.isPending}
                  >
                    {event.status === "Full"
                      ? "Event is Full"
                      : registerMutation.isPending
                        ? "Registering..."
                        : "Confirm Registration"
                    }
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
