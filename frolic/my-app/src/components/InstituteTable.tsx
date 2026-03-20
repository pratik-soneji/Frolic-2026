import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { Building2, Plus, UserCheck, UserX, Search, X, Check } from "lucide-react";
import {
    useGetInstitutes,
    useAddInstitute,
    useGetAllCoordinators,
    useUpdateInstituteCoordinator,
} from "@/api/admin.queries";
import type { AddInstitutePayload } from "@/api/admin.api";

// ── Types ──────────────────────────────────────────────────
interface Coordinator {
    _id: string;
    userName: string;
    email: string;
    isCordinator?: boolean;
    coordinatorType?: string | null;
}

interface Institute {
    _id: string;
    instituteName: string;
    instituteDescription?: string;
    instituteCoOrdinatorId?: Coordinator | null;
    createdAt: string;
}

// ── Helpers ────────────────────────────────────────────────
export function getInitials(name: string) {
    return name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

const avatarColors = [
    "bg-blue-500/15 text-blue-600 dark:text-blue-400",
    "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400",
    "bg-sky-500/15 text-sky-600 dark:text-sky-400",
    "bg-violet-500/15 text-violet-600 dark:text-violet-400",
    "bg-teal-500/15 text-teal-600 dark:text-teal-400",
];

export function getAvatarColor(name: string) {
    const code = name.charCodeAt(0) || 0;
    return avatarColors[code % avatarColors.length];
}

// ── Inline Coordinator Picker ──────────────────────────────
function CoordinatorPickerInstitute({
    institute,
    coordinators,
    isLoading,
}: {
    institute: Institute;
    coordinators: Coordinator[];
    isLoading: boolean;
}) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const { mutate: assignCoordinator, isPending } = useUpdateInstituteCoordinator();

    const current = institute.instituteCoOrdinatorId;

    const filtered = useMemo(() =>
        coordinators.filter((c) =>
            c.userName.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase())
        ),
        [coordinators, search]
    );

    const handleSelect = (coordId: string) => {
        const newId = current?._id === coordId ? null : coordId;
        assignCoordinator(
            { instituteid: institute._id, instituteCoOrdinatorId: newId },
            { onSuccess: () => { setOpen(false); setSearch(""); } }
        );
    };

    const handleUnassign = () => {
        assignCoordinator(
            { instituteid: institute._id, instituteCoOrdinatorId: null },
            { onSuccess: () => { setOpen(false); setSearch(""); } }
        );
    };

    return (
        <Popover open={open} onOpenChange={(v) => { setOpen(v); if (!v) setSearch(""); }}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-2 px-2.5 text-xs font-medium transition-all rounded-lg text-foreground/50 hover:text-foreground hover:bg-foreground/[0.06]"
                    disabled={isPending}
                >
                    {isPending ? (
                        <span className="text-xs text-foreground/30">Updating…</span>
                    ) : current ? (
                        <>
                            <Avatar className="h-5 w-5">
                                <AvatarFallback className={`text-[9px] font-bold ${getAvatarColor(current.userName)}`}>
                                    {getInitials(current.userName)}
                                </AvatarFallback>
                            </Avatar>
                            <span className="max-w-[90px] truncate">{current.userName}</span>
                            <UserCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        </>
                    ) : (
                        <>
                            <UserX className="h-3.5 w-3.5 text-foreground/30" />
                            <span>Assign</span>
                        </>
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent
                align="start"
                side="bottom"
                className="w-72 p-0 overflow-hidden rounded-xl border border-border/60 bg-popover"
                style={{ boxShadow: "0 16px 48px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.04)" }}
            >
                {/* Header + Search */}
                <div className="px-3 pt-3 pb-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/35 mb-2">
                        Assign Coordinator
                    </p>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground/30 pointer-events-none" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search coordinators…"
                            className="w-full h-8 pl-8 pr-7 text-xs rounded-lg border border-border/60
                                bg-background text-foreground placeholder:text-foreground/30
                                focus:outline-none focus:ring-1 focus:ring-ring/40 transition-all"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground/60 transition-colors border-none bg-transparent cursor-pointer p-0"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        )}
                    </div>
                </div>

                {/* List */}
                <div className="pb-2">
                    {isLoading ? (
                        <div className="space-y-1 px-2 py-1">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-2.5 px-2 py-2">
                                    <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                                    <div className="space-y-1.5 flex-1">
                                        <Skeleton className="h-3 w-24" />
                                        <Skeleton className="h-2.5 w-32" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : coordinators.length === 0 ? (
                        <div className="px-4 py-5 text-center">
                            <UserX className="h-8 w-8 mx-auto mb-2 text-foreground/15" />
                            <p className="text-xs text-foreground/40 leading-relaxed">
                                No <strong className="font-semibold">Institute Coordinators</strong> found.<br />
                                Set a user's role to "Institute Coordinator" first.
                            </p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="px-4 py-4 text-center">
                            <p className="text-xs text-foreground/40">No results for "{search}"</p>
                        </div>
                    ) : (
                        <ScrollArea className="max-h-52">
                            <div className="space-y-0.5 px-2">
                                {filtered.map((coord) => {
                                    const isSelected = current?._id === coord._id;
                                    return (
                                        <button
                                            key={coord._id}
                                            onClick={() => handleSelect(coord._id)}
                                            className={`w-full flex items-center gap-2.5 rounded-lg px-2 py-2 text-left
                                                transition-all duration-150 cursor-pointer border-none outline-none
                                                ${isSelected
                                                    ? "bg-foreground/[0.07] text-foreground ring-1 ring-foreground/10"
                                                    : "text-foreground/70 hover:text-foreground hover:bg-foreground/[0.05]"
                                                }`}
                                        >
                                            <Avatar className={`h-8 w-8 shrink-0 ${isSelected ? "ring-2 ring-foreground/15" : ""}`}>
                                                <AvatarFallback className={`text-[10px] font-bold ${getAvatarColor(coord.userName)}`}>
                                                    {getInitials(coord.userName)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0 leading-tight">
                                                <p className={`text-[13px] font-medium truncate ${isSelected ? "text-foreground" : ""}`}>
                                                    {coord.userName}
                                                </p>
                                                <p className="text-[11px] text-foreground/40 truncate">{coord.email}</p>
                                            </div>
                                            {isSelected && (
                                                <div className="shrink-0 h-5 w-5 flex items-center justify-center rounded-full bg-emerald-500/15">
                                                    <Check className="h-3 w-3 text-emerald-500" />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </ScrollArea>
                    )}
                </div>

                {/* Unassign */}
                {current && !isLoading && (
                    <>
                        <Separator className="bg-border/50" />
                        <div className="p-2">
                            <button
                                onClick={handleUnassign}
                                className="w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-left
                                    text-red-500 hover:bg-red-500/[0.08] transition-colors border-none cursor-pointer text-xs font-medium"
                            >
                                <div className="h-5 w-5 flex items-center justify-center rounded-full bg-red-500/10">
                                    <UserX className="h-3 w-3 text-red-500" />
                                </div>
                                Remove coordinator
                            </button>
                        </div>
                    </>
                )}
            </PopoverContent>
        </Popover>
    );
}

// ── Form Types ─────────────────────────────────────────────
interface InstituteFormData {
    instituteName: string;
    instituteDescription: string;
}

// ── Main Component ─────────────────────────────────────────
export default function InstituteTable() {
    const { data: institutesData, isLoading, isError } = useGetInstitutes();
    const { data: usersData, isLoading: usersLoading } = useGetAllCoordinators();
    const { mutate: addInstitute, isPending, error: addError } = useAddInstitute();

    const institutes: Institute[] = institutesData?.data ?? [];
    const allUsers: Coordinator[] = usersData?.data ?? [];
    const coordinators = allUsers.filter((u) => u.isCordinator && u.coordinatorType === "institute");

    const [open, setOpen] = useState(false);
    const [selectedCoordinator, setSelectedCoordinator] = useState<string>("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<InstituteFormData>();

    const onSubmit = (formData: InstituteFormData) => {
        const payload: AddInstitutePayload = {
            instituteName: formData.instituteName,
            instituteDescription: formData.instituteDescription,
            instituteCoOrdinatorId: selectedCoordinator || undefined,
        };
        addInstitute(payload, {
            onSuccess: () => {
                setOpen(false);
                reset();
                setSelectedCoordinator("");
            },
        });
    };

    const handleDialogOpenChange = (v: boolean) => {
        setOpen(v);
        if (!v) {
            reset();
            setSelectedCoordinator("");
        }
    };

    return (
        <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-6 py-5 border-b border-border/60">
                <div className="flex items-center gap-3.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/[0.05] border border-border/60">
                        <Building2 className="h-5 w-5 text-foreground/70" />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-foreground tracking-tight">Institutes</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Manage institutes — click coordinator cell to assign
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs font-semibold rounded-full">
                        {isLoading ? "Loading…" : `${institutes.length} institutes`}
                    </Badge>

                    {/* ── Add Institute Dialog ── */}
                    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="h-9 rounded-lg gap-1.5 font-semibold">
                                <Plus className="h-4 w-4" />
                                Add Institute
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-[480px]">
                            <DialogHeader>
                                <div className="flex items-center gap-3 mb-1">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-background">
                                        <Building2 className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <DialogTitle className="text-lg font-bold">Add New Institute</DialogTitle>
                                        <DialogDescription className="text-sm">Fill in the details to register an institute.</DialogDescription>
                                    </div>
                                </div>
                            </DialogHeader>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-2">
                                {/* Institute Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="instituteName" className="text-sm font-semibold">
                                        Institute Name <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="instituteName"
                                        {...register("instituteName", { required: "Institute name is required" })}
                                        placeholder="e.g. Darshan University – Rajkot"
                                        className="h-11"
                                    />
                                    {errors.instituteName && (
                                        <p className="text-xs text-destructive">{String(errors.instituteName.message)}</p>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="instituteDescription" className="text-sm font-semibold">Description</Label>
                                    <textarea
                                        id="instituteDescription"
                                        {...register("instituteDescription")}
                                        placeholder="Brief description of the institute…"
                                        rows={3}
                                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all resize-none"
                                    />
                                </div>

                                {/* Coordinator Dropdown */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">
                                        <span className="flex items-center gap-1.5">
                                            <UserCheck className="h-3.5 w-3.5" />
                                            Institute Coordinator
                                        </span>
                                    </Label>
                                    <Select value={selectedCoordinator} onValueChange={setSelectedCoordinator} disabled={usersLoading}>
                                        <SelectTrigger className="h-11">
                                            <SelectValue placeholder={usersLoading ? "Loading…" : coordinators.length === 0 ? "No coordinators available" : "Select a coordinator (optional)"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {coordinators.map((coord) => (
                                                <SelectItem key={coord._id} value={coord._id}>
                                                    <div className="flex items-center gap-2.5">
                                                        <Avatar className="h-6 w-6">
                                                            <AvatarFallback className={`text-[10px] font-bold ${getAvatarColor(coord.userName)}`}>
                                                                {getInitials(coord.userName)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="leading-tight">
                                                            <p className="text-sm font-medium">{coord.userName}</p>
                                                            <p className="text-xs text-muted-foreground">{coord.email}</p>
                                                        </div>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {addError && (
                                    <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3">
                                        <p className="text-sm text-destructive">
                                            {String((addError as any).response?.data?.message ?? "Failed to add institute")}
                                        </p>
                                    </div>
                                )}

                                <DialogFooter className="pt-2 gap-2">
                                    <Button type="button" variant="outline" onClick={() => handleDialogOpenChange(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isPending}>
                                        {isPending ? "Creating…" : "Create Institute"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="p-0">
                {isError && (
                    <div className="mx-6 mb-4 mt-4 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3">
                        <span className="text-sm text-destructive font-medium">Failed to load institutes. Please try again.</span>
                    </div>
                )}

                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-border/60 bg-muted/40">
                            <TableHead className="pl-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Institute</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Description</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                Coordinator
                                <span className="ml-1.5 text-[9px] normal-case text-muted-foreground/60 font-normal">(click to change)</span>
                            </TableHead>
                            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Added</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {isLoading
                            ? Array.from({ length: 4 }).map((_, i) => (
                                <TableRow key={i} className="border-border/40">
                                    <TableCell className="pl-6">
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="h-8 w-8 rounded-lg" />
                                            <Skeleton className="h-4 w-40" />
                                        </div>
                                    </TableCell>
                                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-32 rounded-lg" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                </TableRow>
                            ))
                            : institutes.length === 0
                                ? (
                                    <TableRow>
                                        <TableCell colSpan={4}>
                                            <div className="flex flex-col items-center justify-center py-16 gap-3">
                                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground/[0.04] border border-border/60">
                                                    <Building2 className="h-7 w-7 text-foreground/30" />
                                                </div>
                                                <p className="text-sm font-medium text-muted-foreground">No institutes yet</p>
                                                <p className="text-xs text-muted-foreground/60">Click "Add Institute" to register the first one.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                                : institutes.map((inst) => (
                                    <TableRow key={inst._id} className="border-border/40 hover:bg-muted/50 transition-colors">
                                        {/* Name */}
                                        <TableCell className="pl-6">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-foreground/[0.05] border border-border/60">
                                                    <Building2 className="h-4 w-4 text-foreground/60" />
                                                </div>
                                                <span className="font-semibold text-foreground">{inst.instituteName}</span>
                                            </div>
                                        </TableCell>

                                        {/* Description */}
                                        <TableCell className="text-muted-foreground text-sm max-w-[200px]">
                                            <p className="line-clamp-2">
                                                {inst.instituteDescription || <span className="italic text-muted-foreground/50">—</span>}
                                            </p>
                                        </TableCell>

                                        {/* Coordinator — inline picker */}
                                        <TableCell>
                                            <CoordinatorPickerInstitute
                                                institute={inst}
                                                coordinators={coordinators}
                                                isLoading={usersLoading}
                                            />
                                        </TableCell>

                                        {/* Date */}
                                        <TableCell className="text-muted-foreground text-xs">
                                            {new Date(inst.createdAt).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </TableCell>
                                    </TableRow>
                                ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
