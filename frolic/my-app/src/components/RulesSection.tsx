import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollText, Circle } from "lucide-react";

// Static Data
const generalRules = [
  "The consideration of event will be state-level event.",
  "Participants should go through the event rules and adhere to the specifics.",
  "Each participant should carry identity proof.",
  "Every participant has to register through online mode only.",
  "Offline registration is not entertained in any technical event.",
  "A participant can participate only in one event during the simultaneous timings for events; a participant is not restricted to participation in any number of events as long as the event timings do not clash.",
  "All participants those who are qualified in registered event, will get E-certificate of participation.",
  "The participant will only get E-certificate for participation on their registered email id. In group event, certificate of participation will be received on team/group leader's email id.",
  "The participant who ranked either 1st, 2nd & 3rd, will get certificate and Cash Price.",
  "The participant has to arrange food on their own cost.",
  {
    text: "Registration Fees for the Technical event will be as under:",
    subRules: [
      "Technical Event: ₹60 (Per Person per Event)",
      "Non-Technical Event: ₹30 (Per Person per Event)"
    ]
  },
  "Registration fees for the Non-Technical event will be as per their norms.",
  "No TA/DA is arranged for participants.",
  "The registration is on First come First Base.",
  "The total nos. of group and individual participant numbers will be decided by respective event coordinators.",
  "The participant has to report at the registration desk on the day of event on or before mentioned registration time duration as per the schedule of event. Failing to this will lead towards disqualification from the event.",
  "The winner has to collect certificate on the day of event only.",
  "The participant may be disqualified from all the events due to disciplinary action by event convener if any.",
  "In each event, decision of the Judge or the faculty coordinator will be final.",
  "Event related any final decision will be taken by the event convener.",
  "Overall final decision will be taken by the university management.",
  "The confirmation for participation will be sent on participants/team leader's registered email Id the day before an event.",
  "Read the event rules and regulations before registering for any event. There won't be any refund after the payment is completed."
];

export default function RulesSection() {
  return (
    <section id="rules" className="relative w-full bg-muted/30 py-24 text-foreground overflow-hidden border-t border-border/40">

      <div className="container relative z-10 mx-auto px-6 md:px-12 lg:px-20">

        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-14">
          <Badge
            variant="outline"
            className="mb-4 px-4 py-1.5 rounded-full border-border/60 bg-background text-foreground/50 uppercase tracking-widest text-xs font-semibold"
          >
            <ScrollText className="w-3 h-3 mr-2 text-foreground/40" />
            Important Information
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
            GENERAL <span className="text-foreground/40">RULES</span>
          </h2>
          <div className="mt-4 h-px w-20 rounded-full bg-border" />
        </div>

        {/* Rules Card */}
        <Card className="border-border/60 bg-card shadow-sm">
          <CardContent className="p-8 md:p-10">
            <ul className="space-y-4 text-foreground/70 leading-relaxed">
              {generalRules.map((rule, index) => (
                <li key={index} className="flex items-start gap-4 group/item">
                  {/* Number badge */}
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground/[0.06] border border-border/60 text-xs font-bold text-foreground/50 mt-0.5">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    {typeof rule === 'string' ? (
                      <p className="text-sm md:text-base leading-relaxed group-hover/item:text-foreground transition-colors duration-200">{rule}</p>
                    ) : (
                      <>
                        <p className="text-sm md:text-base leading-relaxed group-hover/item:text-foreground transition-colors duration-200">{rule.text}</p>
                        <ul className="mt-3 ml-2 space-y-2 pl-5 border-l border-border/60">
                          {rule.subRules.map((subRule, subIndex) => (
                            <li key={subIndex} className="flex items-start gap-2.5">
                              <Circle className="h-1.5 w-1.5 min-w-[0.375rem] fill-foreground/30 text-foreground/30 mt-2" />
                              <p className="text-sm text-muted-foreground">{subRule}</p>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}