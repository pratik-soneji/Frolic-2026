import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarDays, MapPin, Users, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { PublicEvent } from "./EventsPublicPage";

export default function EventDetailsUser() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState("");
  const [participants, setParticipants] = useState([
    { name: "", email: "", phone: "" }
  ]);

  const { data: event, isLoading, error, refetch } = useQuery<PublicEvent>({
    queryKey: ["public-event", eventId],
    queryFn: async () => {
      const res = await fetch(`http://localhost:5000/api/events/public/${eventId}`);
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
      const res = await fetch("http://localhost:5000/api/participants/register", {

        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Skeleton className="h-64 w-full rounded-2xl mb-8" />
        <Skeleton className="h-10 w-1/3 mb-4" />
        <Skeleton className="h-32 w-full mb-8" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="text-destructive font-semibold mb-4">Event not found or failed to load.</div>
        <Button variant="outline" onClick={() => navigate("/events")}>Back to Events</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-[70%] mt-20">
      <Button
        variant="ghost"
        className="mb-6 -ml-4 text-muted-foreground hover:text-foreground"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Events
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Event Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm">
            {event.imageUrl ? (
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-80 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-primary/5 flex items-center justify-center">
                <CalendarDays className="h-16 w-16 text-primary/40" />
              </div>
            )}

            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <Badge
                  variant={event.status === "Open" ? "default" : "destructive"}
                  className={event.status === "Open" ? "bg-emerald-500" : ""}
                >
                  {event.status}
                </Badge>
                <div className="flex bg-muted rounded-full px-4 py-1 text-sm font-medium text-muted-foreground">
                  {event.remainingSlots} Slots Left
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
                {event.title}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-foreground/80 bg-muted/30 p-6 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="bg-background p-2 rounded-lg border border-border">
                    <CalendarDays className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Date</p>
                    <p className="font-medium">{new Date(event.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-background p-2 rounded-lg border border-border">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Venue</p>
                    <p className="font-medium">{event.venue}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-background p-2 rounded-lg border border-border">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Capacity</p>
                    <p className="font-medium">{event.registeredParticipantsCount} / {event.totalSlots} Registered</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">About the Event</h3>
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
            <div className="bg-card rounded-3xl border border-border shadow-md overflow-hidden relative sticky top-8">
              <div className="bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-6 text-amber-950">
                <h2 className="text-2xl font-extrabold mb-1">Results Declared!</h2>
                <p className="text-amber-900/80 font-medium text-sm">Congratulations to the winners of {event.title}</p>
              </div>
              <div className="p-6 space-y-6 bg-card">
                {event.winners.map((winner) => (
                  <div key={winner.sequence} className="p-4 border border-border rounded-xl bg-muted/20 relative overflow-hidden">
                    {winner.sequence === 1 && <div className="absolute top-0 right-0 w-2 h-full bg-yellow-400"></div>}
                    {winner.sequence === 2 && <div className="absolute top-0 right-0 w-2 h-full bg-gray-400"></div>}
                    {winner.sequence === 3 && <div className="absolute top-0 right-0 w-2 h-full bg-amber-600"></div>}
                    
                    <h3 className="font-bold flex items-center gap-2 mb-2">
                       <span className={`flex items-center justify-center h-6 w-6 rounded-full text-xs text-white ${winner.sequence === 1 ? 'bg-yellow-500 shadow-md' : winner.sequence === 2 ? 'bg-gray-400 shadow-md' : 'bg-amber-600 shadow-md'}`}>
                         {winner.sequence}
                       </span>
                       {winner.groupName || "Individual Participant"}
                    </h3>
                    
                    <div className="text-sm text-foreground/80 pl-8 space-y-1">
                       {winner.participants.map((p, idx) => (
                          <div key={idx} className="flex items-center gap-1.5">
                             <span className="font-medium">{p.name}</span>
                             {p.isLeader ? <Badge variant="secondary" className="text-[9px] px-1 h-4 border-primary/20">Leader</Badge> : null}
                          </div>
                       ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-3xl border border-border shadow-md p-6 sticky top-8">
              <h2 className="text-2xl font-bold mb-2">Register</h2>
              <p className="text-sm text-muted-foreground mb-6">Complete the form below to secure your spot.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {(event?.groupMaxParticipants || 1) > 1 && (
                <>
                  <div className="space-y-2 mb-4">
                    <Label htmlFor="teamName">Team / Group Name</Label>
                    <Input
                      id="teamName"
                      placeholder="e.g. The Avengers"
                      required
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      disabled={event.status === "Full" || registerMutation.isPending}
                    />
                  </div>
                  <div className="space-y-2 mb-6">
                    <Label>Number of Participants</Label>
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
                            className="flex-1"
                          >
                            {count}
                          </Button>
                        )
                      })}
                    </div>
                  </div>
                </>
              )}

              <div className="max-h-[400px] overflow-y-auto pr-2 space-y-6">
                {participants.map((p, index) => (
                  <div key={index} className="p-4 bg-muted/20 border border-border rounded-2xl space-y-4">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <span className="flex items-center justify-center bg-primary text-primary-foreground h-5 w-5 rounded-full text-[10px]">
                        {index + 1}
                      </span>
                      {index === 0 ? "Team Leader" : `Member ${index + 1}`}
                    </h3>
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input
                        placeholder="John Doe"
                        required
                        value={p.name}
                        onChange={(e) => updateParticipant(index, "name", e.target.value)}
                        disabled={event.status === "Full" || registerMutation.isPending}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        required
                        value={p.email}
                        onChange={(e) => updateParticipant(index, "email", e.target.value)}
                        disabled={event.status === "Full" || registerMutation.isPending}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        required
                        value={p.phone}
                        onChange={(e) => updateParticipant(index, "phone", e.target.value)}
                        disabled={event.status === "Full" || registerMutation.isPending}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className={`w-full py-6 text-base font-semibold transition-all ${event.status === "Full" ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground hover:scale-[1.02]"
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
