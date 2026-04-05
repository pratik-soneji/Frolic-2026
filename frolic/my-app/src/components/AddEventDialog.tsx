import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EventForm } from "./EventForm";

interface AddEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddEventDialog({ open, onOpenChange, onSuccess }: AddEventDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border-border/50 bg-background/95 backdrop-blur-2xl shadow-2xl rounded-2xl">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 via-indigo-400 to-sky-400" />
        <DialogHeader className="px-8 pt-8 pb-4 bg-muted/20 border-b border-border/50">
          <DialogTitle className="text-2xl font-bold tracking-tight">Create New Event</DialogTitle>
          <DialogDescription className="text-muted-foreground mt-1.5">
            Fill in the details below to register a new event. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <EventForm 
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
