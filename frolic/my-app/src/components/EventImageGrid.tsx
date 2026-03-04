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
  const Events = events.filter((e) => e.category === "Technical")
  const total = 0
  const idSum = events.reduce((total, e) => total += e.id, 0)
  console.log(Events);

  return (
    <section className="relative w-full bg-[#04070f] py-24 text-white" id="events">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_-10%,rgba(30,58,138,0.18),transparent)]" />
      <div className="pointer-events-none absolute top-1/2 left-0 h-[30rem] w-[30rem] bg-indigo-600/10 blur-[120px] rounded-full" />
      <div className="pointer-events-none absolute top-1/2 right-0 h-[30rem] w-[30rem] bg-sky-500/10 blur-[120px] rounded-full" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">

        {/* Section Header */}
        <div className="mb-16 flex flex-col items-center text-center gap-3">
          <Badge
            variant="outline"
            className="px-4 py-1.5 rounded-full border-sky-500/30 bg-sky-500/10 text-sky-300 uppercase tracking-widest text-xs font-semibold"
          >
            Choose Your Arena
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">
            FROLIC <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">EVENTS</span>
          </h2>
          <div className="h-1 w-20 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600" />
          <h1 className="sr-only">{idSum}</h1>
        </div>

        {/* THE GRID */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Events.map((event) => (
            <Card
              key={event.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border-zinc-800/60 bg-zinc-900/80 text-zinc-100 transition-all duration-300 hover:-translate-y-1.5 hover:border-sky-500/40 hover:shadow-[0_8px_40px_-8px_rgba(14,165,233,0.3)] backdrop-blur-sm"
            >
              {/* IMAGE */}
              <div className="relative h-44 w-full shrink-0 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/30 to-transparent" />
                <Badge className="absolute right-3 top-3 border-none bg-[#1E3A8A]/90 text-white text-xs backdrop-blur-sm shadow-md">
                  {event.category}
                </Badge>
              </div>

              {/* CARD CONTENT */}
              <CardHeader className="pb-2 pt-4">
                <CardTitle
                  className="text-lg font-bold tracking-tight text-white truncate group-hover:text-sky-400 transition-colors duration-200"
                  title={event.title}
                >
                  {event.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="pb-3 flex-grow">
                <p className="line-clamp-2 text-sm text-zinc-400 mb-4">
                  {event.description || event.category}
                </p>
                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 text-sky-500" />
                    <span>{event.date || "Sept 06, 2025"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-sky-500" />
                    <span>{event.mode || "Campus"}</span>
                  </div>
                </div>
              </CardContent>

              {/* FOOTER */}
              <CardFooter className="pt-0 pb-4">
                <Button
                  className="w-full h-10 bg-gradient-to-r from-[#1E3A8A] to-[#4F46E5] hover:from-[#1e40af] hover:to-[#4338ca] text-white font-semibold text-sm hover:shadow-[0_4px_20px_rgba(30,58,138,0.4)] transition-all border-none"
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