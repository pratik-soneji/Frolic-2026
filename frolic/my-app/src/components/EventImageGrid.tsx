import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, ArrowRight } from "lucide-react";

import { events } from "@/data/events";

export default function EventGrid() {
  const Events = events.filter((e) => e.category === "Technical");
  const idSum = events.reduce((total, e) => total += e.id, 0);

  return (
    <section className="relative w-full bg-background py-24 text-foreground border-t border-border/40" id="events">

      <div className="mx-auto max-w-7xl px-6 relative z-10">

        {/* Section Header */}
        <div className="mb-16 flex flex-col items-center text-center gap-3">
          <Badge
            variant="outline"
            className="px-4 py-1.5 rounded-full border-border/60 bg-foreground/[0.04] text-foreground/50 uppercase tracking-widest text-xs font-semibold"
          >
            Choose Your Arena
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
            FROLIC <span className="text-foreground/40">EVENTS</span>
          </h2>
          <div className="h-px w-20 rounded-full bg-border" />
          <h1 className="sr-only">{idSum}</h1>
        </div>

        {/* THE GRID */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Events.map((event) => (
            <Card
              key={event.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border-border/60 bg-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md"
            >
              {/* IMAGE */}
              <div className="relative h-44 w-full shrink-0 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                <Badge className="absolute right-3 top-3 border-none bg-background/80 text-foreground text-xs backdrop-blur-sm shadow-sm">
                  {event.category}
                </Badge>
              </div>

              {/* CARD CONTENT */}
              <CardHeader className="pb-2 pt-4">
                <CardTitle
                  className="text-lg font-bold tracking-tight text-foreground truncate group-hover:text-foreground/70 transition-colors duration-200"
                  title={event.title}
                >
                  {event.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="pb-3 flex-grow">
                <p className="line-clamp-2 text-sm text-muted-foreground mb-4">
                  {event.description || event.category}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    <span>{event.date || "Sept 06, 2025"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{event.mode || "Campus"}</span>
                  </div>
                </div>
              </CardContent>

              {/* FOOTER */}
              <CardFooter className="pt-0 pb-4">
                <Button
                  className="w-full h-10 font-semibold text-sm transition-all"
                  size="sm"
                >
                  Register Now
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}