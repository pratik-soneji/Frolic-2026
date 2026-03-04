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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

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
  { value: "student", label: "Student Coordinator", Icon: UserRound, color: "text-violet-600", bg: "focus:bg-violet-50" },
  { value: "institute", label: "Institute Coordinator", Icon: Building2, color: "text-[#1E3A8A]", bg: "focus:bg-blue-50" },
  { value: "department", label: "Department Coordinator", Icon: School, color: "text-sky-700", bg: "focus:bg-sky-50" },
  { value: "event", label: "Event Coordinator", Icon: CalendarDays, color: "text-indigo-600", bg: "focus:bg-indigo-50" },
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
  "bg-blue-100 text-blue-700",
  "bg-indigo-100 text-indigo-700",
  "bg-sky-100 text-sky-700",
  "bg-violet-100 text-violet-700",
  "bg-teal-100 text-teal-700",
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
    <Card className="border-[#E2E8F0] shadow-sm bg-white overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-[#1E3A8A] via-[#4F46E5] to-[#0EA5E9]" />

      <CardHeader className="pb-4 bg-white">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#4F46E5] shadow-sm">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-[#0F172A]">Users</CardTitle>
              <CardDescription className="text-sm text-slate-500">
                Manage participants &amp; coordinators — click ⋯ to change role
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs font-semibold border-blue-200 text-[#1E3A8A] bg-blue-50 gap-1">
              <GraduationCap className="h-3 w-3" />
              {isLoading ? "…" : `${studentCount} Students`}
            </Badge>
            <Badge variant="outline" className="text-xs font-semibold border-emerald-200 text-emerald-700 bg-emerald-50 gap-1">
              <ShieldCheck className="h-3 w-3" />
              {isLoading ? "…" : `${coordinatorCount} Coordinators`}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {isError && (
          <div className="mx-6 mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <span className="text-sm text-red-600 font-medium">Failed to load users.</span>
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-[#E2E8F0] bg-[#F8FAFC]">
              <TableHead className="pl-6 font-semibold text-[#0F172A] text-xs uppercase tracking-wide">User</TableHead>
              <TableHead className="font-semibold text-[#0F172A] text-xs uppercase tracking-wide">Email</TableHead>
              <TableHead className="font-semibold text-[#0F172A] text-xs uppercase tracking-wide">Phone</TableHead>
              <TableHead className="font-semibold text-[#0F172A] text-xs uppercase tracking-wide">Role</TableHead>
              <TableHead className="text-right pr-6 font-semibold text-[#0F172A] text-xs uppercase tracking-wide">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-[#E2E8F0]">
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32 rounded-full" /></TableCell>
                  <TableCell className="text-right pr-6"><Skeleton className="h-8 w-8 ml-auto rounded-md" /></TableCell>
                </TableRow>
              ))
              : nonAdminUsers.map((user) => {
                const CoordIcon = user.isCordinator ? coordTypeIcon(user.coordinatorType) : null;
                return (
                  <TableRow key={user._id} className="group border-[#E2E8F0] hover:bg-blue-50/50 transition-colors">
                    {/* Avatar + Name */}
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-8 w-8 ring-2 ring-[#E2E8F0]">
                            <AvatarFallback className={`text-xs font-bold ${getAvatarColor(user.userName)}`}>
                              {getInitials(user.userName)}
                            </AvatarFallback>
                          </Avatar>
                          {user.isCordinator && (
                            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white">
                              <ShieldCheck className="h-2 w-2 text-white" />
                            </span>
                          )}
                        </div>
                        <span className="font-semibold text-[#0F172A]">{user.userName}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-slate-500 text-sm">{user.email}</TableCell>
                    <TableCell className="text-slate-500 text-sm font-mono">{String(user.phone)}</TableCell>

                    {/* Role + coordinator type badge */}
                    <TableCell>
                      {user.isCordinator ? (
                        <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50 text-xs font-semibold gap-1 select-none">
                          {CoordIcon && <CoordIcon className="h-3 w-3" />}
                          {coordTypeLabel(user.coordinatorType)}
                        </Badge>
                      ) : (
                        <Badge className="bg-blue-50 text-[#1E3A8A] border border-blue-200 hover:bg-blue-50 text-xs font-semibold gap-1 select-none">
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
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-100 hover:text-[#1E3A8A]"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-56 border-[#E2E8F0] shadow-lg">
                          <DropdownMenuLabel className="text-xs text-slate-400 font-normal truncate max-w-[200px]">
                            {user.userName}
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-[#E2E8F0]" />

                          {/* ── Role section ── */}
                          {user.isCordinator ? (
                            <>
                              {/* Change coordinator type submenu */}
                              <DropdownMenuSub>
                                <DropdownMenuSubTrigger
                                  disabled={roleLoadingId === user._id || isRolePending}
                                  className="gap-2 cursor-pointer text-sm"
                                >
                                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                  Change Coordinator Type
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent className="w-52 border-[#E2E8F0] shadow-lg">
                                  <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-slate-400 font-normal">
                                    Select type
                                  </DropdownMenuLabel>
                                  <DropdownMenuSeparator className="bg-[#E2E8F0]" />
                                  {COORDINATOR_TYPES.map(({ value, label, Icon, color, bg }) => (
                                    <DropdownMenuItem
                                      key={value}
                                      onClick={() => handleSetCoordinator(user, value)}
                                      className={`gap-2 cursor-pointer text-sm ${color} ${bg} ${user.coordinatorType === value ? "font-semibold" : ""}`}
                                    >
                                      <Icon className="h-4 w-4 shrink-0" />
                                      {label}
                                      {user.coordinatorType === value && (
                                        <span className="ml-auto text-[10px] bg-current/10 px-1.5 py-0.5 rounded text-current">current</span>
                                      )}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuSubContent>
                              </DropdownMenuSub>

                              {/* Unset coordinator */}
                              <DropdownMenuItem
                                disabled={roleLoadingId === user._id || isRolePending}
                                onClick={() => handleUnsetCoordinator(user)}
                                className="gap-2 cursor-pointer text-amber-700 focus:text-amber-700 focus:bg-amber-50 text-sm"
                              >
                                <ShieldOff className="h-4 w-4 text-amber-500 shrink-0" />
                                {roleLoadingId === user._id ? "Updating…" : "Unset Coordinator"}
                              </DropdownMenuItem>
                            </>
                          ) : (
                            /* Set as coordinator with type submenu */
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger
                                disabled={roleLoadingId === user._id || isRolePending}
                                className="gap-2 cursor-pointer text-sm text-emerald-700 focus:text-emerald-700 focus:bg-emerald-50"
                              >
                                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                {roleLoadingId === user._id ? "Updating…" : "Set as Coordinator"}
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent className="w-52 border-[#E2E8F0] shadow-lg">
                                <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-slate-400 font-normal">
                                  Coordinator type
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-[#E2E8F0]" />
                                {COORDINATOR_TYPES.map(({ value, label, Icon, color, bg }) => (
                                  <DropdownMenuItem
                                    key={value}
                                    onClick={() => handleSetCoordinator(user, value)}
                                    className={`gap-2 cursor-pointer text-sm ${color} ${bg}`}
                                  >
                                    <Icon className="h-4 w-4 shrink-0" />
                                    {label}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                          )}

                          <DropdownMenuSeparator className="bg-[#E2E8F0]" />

                          {/* Delete */}
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive cursor-pointer focus:bg-red-50 gap-2 text-sm"
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
      </CardContent>
    </Card>
  );
}