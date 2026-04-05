import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { MapPin, Phone, Mail } from "lucide-react";

export default function ContactUsSection() {
    return (
        <section id="contact" className="py-24 relative overflow-hidden bg-muted/20 border-t border-border/40">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex flex-col items-center justify-center mb-16 text-center">
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
                        Get In Touch
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        Have a question about the events, registration, or campus? Our team is here to help you out.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {/* Left Column: Contact Details */}
                    <div className="space-y-8">
                        <div className="flex items-start gap-4">
                            <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center text-primary shrink-0 border border-primary/20">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-1">Our Location</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Darshan University,<br/>
                                    Rajkot - Morbi Highway, Hadala,<br/>
                                    Rajkot, Gujarat 363650
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center text-primary shrink-0 border border-primary/20">
                                <Phone className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-1">Call Us</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    +91 97277 47317<br/>
                                    +91 97277 47318
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center text-primary shrink-0 border border-primary/20">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-1">Email Support</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    support@frolic2026.edu<br/>
                                    events@frolic2026.edu
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Contact Form */}
                    <Card className="border-border/50 bg-card shadow-xl overflow-hidden relative">
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-indigo-400 to-sky-400" />
                        <CardContent className="p-8">
                            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="first-name" className="text-sm font-semibold">First Name</label>
                                        <Input id="first-name" placeholder="John" className="bg-muted/50 focus-visible:ring-primary/50" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="last-name" className="text-sm font-semibold">Last Name</label>
                                        <Input id="last-name" placeholder="Doe" className="bg-muted/50 focus-visible:ring-primary/50" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-semibold">Email Address</label>
                                    <Input id="email" type="email" placeholder="john@example.com" className="bg-muted/50 focus-visible:ring-primary/50" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-semibold">Message</label>
                                    <Textarea id="message" placeholder="How can we help you?" className="min-h-[120px] bg-muted/50 focus-visible:ring-primary/50 resize-none" />
                                </div>
                                <Button type="submit" className="w-full h-11 text-base font-semibold group mt-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                                    Send Message
                                    <Mail className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
