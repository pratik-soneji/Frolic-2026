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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import {
    School,
    Plus,
    Building2,
    UserCheck,
    UserX,
    Check,
    Search,
    X,
} from "lucide-react";
import {
    useGetDepartments,
    useAddDepartment,
    useGetAllCoordinators,
    useGetInstitutes,
    useUpdateDepartmentCoordinator,
} from "@/api/admin.queries";
import type { AddDepartmentPayload } from "@/api/admin.api";

// ── Types ──────────────────────────────────────────────────────
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
}

interface Department {
    _id: string;
    departmentName: string;
    departmentDescription?: string;
    instituteId?: Institute | null;
    departmentCoOrdinatorId?: Coordinator | null;
    createdAt: string;
}

// ── Helpers ────────────────────────────────────────────────────
function getInitials(name: string) {
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

function getAvatarColor(name: string) {
    const code = name.charCodeAt(0) || 0;
    return avatarColors[code % avatarColors.length];
}

// ── Inline Coordinator Picker (polished) ─────────────────────
function CoordinatorPicker({
    department,
    coordinators,
    isLoading,
}: {
    department: Department;
    coordinators: Coordinator[];
    isLoading: boolean;
}) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const { mutate: assignCoordinator, isPending } = useUpdateDepartmentCoordinator();
    const current = department.departmentCoOrdinatorId;

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
            { departmentid: department._id, departmentCoOrdinatorId: newId },
            { onSuccess: () => { setOpen(false); setSearch(""); } }
        );
    };

    const handleUnassign = () => {
        assignCoordinator(
            { departmentid: department._id, departmentCoOrdinatorId: null },
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
                                No <strong className="font-semibold">Department Coordinators</strong> found.<br />
                                Set a user's role to "Department Coordinator" first.
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

// ── Form Types ─────────────────────────────────────────────────
interface DeptFormData {
    departmentName: string;
    departmentDescription: string;
}

// ── Main Component ─────────────────────────────────────────────
export default function DepartmentTable() {
    const { data: deptsData, isLoading, isError } = useGetDepartments();
    const { data: usersData, isLoading: usersLoading } = useGetAllCoordinators();
    const { data: institutesData, isLoading: institutesLoading } = useGetInstitutes();
    const { mutate: addDepartment, isPending, error: addError } = useAddDepartment();

    const departments: Department[] = deptsData?.data ?? [];
    const allUsers: Coordinator[] = usersData?.data ?? [];
    const departmentCoordinators = allUsers.filter((u) => u.isCordinator && u.coordinatorType === "department");
    const institutes: Institute[] = institutesData?.data ?? [];

    const [open, setOpen] = useState(false);
    const [selectedInstitute, setSelectedInstitute] = useState<string>("");
    const [selectedCoordinator, setSelectedCoordinator] = useState<string>("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<DeptFormData>();

    const onSubmit = (formData: DeptFormData) => {
        if (!selectedInstitute) return;
        const payload: AddDepartmentPayload = {
            departmentName: formData.departmentName,
            departmentDescription: formData.departmentDescription,
            instituteId: selectedInstitute,
            departmentCoOrdinatorId: selectedCoordinator || undefined,
        };
        addDepartment(payload, {
            onSuccess: () => {
                setOpen(false);
                reset();
                setSelectedInstitute("");
                setSelectedCoordinator("");
            },
        });
    };

    const handleDialogOpenChange = (v: boolean) => {
        setOpen(v);
        if (!v) {
            reset();
            setSelectedInstitute("");
            setSelectedCoordinator("");
        }
    };

    return (
        <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-6 py-5 border-b border-border/60">
                <div className="flex items-center gap-3.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/[0.05] border border-border/60">
                        <School className="h-5 w-5 text-foreground/70" />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-foreground tracking-tight">Departments</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Manage departments — click coordinator cell to assign
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs font-semibold rounded-full">
                        {isLoading ? "Loading…" : `${departments.length} departments`}
                    </Badge>

                    {/* ── Add Department Dialog ── */}
                    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="h-9 rounded-lg gap-1.5 font-semibold">
                                <Plus className="h-4 w-4" />
                                Add Department
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-[480px]">
                            <DialogHeader>
                                <div className="flex items-center gap-3 mb-1">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-background">
                                        <School className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <DialogTitle className="text-lg font-bold">Add New Department</DialogTitle>
                                        <DialogDescription className="text-sm">Fill in the details to create a department.</DialogDescription>
                                    </div>
                                </div>
                            </DialogHeader>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-2">
                                {/* Department Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="departmentName" className="text-sm font-semibold">
                                        Department Name <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="departmentName"
                                        {...register("departmentName", { required: "Department name is required" })}
                                        placeholder="e.g. Computer Science"
                                        className="h-11"
                                    />
                                    {errors.departmentName && (
                                        <p className="text-xs text-destructive">{String(errors.departmentName.message)}</p>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="departmentDescription" className="text-sm font-semibold">Description</Label>
                                    <textarea
                                        id="departmentDescription"
                                        {...register("departmentDescription")}
                                        placeholder="Brief description of the department…"
                                        rows={3}
                                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all resize-none"
                                    />
                                </div>

                                {/* Institute Dropdown */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">
                                        <span className="flex items-center gap-1.5">
                                            <Building2 className="h-3.5 w-3.5" />
                                            Institute <span className="text-destructive">*</span>
                                        </span>
                                    </Label>
                                    <Select
                                        value={selectedInstitute}
                                        onValueChange={setSelectedInstitute}
                                        disabled={institutesLoading}
                                    >
                                        <SelectTrigger className="h-11">
                                            <SelectValue placeholder={institutesLoading ? "Loading…" : institutes.length === 0 ? "No institutes found" : "Select an institute"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {institutes.map((inst) => (
                                                <SelectItem key={inst._id} value={inst._id}>
                                                    <div className="flex items-center gap-2">
                                                        <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                                                        <span>{inst.instituteName}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {!selectedInstitute && (
                                        <p className="text-xs text-muted-foreground">Institute is required</p>
                                    )}
                                </div>

                                {/* Coordinator Dropdown */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">
                                        <span className="flex items-center gap-1.5">
                                            <UserCheck className="h-3.5 w-3.5" />
                                            Department Coordinator
                                        </span>
                                    </Label>
                                    <Select
                                        value={selectedCoordinator}
                                        onValueChange={setSelectedCoordinator}
                                        disabled={usersLoading}
                                    >
                                        <SelectTrigger className="h-11">
                                            <SelectValue placeholder={usersLoading ? "Loading…" : departmentCoordinators.length === 0 ? "No dept coordinators available" : "Select a coordinator (optional)"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {departmentCoordinators.map((coord: Coordinator) => (
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
                                            {String((addError as any).response?.data?.message ?? "Failed to add department")}
                                        </p>
                                    </div>
                                )}

                                <DialogFooter className="pt-2 gap-2">
                                    <Button type="button" variant="outline" onClick={() => handleDialogOpenChange(false)}>
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isPending || !selectedInstitute}
                                    >
                                        {isPending ? "Creating…" : "Create Department"}
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
                        <span className="text-sm text-destructive font-medium">Failed to load departments. Please try again.</span>
                    </div>
                )}

                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-border/60 bg-muted/40">
                            <TableHead className="pl-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Department</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Institute</TableHead>
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
                                            <Skeleton className="h-4 w-36" />
                                        </div>
                                    </TableCell>
                                    <TableCell><Skeleton className="h-5 w-24 rounded-full" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-32 rounded-lg" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                </TableRow>
                            ))
                            : departments.length === 0
                                ? (
                                    <TableRow>
                                        <TableCell colSpan={5}>
                                            <div className="flex flex-col items-center justify-center py-16 gap-3">
                                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground/[0.04] border border-border/60">
                                                    <School className="h-7 w-7 text-foreground/30" />
                                                </div>
                                                <p className="text-sm font-medium text-muted-foreground">No departments yet</p>
                                                <p className="text-xs text-muted-foreground/60">Click "Add Department" to register the first one.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                                : departments.map((dept) => (
                                    <TableRow key={dept._id} className="border-border/40 hover:bg-muted/50 transition-colors">
                                        {/* Department Name */}
                                        <TableCell className="pl-6">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-foreground/[0.05] border border-border/60">
                                                    <School className="h-4 w-4 text-foreground/60" />
                                                </div>
                                                <span className="font-semibold text-foreground">{dept.departmentName}</span>
                                            </div>
                                        </TableCell>

                                        {/* Institute Badge */}
                                        <TableCell>
                                            {dept.instituteId ? (
                                                <Badge variant="outline" className="text-xs gap-1 rounded-full">
                                                    <Building2 className="h-3 w-3" />
                                                    {dept.instituteId.instituteName}
                                                </Badge>
                                            ) : (
                                                <span className="text-muted-foreground text-xs italic">—</span>
                                            )}
                                        </TableCell>

                                        {/* Description */}
                                        <TableCell className="text-muted-foreground text-sm max-w-[180px]">
                                            <p className="line-clamp-2">
                                                {dept.departmentDescription || <span className="italic text-muted-foreground/50">—</span>}
                                            </p>
                                        </TableCell>

                                        {/* Coordinator — inline picker */}
                                        <TableCell>
                                            <CoordinatorPicker
                                                department={dept}
                                                coordinators={departmentCoordinators}
                                                isLoading={usersLoading}
                                            />
                                        </TableCell>

                                        {/* Date */}
                                        <TableCell className="text-muted-foreground text-xs">
                                            {new Date(dept.createdAt).toLocaleDateString("en-IN", {
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
