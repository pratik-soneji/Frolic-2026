import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { CalendarDays, Eye, Pencil, Trash2 } from "lucide-react";
import { apiAdmin } from "@/constants/api";
import { useState } from "react";
import {
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { AddEventDialog } from "./AddEventDialog";
import { EditEventDialog } from "./EditEventDialog";
import { useDeleteEvent } from "@/hooks/useDeleteEvent";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface Event {
  _id: string;
  eventName: string;
  evetFees: number;

  departmentId?: {
    departmentName?: string;
  } | null;

  createdAt: string;
  updatedAt: string;
}

export default function EventsTable() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: events = [],
    isLoading,
  } = useQuery({
    queryKey: ["admin-allevents"],
    queryFn: async () => {
      const res = await apiAdmin.get("/getallevents");
      return res.data.data as Event[];
    },
  });

  const [isAddEventOpen, setIsAddEventOpen] =
    useState(false);

  const [isEditEventOpen, setIsEditEventOpen] =
    useState(false);

  const [selectedEvent, setSelectedEvent] =
    useState<Event | null>(null);

  const [eventToDelete, setEventToDelete] =
    useState<Event | null>(null);

  const {
    mutate: deleteEventMutation,
    isPending: isDeleting,
  } = useDeleteEvent();

  const refreshEvents = () => {
    queryClient.invalidateQueries({
      queryKey: ["admin-allevents"],
    });
  };

  return (
    <>
      <div
        className="
          rounded-2xl
          border
          border-border/60
          bg-background/60
          backdrop-blur
          overflow-hidden
          shadow-sm
        "
      >
        {/* Header */}

        <div className="flex items-center justify-between px-6 py-5 border-b border-border/60">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/[0.05] border border-border/60">
              <CalendarDays className="h-5 w-5 text-foreground/70" />
            </div>

            <div>
              <h2 className="text-base font-bold text-foreground tracking-tight">
                Events
              </h2>

              <p className="text-xs text-muted-foreground mt-0.5">
                Manage Frolic 2026 events
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => setIsAddEventOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Add Event
            </Button>

            <Badge
              variant="outline"
              className="text-xs font-semibold rounded-full px-3"
            >
              {isLoading
                ? "Loading…"
                : `${events.length} events`}
            </Badge>
          </div>
        </div>

        {/* Table */}

        <Table className="w-full">
          <TableHeader>
            <TableRow
              className="
                border-border/60
                bg-muted/30
                backdrop-blur
              "
            >
              <TableHead className="pl-6 text-[11px] font-semibold tracking-wide text-muted-foreground">
                EVENT
              </TableHead>

              <TableHead className="text-[11px] font-semibold tracking-wide text-muted-foreground">
                DEPARTMENT
              </TableHead>

              <TableHead className="text-[11px] font-semibold tracking-wide text-muted-foreground">
                FEES
              </TableHead>

              <TableHead className="text-right pr-6 text-[11px] font-semibold tracking-wide text-muted-foreground">
                ACTIONS
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="pl-6">
                    <Skeleton className="h-4 w-40 rounded-md" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-4 w-24 rounded-md" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </TableCell>

                  <TableCell className="text-right pr-6">
                    <Skeleton className="h-8 w-20 ml-auto rounded-lg" />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              events.map((event) => (
                <TableRow
                  key={event._id}
                  className="
                    group
                    border-b border-border/50
                    transition-all
                    duration-200
                    hover:bg-muted/40
                    hover:shadow-sm
                  "
                >
                  {/* Event */}

                  <TableCell className="pl-6">
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground">
                        {event.eventName}
                      </span>

                      <span className="text-xs text-muted-foreground">
                        Created{" "}
                        {new Date(
                          event.createdAt
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </TableCell>

                  {/* Department */}

                  <TableCell>
                    <span
                      className="
                        inline-flex
                        items-center
                        rounded-full
                        border
                        border-border/60
                        bg-muted/50
                        px-3
                        py-1
                        text-xs
                        font-medium
                        text-muted-foreground
                      "
                    >
                      {event.departmentId
                        ?.departmentName ??
                        "Unknown"}
                    </span>
                  </TableCell>

                  {/* Fees */}

                  <TableCell>
                    <span
                      className="
                        inline-flex
                        items-center
                        rounded-full
                        bg-emerald-500/10
                        text-emerald-600
                        dark:text-emerald-400
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        border
                        border-emerald-500/20
                      "
                    >
                      ₹{event.evetFees}
                    </span>
                  </TableCell>

                  {/* Actions */}

                  <TableCell className="text-right pr-6">
                    <div
                      className="
                        flex
                        justify-end
                        items-center
                        gap-1
                        opacity-0
                        group-hover:opacity-100
                        transition
                      "
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                        onClick={() =>
                          navigate(
                            `/admin/events/${event._id}`
                          )
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                        onClick={() => {
                          setSelectedEvent(event);
                          setIsEditEventOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10"
                        onClick={() =>
                          setEventToDelete(event)
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Dialog */}

      <AddEventDialog
        open={isAddEventOpen}
        onOpenChange={setIsAddEventOpen}
        onSuccess={refreshEvents}
      />

      {/* Edit Dialog */}

      <EditEventDialog
        open={isEditEventOpen}
        onOpenChange={(open) => {
          setIsEditEventOpen(open);
          if (!open) setSelectedEvent(null);
        }}
        event={selectedEvent}
        onSuccess={refreshEvents}
      />

      {/* Delete Dialog */}

      <AlertDialog
        open={!!eventToDelete}
        onOpenChange={(open) =>
          !open && setEventToDelete(null)
        }
      >
        <AlertDialogContent className="bg-background border border-border/60">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete Event
            </AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to delete the event "
              {eventToDelete?.eventName}"?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
              onClick={(e) => {
                e.preventDefault();

                if (eventToDelete) {
                  deleteEventMutation(
                    eventToDelete._id,
                    {
                      onSuccess: () => {
                        setEventToDelete(null);
                        refreshEvents();
                      },
                    }
                  );
                }
              }}
            >
              {isDeleting
                ? "Deleting..."
                : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}