import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { CalendarPlus, Users, Trophy, GraduationCap, ImagePlus, X } from "lucide-react";
import { useCreateEvent } from "@/hooks/useCreateEvent";
import { useUpdateEvent } from "@/hooks/useUpdateEvent";

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

interface EventFormProps {
  onCancel: () => void;
  onSuccess?: () => void;
  initialData?: any;
}

export function EventForm({ onCancel, onSuccess, initialData }: EventFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.eventImageUrl || initialData?.imageUrl || null);

  const { data: deptsData, isLoading: isLoadingDepts } = useGetDepartments();
  const departments = deptsData?.data ?? [];

  const { data: usersData, isLoading: usersLoading } = useGetAllCoordinators();
  const allUsers = usersData?.data ?? [];
  const eventCoordinators = allUsers.filter((u: any) => u.isCordinator && u.coordinatorType === "event");
  const studentCoordinators = allUsers.filter((u: any) => u.isCordinator && u.coordinatorType === "student");

  const { mutateAsync: createEventMutation, isPending: isCreating } = useCreateEvent();
  const { mutateAsync: updateEventMutation, isPending: isUpdating } = useUpdateEvent();
  const isSubmitting = isCreating || isUpdating;

  const form = useForm<EventFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      eventName: initialData.eventName || "",
      eventTagline: initialData.eventTagline || "",
      eventDescription: initialData.eventDescription || "",
      groupMinParticipants: initialData.groupMinParticipants || 1,
      groupMaxParticipants: initialData.groupMaxParticipants || 1,
      evetFees: initialData.evetFees || 0,
      eventFirstPrice: initialData.eventFirstPrice || "",
      eventSecondPrice: initialData.eventSecondPrice || "",
      eventThirdPrice: initialData.eventThirdPrice || "",
      eventLocation: initialData.eventLocation || "",
      maxGroupsAllowed: initialData.maxGroupsAllowed || 10,
      departmentId: typeof initialData.departmentId === "object" ? initialData.departmentId._id : initialData.departmentId || "",
      eventCoOrdinatorId: typeof initialData.eventCoOrdinatorId === "object" ? initialData.eventCoOrdinatorId._id : initialData.eventCoOrdinatorId || "",
      eventMainStudentCoordinator: {
        name: initialData.eventMainStudentCoordinator?.name || "",
        phone: initialData.eventMainStudentCoordinator?.phone || "",
        email: initialData.eventMainStudentCoordinator?.email || "",
      },
    } : {
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  async function onSubmit(data: EventFormValues) {
    try {
      const formData = new FormData();
      
      // Append all text fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          if (typeof value === "object") {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      // Append image
      if (imageFile) {
        formData.append("image", imageFile);
      } else if (!initialData?.eventImageUrl && !initialData?.imageUrl) {
        form.setError("root", { message: "Image is required" });
        return;
      }

      if (initialData?._id) {
        await updateEventMutation({ eventId: initialData._id, data: formData });
      } else {
        await createEventMutation(formData);
      }
      
      form.reset();
      setImageFile(null);
      setImagePreview(null);
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
    }
  }

  const SectionTitle = ({ icon: Icon, title }: { icon: any; title: string }) => (
    <div className="flex items-center gap-2 mb-4 mt-6 first:mt-0 text-foreground">
      <div className="p-2 rounded-lg bg-primary/10 text-primary">
        <Icon className="w-4 h-4" />
      </div>
      <h3 className="font-semibold text-sm tracking-wide">{title}</h3>
    </div>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full max-h-[70vh]">
        <ScrollArea className="px-8 py-6 w-full h-[60vh]">
          <div className="space-y-8 pr-4">
            
            {/* Image Upload */}
            <div>
              <SectionTitle icon={ImagePlus} title="Event Cover Image" />
              <div className="flex flex-col gap-3">
                {!imagePreview ? (
                  <div className="border-2 border-dashed border-border/50 rounded-xl p-8 flex flex-col items-center justify-center bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer"
                       onClick={() => document.getElementById('event-image-upload')?.click()}>
                    <ImagePlus className="w-8 h-8 text-muted-foreground mb-3" />
                    <p className="text-sm font-medium">Click to upload image</p>
                    <p className="text-xs text-muted-foreground mt-1">JPEG, PNG, WEBP (Max 5MB)</p>
                    <input 
                      id="event-image-upload" 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageChange} 
                    />
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-border/50 group w-full max-w-[300px] h-[200px]">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <Button variant="destructive" size="sm" onClick={removeImage} className="gap-2">
                        <X className="w-4 h-4" /> Remove
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* General Info */}
            <div>
              <SectionTitle icon={CalendarPlus} title="General Information" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField control={form.control} name="eventName" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Event Name</FormLabel>
                    <FormControl><Input placeholder="e.g. Hackathon 2026" className="focus-visible:ring-primary/50" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="departmentId" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Department</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingDepts}>
                      <FormControl>
                        <SelectTrigger className="focus-visible:ring-primary/50">
                          <SelectValue placeholder={isLoadingDepts ? "Loading..." : "Select Department"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((dept: any) => (
                          <SelectItem key={dept._id} value={dept._id}>{dept.departmentName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="eventTagline" render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tagline</FormLabel>
                    <FormControl><Input placeholder="A short, catchy phrase about the event" className="focus-visible:ring-primary/50" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="eventDescription" render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</FormLabel>
                    <FormControl><Input placeholder="Detailed description..." className="focus-visible:ring-primary/50" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="eventLocation" render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Location</FormLabel>
                    <FormControl><Input placeholder="e.g. Main Auditorium" className="focus-visible:ring-primary/50" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>

            {/* Participation & Groups */}
            <div>
              <SectionTitle icon={Users} title="Participation Details" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <FormField control={form.control} name="maxGroupsAllowed" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Max Groups</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="10" className="focus-visible:ring-primary/50" {...field} onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="groupMinParticipants" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Min Per Group</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="1" className="focus-visible:ring-primary/50" {...field} onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="groupMaxParticipants" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Max Per Group</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="4" className="focus-visible:ring-primary/50" {...field} onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>

            {/* Fees & Prizes */}
            <div>
              <SectionTitle icon={Trophy} title="Fees & Prizes" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField control={form.control} name="evetFees" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Entry Fees (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="500" className="focus-visible:ring-primary/50" {...field} onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="eventFirstPrice" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">1st Prize</FormLabel>
                    <FormControl><Input placeholder="e.g. ₹5000" className="border-emerald-500/30 focus-visible:ring-emerald-500/50" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="eventSecondPrice" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">2nd Prize</FormLabel>
                    <FormControl><Input placeholder="e.g. ₹3000" className="focus-visible:ring-primary/50" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="eventThirdPrice" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">3rd Prize</FormLabel>
                    <FormControl><Input placeholder="e.g. ₹1000" className="focus-visible:ring-primary/50" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>

            {/* Authorities */}
            <div className="pb-8">
              <SectionTitle icon={GraduationCap} title="Coordinators" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <FormField control={form.control} name="eventCoOrdinatorId" render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Faculty Coordinator</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={usersLoading}>
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
                )} />
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

        <div className="px-8 py-5 border-t border-border/50 bg-muted/20 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel} className="rounded-xl px-6">
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="rounded-xl px-8 shadow-md">
            {isSubmitting ? "Saving..." : initialData ? "Update Event" : "Save Event"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
