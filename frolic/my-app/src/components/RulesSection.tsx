import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollText, ChevronRight, Circle } from "lucide-react";

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
    <section id="rules" className="relative w-full bg-[#04070f] py-24 text-white overflow-hidden">

      {/* Ambient Background Glows */}
      <div className="pointer-events-none absolute top-1/4 left-[-10%] h-[40rem] w-[40rem] bg-[#1E3A8A]/15 blur-[150px] rounded-full" />
      <div className="pointer-events-none absolute bottom-1/4 right-[-10%] h-[40rem] w-[40rem] bg-[#4F46E5]/15 blur-[150px] rounded-full" />

      <div className="container relative z-10 mx-auto px-6 md:px-12 lg:px-20">

        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-14">
          <Badge
            variant="outline"
            className="mb-4 px-4 py-1.5 rounded-full border-sky-500/30 bg-sky-500/10 text-sky-300 uppercase tracking-widest text-xs font-semibold"
          >
            <ScrollText className="w-3 h-3 mr-2 text-sky-400" />
            Important Information
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">
            GENERAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-[#4F46E5]">RULES</span>
          </h2>
          <div className="mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600" />
        </div>

        {/* Rules Card */}
        <Card className="border-zinc-800/60 bg-zinc-900/50 backdrop-blur-sm shadow-[0_0_60px_-20px_rgba(14,165,233,0.1)]">
          <CardContent className="p-8 md:p-10">
            <ul className="space-y-4 text-zinc-300 leading-relaxed">
              {generalRules.map((rule, index) => (
                <li key={index} className="flex items-start gap-4 group/item">
                  {/* Number badge */}
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1E3A8A]/80 border border-sky-800/60 text-xs font-bold text-sky-300 mt-0.5">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    {typeof rule === 'string' ? (
                      <p className="text-sm md:text-base leading-relaxed group-hover/item:text-white transition-colors duration-200">{rule}</p>
                    ) : (
                      <>
                        <p className="text-sm md:text-base leading-relaxed group-hover/item:text-white transition-colors duration-200">{rule.text}</p>
                        <ul className="mt-3 ml-2 space-y-2 pl-5 border-l border-sky-900/60">
                          {rule.subRules.map((subRule, subIndex) => (
                            <li key={subIndex} className="flex items-start gap-2.5">
                              <Circle className="h-1.5 w-1.5 min-w-[0.375rem] fill-sky-400 text-sky-400 mt-2" />
                              <p className="text-sm text-zinc-400">{subRule}</p>
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