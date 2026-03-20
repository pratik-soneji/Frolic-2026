import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetDepartments, useGetAllCoordinators } from "@/api/admin.queries";
import { CalendarPlus, Users, Trophy, GraduationCap } from "lucide-react";

const formSchema = z.object({
  eventName: z.string().min(2, "Event name is required"),
  eventTagline: z.string().optional(),
  eventDescription: z.string().optional(),
  groupMinParticipants: z.number().optional(),
  groupMaxParticipants: z.number().optional(),
  evetFees: z.number().min(0, "Fees must be valid"),
  eventFirstPrice: z.string().optional(),
  eventSecondPrice: z.string().optional(),
  eventThirdPrice: z.string().optional(),
  eventLocation: z.string().optional(),
  maxGroupsAllowed: z.number().min(1, "Must allow at least 1 group"),
  departmentId: z.string().min(1, "Department ID is required"),
  eventCoOrdinatorId: z.string().optional(),
  eventMainStudentCoordinator: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
  }).optional(),
});

type EventFormValues = z.infer<typeof formSchema>;

interface AddEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddEventDialog({ open, onOpenChange, onSuccess }: AddEventDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: deptsData, isLoading: isLoadingDepts } = useGetDepartments();
  const departments = deptsData?.data ?? [];

  const { data: usersData, isLoading: usersLoading } = useGetAllCoordinators();
  const allUsers = usersData?.data ?? [];
  const eventCoordinators = allUsers.filter((u: any) => u.isCordinator && u.coordinatorType === "event");
  const studentCoordinators = allUsers.filter((u: any) => u.isCordinator && u.coordinatorType === "student");

  const form = useForm<EventFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventName: "",
      eventTagline: "",
      eventDescription: "",
      groupMinParticipants: 1,
      groupMaxParticipants: 1,
      evetFees: 0,
      eventFirstPrice: "",
      eventSecondPrice: "",
      eventThirdPrice: "",
      eventLocation: "",
      maxGroupsAllowed: 10,
      departmentId: "",
      eventCoOrdinatorId: "",
      eventMainStudentCoordinator: {
        name: "",
        phone: "",
        email: "",
      },
    },
  });

  async function onSubmit(data: EventFormValues) {
    setIsSubmitting(true);
    try {
      console.log("Submitting Event Data:", data);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (onSuccess) onSuccess();
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  // A nice reusable section title
  const SectionTitle = ({ icon: Icon, title }: { icon: any; title: string }) => (
    <div className="flex items-center gap-2 mb-4 mt-6 first:mt-0 text-foreground">
      <div className="p-2 rounded-lg bg-primary/10 text-primary">
        <Icon className="w-4 h-4" />
      </div>
      <h3 className="font-semibold text-sm tracking-wide">{title}</h3>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl">
        <DialogHeader className="px-8 pt-8 pb-4 bg-muted/30 border-b border-border/50">
          <DialogTitle className="text-2xl font-bold tracking-tight">Create New Event</DialogTitle>
          <DialogDescription className="text-muted-foreground mt-1.5">
            Fill in the details below to register a new event. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full max-h-[70vh]">
            <ScrollArea className="px-8 py-6 w-full h-[60vh]">
              <div className="space-y-8 pr-4">
                {/* General Info */}
                <div>
                  <SectionTitle icon={CalendarPlus} title="General Information" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="eventName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Event Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Hackathon 2026" className="focus-visible:ring-primary/50" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="departmentId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Department</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={isLoadingDepts}
                          >
                            <FormControl>
                              <SelectTrigger className="focus-visible:ring-primary/50">
                                <SelectValue placeholder={isLoadingDepts ? "Loading..." : "Select Department"} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {departments.map((dept: any) => (
                                <SelectItem key={dept._id} value={dept._id}>
                                  {dept.departmentName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="eventTagline"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tagline</FormLabel>
                          <FormControl>
                            <Input placeholder="A short, catchy phrase about the event" className="focus-visible:ring-primary/50" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="eventDescription"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</FormLabel>
                          <FormControl>
                            <Input placeholder="Detailed description..." className="focus-visible:ring-primary/50" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="eventLocation"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Location</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Main Auditorium" className="focus-visible:ring-primary/50" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Participation & Groups */}
                <div>
                  <SectionTitle icon={Users} title="Participation Details" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <FormField
                      control={form.control}
                      name="maxGroupsAllowed"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Max Groups</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="10" 
                              className="focus-visible:ring-primary/50" 
                              {...field} 
                              onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="groupMinParticipants"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Min Per Group</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="1" 
                              className="focus-visible:ring-primary/50" 
                              {...field} 
                              onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="groupMaxParticipants"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Max Per Group</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="4" 
                              className="focus-visible:ring-primary/50" 
                              {...field} 
                              onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Fees & Prizes */}
                <div>
                  <SectionTitle icon={Trophy} title="Fees & Prizes" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="evetFees"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Entry Fees (₹)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="500" 
                              className="focus-visible:ring-primary/50" 
                              {...field} 
                              onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="eventFirstPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">1st Prize</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. ₹5000" className="border-emerald-500/30 focus-visible:ring-emerald-500/50" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="eventSecondPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">2nd Prize</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. ₹3000" className="focus-visible:ring-primary/50" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="eventThirdPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">3rd Prize</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. ₹1000" className="focus-visible:ring-primary/50" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Authorities */}
                <div className="pb-8">
                  <SectionTitle icon={GraduationCap} title="Coordinators" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <FormField
                      control={form.control}
                      name="eventCoOrdinatorId"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Faculty Coordinator</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={usersLoading}
                          >
                            <FormControl>
                              <SelectTrigger className="focus-visible:ring-primary/50">
                                <SelectValue placeholder={usersLoading ? "Loading..." : "Select Faculty Coordinator"} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {eventCoordinators.map((coord: any) => (
                                <SelectItem key={coord._id} value={coord._id}>
                                  <div className="flex flex-col">
                                    <span className="font-medium">{coord.userName}</span>
                                    <span className="text-xs text-muted-foreground">{coord.email}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="p-4 rounded-xl border border-border/50 bg-muted/20 space-y-4">
                    <h4 className="text-sm font-semibold text-foreground/80 mb-2">Main Student Coordinator</h4>
                    <Select
                      disabled={usersLoading}
                      onValueChange={(val) => {
                        const student = studentCoordinators.find((c: any) => c._id === val);
                        if (student) {
                          form.setValue("eventMainStudentCoordinator.name", student.userName);
                          form.setValue("eventMainStudentCoordinator.email", student.email);
                          form.setValue("eventMainStudentCoordinator.phone", student.phone ? String(student.phone) : "");
                        }
                      }}
                    >
                      <SelectTrigger className="focus-visible:ring-primary/50 bg-background/50 h-10">
                        <SelectValue placeholder={usersLoading ? "Loading..." : "Select Student Coordinator"} />
                      </SelectTrigger>
                      <SelectContent>
                        {studentCoordinators.map((coord: any) => (
                          <SelectItem key={coord._id} value={coord._id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{coord.userName}</span>
                              <span className="text-xs text-muted-foreground">{coord.email}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </ScrollArea>

            <DialogFooter className="px-8 py-5 border-t border-border/50 bg-muted/20">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl px-6">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="rounded-xl px-8 shadow-md">
                {isSubmitting ? "Creating..." : "Save Event"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
