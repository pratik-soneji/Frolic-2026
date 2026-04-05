import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Users } from "lucide-react";

export interface PublicEvent {
  eventId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  totalSlots: number;
  registeredParticipantsCount: number;
  remainingSlots: number;
  status: string;
  groupMinParticipants: number;
  groupMaxParticipants: number;
  imageUrl?: string;
  winners?: {
    sequence: number;
    groupName: string;
    participants: {
      name: string;
      isLeader: boolean;
    }[];
  }[];
}

export default function EventsPublicPage() {
  const { data: events, isLoading, error } = useQuery<PublicEvent[]>({
    queryKey: ["public-events"],
    queryFn: async () => {
      // Assuming constants/api.ts contains an axios instance called apiClient or api
      // I'll use standard fetch if api is not working, but apiAdmin might exist.
      // Let's use fetch just to be safe if `api` might be named differently.
      const res = await fetch("https://frolic-backend-8qmc.onrender.com/api/events/all", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch events");
      const json = await res.json();
      return json.data;
    }
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl pt-24">
      <div className="flex flex-col items-center justify-center mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
          Upcoming Events
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Discover and register for the latest events. Secure your spot before they fill up!
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-80 w-full rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-destructive py-10">Error loading events. Please try again later.</div>
      ) : events?.length === 0 ? (
        <div className="text-center text-muted-foreground py-20 flex flex-col items-center">
          <CalendarDays className="h-16 w-16 mb-4 opacity-50" />
          <p className="text-xl font-semibold">No active events found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events?.map((event) => (
            <div
              key={event.eventId}
              className="group flex flex-col bg-card rounded-2xl border border-border/60 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500"
            >
              {/* Image Area */}
              <div className="relative h-48 w-full bg-muted overflow-hidden">
                {event.imageUrl ? (
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-primary/5 to-primary/10 text-primary">
                    <CalendarDays className="h-12 w-12 opacity-40" />
                  </div>
                )}
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <Badge
                    variant={event.status === "Open" ? "default" : "destructive"}
                    className={`font-semibold shadow-lg backdrop-blur-sm ${event.status === "Open" ? "bg-emerald-500/90 hover:bg-emerald-600" : ""}`}
                  >
                    {event.status}
                  </Badge>
                </div>
              </div>

              {/* Content Area */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-1 tracking-tight">{event.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[40px] leading-relaxed">
                  {event.description || "No description provided."}
                </p>

                <div className="space-y-2.5 mb-6 text-sm text-foreground/80">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10">
                      <CalendarDays className="h-3.5 w-3.5 text-indigo-500" />
                    </div>
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10">
                      <MapPin className="h-3.5 w-3.5 text-rose-500" />
                    </div>
                    <span className="line-clamp-1">{event.venue}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/10">
                      <Users className="h-3.5 w-3.5 text-sky-500" />
                    </div>
                    <span>{event.remainingSlots} slots remaining (out of {event.totalSlots})</span>
                  </div>
                </div>

                <div className="mt-auto">
                  <Link to={`/events/${event.eventId}`} className="w-full block">
                    <button
                      className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${event.status === "Open"
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                        }`}
                      disabled={event.status !== "Open"}
                    >
                      {event.status === "Open" ? "View Details →" : "Event Full"}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
