import { Card, CardContent } from "./ui/card";
import { Bus, CalendarDays, TicketCheck, Wifi, Coffee, Zap } from "lucide-react";

export default function FacilitiesSection() {
    return (
        <section id="facilities" className="py-32 relative bg-background overflow-hidden relative border-t border-border/40">
            {/* Background elements */}
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] opacity-20 pointer-events-none">
                 <div className="absolute inset-0 rounded-full bg-gradient-to-bl from-sky-400 via-indigo-500 to-transparent blur-3xl" />
            </div>
            
            <div className="container mx-auto px-4 max-w-7xl relative z-10">
                <div className="flex flex-col items-center justify-center mb-16 text-center">
                   <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
                     World-Class Facilities
                   </h2>
                   <p className="text-lg text-muted-foreground max-w-2xl">
                     Everything you need for an unforgettable experience. Participate without boundaries.
                   </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {/* Big Hero Card */}
                    <Card className="md:col-span-2 row-span-2 overflow-hidden border-border/50 bg-card/60 backdrop-blur-md shadow-lg group relative hover:border-primary/50 transition-colors duration-500">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <CardContent className="p-8 md:p-12 h-full flex flex-col justify-between relative z-10">
                            <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center text-primary mb-8 border border-primary/20 shadow-inner">
                                <CalendarDays className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold mb-3 tracking-tight">100+ Megashows & Events</h3>
                                <p className="text-muted-foreground text-lg max-w-md leading-relaxed">
                                    Immerse yourself in non-stop adrenaline. From competitive tech hackathons to mesmerizing musical concerts, we've curated over a hundred events spanning across 3 massive days.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Small Card 1 */}
                    <Card className="col-span-1 overflow-hidden border-border/50 bg-card/60 backdrop-blur-md shadow-sm group hover:border-sky-500/50 transition-colors duration-500">
                         <CardContent className="p-8 h-full flex flex-col justify-end relative">
                            <div className="absolute top-0 right-0 p-6 opacity-10 scale-150 -translate-y-4 translate-x-4">
                                <Bus className="w-32 h-32" />
                            </div>
                            <div className="bg-sky-500/10 w-12 h-12 rounded-xl flex items-center justify-center text-sky-500 mb-6 border border-sky-500/20">
                                <Bus className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Campus Transport</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Seamless university bus facilities available completely free of charge across all major city routes.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Small Card 2 */}
                    <Card className="col-span-1 overflow-hidden border-border/50 bg-card/60 backdrop-blur-md shadow-sm group hover:border-amber-500/50 transition-colors duration-500">
                         <CardContent className="p-8 h-full flex flex-col justify-end relative">
                             <div className="absolute top-0 right-0 p-6 opacity-10 scale-150 -translate-y-4 translate-x-4">
                                <Zap className="w-32 h-32" />
                            </div>
                            <div className="bg-amber-500/10 w-12 h-12 rounded-xl flex items-center justify-center text-amber-500 mb-6 border border-amber-500/20">
                                <Wifi className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">High-Speed Wi-Fi</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                5G enabled wireless networks covering the entire festival ground for lightning-fast connectivity.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Wide Footer Card */}
                    <Card className="col-span-1 md:col-span-3 overflow-hidden border-border/50 bg-card/60 backdrop-blur-md shadow-sm group hover:border-emerald-500/50 transition-colors duration-500 flex flex-col md:flex-row items-center gap-6 p-6">
                         <div className="bg-emerald-500/10 w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                             <Coffee className="w-8 h-8" />
                         </div>
                         <div className="text-center md:text-left flex-1">
                             <h3 className="text-xl font-bold mb-1">24/7 Food Courts & Medical Staff</h3>
                             <p className="text-muted-foreground text-sm">
                                Premium catering stalls, resting zones, and a dedicated emergency medical response team on standby.
                             </p>
                         </div>
                         <div className="shrink-0 hidden md:block">
                             <TicketCheck className="w-24 h-24 text-foreground/5" />
                         </div>
                    </Card>
                </div>
            </div>
        </section>
    );
}
