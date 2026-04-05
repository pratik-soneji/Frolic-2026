import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, MapPin, Users, Trophy, DollarSign } from "lucide-react";
import { useGetEventById } from "@/hooks/useGetEventById";

export default function EventPreviewPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  
  const { data, isLoading, isError } = useGetEventById(eventId || "");
  const event = data?.data;

  if (isLoading) {
    return (
      <div className="p-8 max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-10 w-32 mb-6" />
        <Skeleton className="h-[400px] w-full rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-6 w-1/3" />
        </div>
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="p-8 max-w-5xl mx-auto flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-bold text-destructive mb-4">Event Not Found</h2>
        <Button onClick={() => navigate(-1)} variant="outline">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)} 
        className="mb-6 -ml-4 text-muted-foreground hover:text-foreground gap-2"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Events
      </Button>

      <div className="bg-card border border-border/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        {/* Banner Image */}
        {(event.imageUrl || event.eventImageUrl) ? (
          <div className="w-full h-[300px] md:h-[400px] relative overflow-hidden">
            <img 
              src={event.imageUrl || event.eventImageUrl} 
              alt={event.eventName} 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>
        ) : (
          <div className="w-full h-[200px] md:h-[300px] bg-gradient-to-br from-muted/40 to-muted/60 flex items-center justify-center">
            <span className="text-muted-foreground font-medium">No cover image uploaded</span>
          </div>
        )}

        <div className="p-8 md:p-10">
          <div className="mb-8">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-3">
              {event.eventName}
            </h1>
            {event.eventTagline && (
              <p className="text-xl text-muted-foreground font-medium">
                {event.eventTagline}
              </p>
            )}
            {event.departmentId?.departmentName && (
               <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mt-4">
                 {event.departmentId.departmentName}
               </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                 <div className="p-3 bg-indigo-500/10 rounded-xl"><MapPin className="w-5 h-5 text-indigo-500" /></div>
                 <div>
                   <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Location</p>
                   <p className="text-foreground font-medium">{event.eventLocation || "TBA"}</p>
                 </div>
              </div>

              <div className="flex items-start gap-4">
                 <div className="p-3 bg-sky-500/10 rounded-xl"><Users className="w-5 h-5 text-sky-500" /></div>
                 <div>
                   <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Participation</p>
                   <p className="text-foreground font-medium">
                     {event.groupMinParticipants === event.groupMaxParticipants 
                       ? `${event.groupMinParticipants} member(s) per group`
                       : `${event.groupMinParticipants} - ${event.groupMaxParticipants} members per group`}
                   </p>
                   <p className="text-xs text-muted-foreground mt-1">Max {event.maxGroupsAllowed} groups allowed</p>
                 </div>
              </div>
              
              <div className="flex items-start gap-4">
                 <div className="p-3 bg-emerald-500/10 rounded-xl"><DollarSign className="w-5 h-5 text-emerald-500" /></div>
                 <div>
                   <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Entry Fee</p>
                   {event.evetFees > 0 ? (
                     <p className="text-foreground font-bold text-lg text-emerald-600 dark:text-emerald-400">₹{event.evetFees}</p>
                   ) : (
                     <p className="text-foreground font-bold text-lg text-emerald-600 dark:text-emerald-400">Free</p>
                   )}
                 </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                 <div className="p-3 bg-amber-500/10 rounded-xl"><Trophy className="w-5 h-5 text-amber-500" /></div>
                 <div>
                   <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Prizes</p>
                   <ul className="space-y-2">
                     {event.eventFirstPrice && <li className="flex gap-2 items-center"><span className="text-amber-500 font-bold">1st:</span> <span className="font-medium">{event.eventFirstPrice}</span></li>}
                     {event.eventSecondPrice && <li className="flex gap-2 items-center"><span className="text-slate-400 font-bold">2nd:</span> <span className="font-medium">{event.eventSecondPrice}</span></li>}
                     {event.eventThirdPrice && <li className="flex gap-2 items-center"><span className="text-amber-700 font-bold">3rd:</span> <span className="font-medium">{event.eventThirdPrice}</span></li>}
                     {!event.eventFirstPrice && !event.eventSecondPrice && !event.eventThirdPrice && (
                       <li className="text-muted-foreground text-sm">No prizes listed</li>
                     )}
                   </ul>
                 </div>
              </div>

              {event.eventCoOrdinatorId && (
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-violet-500/10 rounded-xl"><Users className="w-5 h-5 text-violet-500" /></div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Faculty Coordinator</p>
                    <p className="text-foreground font-medium">{event.eventCoOrdinatorId.userName}</p>
                    <p className="text-xs text-muted-foreground"><a href={`mailto:${event.eventCoOrdinatorId.email}`} className="text-primary hover:underline">{event.eventCoOrdinatorId.email}</a></p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-8 border-t border-border/60">
            <h3 className="text-lg font-bold text-foreground mb-4">About the Event</h3>
            <div className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {event.eventDescription || "No description provided."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
