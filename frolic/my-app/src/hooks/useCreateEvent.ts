import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEvent } from "../services/eventApi";
import { toast } from "sonner";

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => createEvent(data),
    onSuccess: () => {
      toast.success("Event created successfully");
      // Refetch events list
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      queryClient.invalidateQueries({ queryKey: ["admin-allevents"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error.message || "Failed to create event");
    },
  });
};
