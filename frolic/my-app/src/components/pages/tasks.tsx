import React from 'react';
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  CheckCircle, 
  FileText, 
  Wallet, 
  Smartphone, 
  Key, 
  CreditCard, 
  PawPrint, 
  Laptop,
  ArrowRight,
  Menu,
  Clock,
  User
} from 'lucide-react';

// Assuming you have these components in your @/components/ui folder
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const FindItLanding = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* --- Navbar --- */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="bg-teal-600 p-1 rounded-md">
               <Search className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800">FindIt</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-teal-600 transition-colors">How it Works</a>
            <a href="#" className="hover:text-teal-600 transition-colors">Report Item</a>
            <a href="#" className="hover:text-teal-600 transition-colors">Search</a>
            <a href="#" className="hover:text-teal-600 transition-colors">Impact</a>
          </nav>

          <div className="hidden md:flex gap-4">
            <Button variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-50">
              <Search className="mr-2 h-4 w-4" /> Search Item
            </Button>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">
              Report Now
            </Button>
          </div>
          
          {/* Mobile Menu Toggle */}
          <Button variant="ghost" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 space-y-24">

        {/* --- Section 1: How it Works --- */}
        <section className="text-center space-y-12">
          <div className="space-y-4">
            <Badge variant="secondary" className="bg-teal-100 text-teal-700 hover:bg-teal-200">Simple Process</Badge>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              How <span className="text-teal-600">FindIt</span> Works
            </h1>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Our streamlined process makes it easy to report, match, and recover lost items in just a few steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: 1, icon: FileText, title: "Report Your Item", desc: "Quickly report a lost or found item with details like type, description, location, and images." },
              { step: 2, icon: MapPin, title: "Location Matching", desc: "Our smart system matches items based on location, time, and description to find potential matches." },
              { step: 3, icon: ShieldCheck, title: "Secure Communication", desc: "Connect safely with finders or owners through our secure in-app messaging system." },
              { step: 4, icon: CheckCircle, title: "Verify & Recover", desc: "Verify ownership through our verification process and recover your belongings safely." }
            ].map((item, idx) => (
              <Card key={idx} className="relative pt-6 border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="absolute -top-4 -left-3 bg-teal-100 text-teal-700 w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 border-white shadow-sm">
                  {item.step}
                </div>
                <CardHeader>
                  <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-lg flex items-center justify-center mb-4 mx-auto md:mx-0">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-500 text-left">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* --- Section 2: Report in 30 Seconds --- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Content */}
          <div className="lg:col-span-5 space-y-8">
            <Badge variant="outline" className="border-orange-200 bg-orange-50 text-orange-600">Quick Report</Badge>
            <h2 className="text-4xl font-bold text-slate-900">
              Report in <span className="text-teal-600">30 Seconds</span>
            </h2>
            <p className="text-slate-500 text-lg">
              Whether you've lost something precious or found someone's belongings, our quick reporting system helps you take action immediately. The sooner you report, the higher the chances of recovery.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white flex-1">
                Report Lost Item <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" className="bg-orange-400 hover:bg-orange-500 text-white flex-1">
                Report Found Item <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-6 text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-500"></span> 2431 items reported today
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-400"></span> 18 matched
              </span>
            </div>
          </div>

          {/* Right Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: "Wallet", count: "2.3k active", icon: Wallet },
              { label: "Phone", count: "1.8k active", icon: Smartphone },
              { label: "Keys", count: "1.2k active", icon: Key },
              { label: "Documents", count: "860 active", icon: FileText },
              { label: "Pets", count: "420 active", icon: PawPrint },
              { label: "Cards", count: "780 active", icon: CreditCard },
            ].map((cat, i) => (
              <Card key={i} className="hover:border-teal-400 transition-colors cursor-pointer group">
                <CardContent className="p-6 flex flex-col items-start gap-3">
                  <div className="p-2 bg-slate-100 rounded-md group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                    <cat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{cat.label}</h3>
                    <p className="text-xs text-slate-500">{cat.count}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* --- Section 3: Recent Reports --- */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <Badge variant="secondary" className="bg-teal-100 text-teal-700">Live Updates</Badge>
              <h2 className="text-3xl font-bold text-slate-900">Recent <span className="text-teal-600">Reports</span></h2>
              <p className="text-slate-500">Browse through recently reported lost and found items. Your missing item might already be here.</p>
            </div>
            <Button variant="outline" className="border-teal-600 text-teal-600">
              View All Items <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { type: "Lost", item: "Black Leather Wallet", loc: "Mumbai Central Station", time: "2 hours ago", color: "bg-red-50", badge: "bg-red-100 text-red-600", icon: Wallet },
              { type: "Found", item: "iPhone 15 Pro", loc: "Connaught Place, Delhi", time: "4 hours ago", color: "bg-emerald-50", badge: "bg-emerald-100 text-emerald-600", icon: Smartphone },
              { type: "Lost", item: "Car Keys - Honda", loc: "Brigade Road, Bangalore", time: "5 hours ago", color: "bg-red-50", badge: "bg-red-100 text-red-600", icon: Key },
              { type: "Found", item: "Passport - Indian", loc: "Howrah Station, Kolkata", time: "8 hours ago", color: "bg-emerald-50", badge: "bg-emerald-100 text-emerald-600", icon: FileText },
              { type: "Lost", item: "Golden Retriever - Max", loc: "Jubilee Hills, Hyderabad", time: "11 hours ago", color: "bg-red-50", badge: "bg-red-100 text-red-600", icon: PawPrint },
              { type: "Found", item: "MacBook Air M2", loc: "Phoenix Mall, Chennai", time: "12 hours ago", color: "bg-emerald-50", badge: "bg-emerald-100 text-emerald-600", icon: Laptop },
            ].map((post, i) => (
              <Card key={i} className="overflow-hidden border-none shadow-md">
                <div className={`h-32 ${post.color} flex items-center justify-center relative`}>
                  <Badge className={`absolute top-4 left-4 ${post.badge} hover:${post.badge} border-none`}>
                    {post.type}
                  </Badge>
                  <post.icon className="h-12 w-12 text-slate-700 opacity-80" />
                </div>
                <CardContent className="p-5 space-y-3">
                  <h3 className="font-bold text-lg text-slate-900">{post.item}</h3>
                  <div className="flex items-center text-sm text-slate-500 gap-2">
                    <MapPin className="h-4 w-4 text-teal-600" />
                    {post.loc}
                  </div>
                  <div className="flex items-center text-xs text-slate-400 gap-2">
                    <Clock className="h-3 w-3" />
                    {post.time}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* --- Section 4: CTA --- */}
        <section className="relative overflow-hidden rounded-3xl bg-teal-600 py-16 px-6 md:px-12 text-center text-white shadow-xl">
           {/* Decorative background pattern (optional) */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white to-transparent pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold">Ready to Find What You Lost?</h2>
            <p className="text-teal-50 text-lg md:text-xl">
              Join thousands of Indians who have successfully recovered their lost belongings through our platform. Every minute counts!
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Button size="lg" className="bg-white/20 backdrop-blur border border-white/40 hover:bg-white hover:text-teal-700 text-white min-w-[200px]">
                Report Lost Item
              </Button>
              <Button size="lg" className="bg-orange-400 hover:bg-orange-500 text-white border-none min-w-[200px]">
                I Found Something
              </Button>
            </div>

            <div className="flex items-center justify-center gap-4 pt-4">
               <div className="flex -space-x-3">
                 <Avatar className="border-2 border-teal-600"><AvatarImage src="https://i.pravatar.cc/100?img=1" /><AvatarFallback>U1</AvatarFallback></Avatar>
                 <Avatar className="border-2 border-teal-600"><AvatarImage src="https://i.pravatar.cc/100?img=2" /><AvatarFallback>U2</AvatarFallback></Avatar>
                 <Avatar className="border-2 border-teal-600"><AvatarImage src="https://i.pravatar.cc/100?img=3" /><AvatarFallback>U3</AvatarFallback></Avatar>
               </div>
               <span className="text-sm font-medium text-teal-50">10,000+ happy users and counting</span>
            </div>
          </div>
        </section>

      </main>

      {/* --- Footer --- */}
      <footer className="bg-slate-900 text-slate-300 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white">
                <div className="bg-teal-600 p-1 rounded-md">
                   <Search className="h-4 w-4 text-white" />
                </div>
                <span className="text-xl font-bold">FindIt</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-400">
                India's most trusted platform for lost and found items. Connecting finders with owners since 2024.
              </p>
              <div className="flex gap-4">
                 {/* Social placeholders */}
                 {[1,2,3,4].map(i => <div key={i} className="w-8 h-8 rounded bg-slate-800 hover:bg-teal-600 transition-colors cursor-pointer"></div>)}
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-teal-400">Report Lost Item</a></li>
                <li><a href="#" className="hover:text-teal-400">Report Found Item</a></li>
                <li><a href="#" className="hover:text-teal-400">Search Items</a></li>
                <li><a href="#" className="hover:text-teal-400">How It Works</a></li>
                <li><a href="#" className="hover:text-teal-400">Success Stories</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-teal-400">Help Center</a></li>
                <li><a href="#" className="hover:text-teal-400">Safety Tips</a></li>
                <li><a href="#" className="hover:text-teal-400">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-teal-400">Terms of Service</a></li>
                <li><a href="#" className="hover:text-teal-400">Contact Us</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2"><span className="text-teal-500">@</span> support@findit.in</li>
                <li className="flex items-center gap-2"><span className="text-teal-500">📞</span> 1800-123-FIND (3463)</li>
                <li className="flex items-start gap-2">
                    <span className="text-teal-500 mt-1">📍</span> 
                    123 Tech Park, Whitefield, Bangalore, Karnataka 560066
                </li>
              </ul>
            </div>
          </div>
          
          <Separator className="bg-slate-800 mb-8" />
          
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
            <p>© 2024 FindIt. All rights reserved. Made with ❤️ in India.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
               <a href="#" className="hover:text-white">Privacy</a>
               <a href="#" className="hover:text-white">Terms</a>
               <a href="#" className="hover:text-white">Claims</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FindItLanding;