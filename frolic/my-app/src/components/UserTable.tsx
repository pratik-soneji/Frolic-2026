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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

import {
  MoreHorizontal,
  Users,
  ShieldCheck,
  GraduationCap,
  ShieldOff,
  Building2,
  School,
  CalendarDays,
  UserRound,
} from "lucide-react";
import { apiAdmin } from "@/constants/api";
import { useState } from "react";
import { useGetAllUsers, useUpdateUserRole } from "@/api/admin.queries";
import { useQueryClient } from "@tanstack/react-query";
import type { User } from "@/types/auth";

// ── Coordinator type config ───────────────────────────────────
const COORDINATOR_TYPES = [
  { value: "student", label: "Student Coordinator", Icon: UserRound, color: "text-violet-400", bg: "focus:bg-violet-500/10" },
  { value: "institute", label: "Institute Coordinator", Icon: Building2, color: "text-blue-400", bg: "focus:bg-blue-500/10" },
  { value: "department", label: "Department Coordinator", Icon: School, color: "text-sky-400", bg: "focus:bg-sky-500/10" },
  { value: "event", label: "Event Coordinator", Icon: CalendarDays, color: "text-indigo-400", bg: "focus:bg-indigo-500/10" },
] as const;

type CoordinatorTypeValue = typeof COORDINATOR_TYPES[number]["value"];

function coordTypeLabel(type: string | null) {
  return COORDINATOR_TYPES.find((t) => t.value === type)?.label ?? "Coordinator";
}
function coordTypeIcon(type: string | null) {
  return COORDINATOR_TYPES.find((t) => t.value === type)?.Icon ?? ShieldCheck;
}

// ── Helpers ───────────────────────────────────────────────────
function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

const avatarColors = [
  "bg-blue-500/15 text-blue-400",
  "bg-indigo-500/15 text-indigo-400",
  "bg-sky-500/15 text-sky-400",
  "bg-violet-500/15 text-violet-400",
  "bg-teal-500/15 text-teal-400",
];
function getAvatarColor(name: string) {
  return avatarColors[name.charCodeAt(0) % avatarColors.length];
}

