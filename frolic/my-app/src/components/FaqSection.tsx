import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { HelpCircle } from "lucide-react";

// Static Data
const faqData = [
  {
    question: "What Is Frolic'25?",
    answer: 'Every year, Darshan University-Rajkot used to organize a State Level Technical Symposium under the name "Frolic". It is organised every year in the month of September. Frolic is a series of technical and non-technical competitions and events covering all areas of engineering, science, and management. The attraction of this event is that it covers many technical and entrepreneurship events, where students from various institutes come up with their innovative ideas, take part, win and...'
  },
  {
    question: "Will I Get Certificate?",
    answer: "All participants who successfully take part in any technical and Non-Technical events and satisfy eligibility criteria (if any) are eligible for a participation E-certificate. Note that the winner will get a rank certificate in a hard copy and not a participation certificate. Also refer individual event rules."
  },
  {
    question: "What Is The Registration Charge To Take Part In Any Event Under Frolic'25?",
    answer: [
      "Registration fees for the Technical Event will be as under:",
      { type: 'list', items: ["Technical Event: ₹60 (Per Person per Event)", "Non-Technical Event: ₹30 (Per Person per Event)"] },
      "For Non-Technical Event the Registration fees will be as per their Respective Event Norms."
    ]
  },
  {
    question: "I Am Coming From Out-Station, Will I Get Night Accommodation?",
    answer: "Yes, The University is Providing Accommodation Facility for those who wants to come to the University Before the day of event. The One has to Pay 700 RS. For the accommodation Which Includes Dinner, 24 Hours Stay, Breakfast, Lunch, Refreshment Before they are leaving the Campus."
  },
  {
    question: "Can i Take Part In More than One Event?",
    answer: "A participant can participate only in one event during the simultaneous timings for events; a participant is not restricted to participation in any number of events as long as the event timings do not clash."
  },
  {
    question: "Is Food Facility Available?",
    answer: "No free food facility is available, but participants can avail their lunch/breakfast from the canteen on a chargeable basis Except those Who are taking accommodation Facility."
  },
  {
    question: "How to Reach Darshan University Campus?",
    answer: "The participants from other institutes can also avail the bus facility provided by Darshan University on the day of an event only from the specific city mentioned in the confirmation email. As well, participants can directly come to the university campus with their institute I-card. RMTS bus facilities are also available. Check for RMTS bus routes."
  },
  {
    question: "Is An Institute I-Card Compulsory In The Event?",
    answer: "Yes, participants who are taking part in any event are required to bring their institute I-card, and for visitors, any photo I-card (Licence/PAN/Aadhar card) is compulsory."
  },
  {
    question: "I Am Diploma Student, Can I Take Part In Degree Events?",
    answer: "Refer individual event rules."
  },
  {
    question: "Is Spot Registration Allowed?",
    answer: "Spot registration is allowed only in non-technical events based on their rules and regulations, but no spot registration is permitted in any technical events."
  }
];

export default function FaqSection() {
  return (
    <section id="faq" className="relative w-full bg-background py-24 text-foreground overflow-hidden border-t border-border/40">

      <div className="container relative z-10 mx-auto px-6 md:px-12 lg:px-20 max-w-4xl">

        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-14">
          <Badge
            variant="outline"
            className="mb-4 px-4 py-1.5 rounded-full border-border/60 bg-foreground/[0.04] text-foreground/50 uppercase tracking-widest text-xs font-semibold"
          >
            <HelpCircle className="w-3 h-3 mr-2 text-foreground/40" />
            Got Questions?
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
            FREQUENTLY ASKED{" "}
            <span className="text-foreground/40">QUESTIONS</span>
          </h2>
          <div className="mt-4 h-px w-20 rounded-full bg-border" />
        </div>

        {/* Accordion */}
        <Accordion type="single" collapsible className="w-full space-y-3">
          {faqData.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-border/60 bg-card rounded-xl overflow-hidden transition-all duration-300 hover:border-border hover:shadow-sm data-[state=open]:border-border data-[state=open]:bg-card data-[state=open]:shadow-md data-[state=open]:border-l-2 data-[state=open]:border-l-violet-500"
            >
              <AccordionTrigger className="px-6 py-4 text-base font-semibold text-foreground/80 hover:text-foreground hover:no-underline text-left data-[state=open]:text-foreground transition-colors duration-200">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-5 pt-0 text-muted-foreground text-sm leading-relaxed border-t border-border/40">
                {Array.isArray(item.answer) ? (
                  <div className="space-y-3 pt-4">
                    {item.answer.map((part, i) =>
                      typeof part === 'string' ?
                        <p key={i}>{part}</p> :
                        <ul key={i} className="list-disc pl-5 space-y-1 marker:text-foreground/40">
                          {part.items.map((listItem, j) => <li key={j}>{listItem}</li>)}
                        </ul>
                    )}
                  </div>
                ) : (
                  <p className="pt-4">{item.answer}</p>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}