import { useQuery } from "@tanstack/react-query";
import { getEventById } from "../services/eventApi";
import { toast } from "sonner";
import { useEffect } from "react";

export const useGetEventById = (eventId: string) => {
  const query = useQuery({
    queryKey: ["admin-events", eventId],
    queryFn: () => getEventById(eventId),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (query.isError) {
      toast.error(query.error?.message || "Failed to fetch event");
    }
  }, [query.isError, query.error]);

  return query;
};
