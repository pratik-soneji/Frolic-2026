import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateEvent } from "../services/eventApi";
import { toast } from "sonner";

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, data }: { eventId: string; data: FormData }) => updateEvent(eventId, data),
    onSuccess: () => {
      toast.success("Event updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      queryClient.invalidateQueries({ queryKey: ["admin-allevents"] });
    },
    onError: (error: any) => {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update event. Please try again.");
    },
  });
};