// ── Component ─────────────────────────────────────────────────
export default function UsersTable() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useGetAllUsers();
  const users: User[] = data?.data ?? [];

  const { mutate: updateRole, isPending: isRolePending } = useUpdateUserRole();
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);
  const [roleLoadingId, setRoleLoadingId] = useState<string | null>(null);

  const deleteUser = async (userid: string) => {
    try {
      setDeleteLoadingId(userid);
      await apiAdmin.delete(`/deleteUser/${userid}`);
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteLoadingId(null);
    }
  };

  // Promote to a specific coordinator type
  const handleSetCoordinator = (user: User, coordinatorType: CoordinatorTypeValue) => {
    setRoleLoadingId(user._id);
    updateRole(
      { userid: user._id, isCordinator: true, coordinatorType },
      { onSettled: () => setRoleLoadingId(null) }
    );
  };

  // Demote back to student
  const handleUnsetCoordinator = (user: User) => {
    setRoleLoadingId(user._id);
    updateRole(
      { userid: user._id, isCordinator: false, coordinatorType: null },
      { onSettled: () => setRoleLoadingId(null) }
    );
  };

  const nonAdminUsers = users.filter((u) => !u.isAdmin);
  const coordinatorCount = nonAdminUsers.filter((u) => u.isCordinator).length;
  const studentCount = nonAdminUsers.filter((u) => !u.isCordinator).length;

  return (
    <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">

      <div className="flex items-center justify-between gap-4 flex-wrap px-6 py-5 border-b border-border/60">
        <div className="flex items-center gap-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/[0.05] border border-border/60">
            <Users className="h-5 w-5 text-foreground/70" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground tracking-tight">Users</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Manage participants &amp; coordinators — click ⋯ to change role</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs font-semibold gap-1 rounded-full">
            <GraduationCap className="h-3 w-3" />
            {isLoading ? "…" : `${studentCount} Students`}
          </Badge>
          <Badge variant="secondary" className="text-xs font-semibold gap-1 rounded-full text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
            <ShieldCheck className="h-3 w-3" />
            {isLoading ? "…" : `${coordinatorCount} Coordinators`}
          </Badge>
        </div>
      </div>

      <div className="p-0">
        {isError && (
          <div className="mx-6 mb-4 mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
            <span className="text-sm text-red-400 font-medium">Failed to load users.</span>
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border/60 bg-muted/40">
              <TableHead className="pl-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">User</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Email</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Phone</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Role</TableHead>
              <TableHead className="text-right pr-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-border/40">
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32 rounded-full" /></TableCell>
                  <TableCell className="text-right pr-6"><Skeleton className="h-7 w-7 ml-auto rounded-lg" /></TableCell>
                </TableRow>
              ))
              : nonAdminUsers.map((user) => {
                const CoordIcon = user.isCordinator ? coordTypeIcon(user.coordinatorType) : null;
                return (
                  <TableRow key={user._id} className="group border-border/40 hover:bg-muted/50 transition-colors">
                    {/* Avatar + Name */}
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-8 w-8 ring-1 ring-border">
                            <AvatarFallback className={`text-xs font-bold ${getAvatarColor(user.userName)}`}>
                              {getInitials(user.userName)}
                            </AvatarFallback>
                          </Avatar>
                          {user.isCordinator && (
                            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-card">
                              <ShieldCheck className="h-2 w-2 text-white" />
                            </span>
                          )}
                        </div>
                        <span className="font-semibold text-foreground">{user.userName}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-muted-foreground text-sm">{user.email}</TableCell>
                    <TableCell className="text-muted-foreground text-xs font-mono">{String(user.phone)}</TableCell>

                    {/* Role + coordinator type badge */}
                    <TableCell>
                      {user.isCordinator ? (
                        <Badge variant="secondary" className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold gap-1 select-none rounded-full">
                          {CoordIcon && <CoordIcon className="h-3 w-3" />}
                          {coordTypeLabel(user.coordinatorType)}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs font-semibold gap-1 select-none rounded-full">
                          <GraduationCap className="h-3 w-3" />
                          Student
                        </Badge>
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-all rounded-lg"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-56 bg-popover border-border shadow-lg rounded-xl">
                          <DropdownMenuLabel className="text-xs text-muted-foreground font-normal truncate max-w-[200px]">
                            {user.userName}
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-border" />

                          {/* ── Role section ── */}
                          {user.isCordinator ? (
                            <>
                              {/* Change coordinator type submenu */}
                              <DropdownMenuSub>
                                <DropdownMenuSubTrigger
                                  disabled={roleLoadingId === user._id || isRolePending}
                                  className="gap-2 cursor-pointer text-sm text-foreground/70 hover:text-foreground hover:bg-accent rounded-lg"
                                >
                                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                  Change Coordinator Type
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent className="w-52 bg-popover border-border shadow-lg rounded-xl">
                                  <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                                    Select type
                                  </DropdownMenuLabel>
                                  <DropdownMenuSeparator className="bg-border" />
                                  {COORDINATOR_TYPES.map(({ value, label, Icon }) => (
                                    <DropdownMenuItem
                                      key={value}
                                      onClick={() => handleSetCoordinator(user, value)}
                                      className={`gap-2 cursor-pointer text-sm rounded-lg text-foreground hover:bg-muted ${user.coordinatorType === value ? "font-semibold" : ""}`}
                                    >
                                      <Icon className="h-4 w-4 shrink-0" />
                                      {label}
                                      {user.coordinatorType === value && (
                                        <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-foreground/10 text-foreground/70">current</span>
                                      )}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuSubContent>
                              </DropdownMenuSub>

                              {/* Unset coordinator */}
                              <DropdownMenuItem
                                disabled={roleLoadingId === user._id || isRolePending}
                                onClick={() => handleUnsetCoordinator(user)}
                                className="gap-2 cursor-pointer text-amber-600 dark:text-amber-500 focus:text-amber-600 dark:focus:text-amber-400 focus:bg-amber-500/10 rounded-lg text-sm"
                              >
                                <ShieldOff className="h-4 w-4 shrink-0" />
                                {roleLoadingId === user._id ? "Updating…" : "Unset Coordinator"}
                              </DropdownMenuItem>
                            </>
                          ) : (
                            /* Set as coordinator with type submenu */
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger
                                disabled={roleLoadingId === user._id || isRolePending}
                                className="gap-2 cursor-pointer text-sm text-emerald-600 dark:text-emerald-500 focus:text-emerald-700 dark:focus:text-emerald-400 focus:bg-emerald-500/10 rounded-lg"
                              >
                                <ShieldCheck className="h-4 w-4" />
                                {roleLoadingId === user._id ? "Updating…" : "Set as Coordinator"}
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent className="w-52 bg-popover border-border shadow-lg rounded-xl">
                                <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                                  Coordinator type
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-border" />
                                {COORDINATOR_TYPES.map(({ value, label, Icon }) => (
                                  <DropdownMenuItem
                                    key={value}
                                    onClick={() => handleSetCoordinator(user, value)}
                                    className={`gap-2 cursor-pointer text-sm rounded-lg text-foreground hover:bg-muted`}
                                  >
                                    <Icon className="h-4 w-4 shrink-0" />
                                    {label}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                          )}

                          <DropdownMenuSeparator className="bg-border" />

                          {/* Delete */}
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive cursor-pointer focus:bg-destructive/10 gap-2 text-sm rounded-lg"
                            disabled={deleteLoadingId === user._id}
                            onClick={() => deleteUser(user._id)}
                          >
                            {deleteLoadingId === user._id ? "Deleting…" : "Delete User"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}