import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EventForm } from "./EventForm";
import type { Event } from "./EventTable";

interface EditEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  event: Event | null;
}

export function EditEventDialog({ open, onOpenChange, onSuccess, event }: EditEventDialogProps) {
  if (!event) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl">
        <DialogHeader className="px-8 pt-8 pb-4 bg-muted/30 border-b border-border/50">
          <DialogTitle className="text-2xl font-bold tracking-tight">Edit Event</DialogTitle>
          <DialogDescription className="text-muted-foreground mt-1.5">
            Update the details below. Click update when you're done.
          </DialogDescription>
        </DialogHeader>

        <EventForm 
          initialData={event}
          onCancel={() => onOpenChange(false)} 
          onSuccess={() => {
            if (onSuccess) onSuccess();
            onOpenChange(false);
          }} 
        />
      </DialogContent>
    </Dialog>
  );
}
