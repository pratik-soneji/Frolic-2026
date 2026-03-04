import { useState } from "react";
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
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
    School,
    Plus,
    Building2,
    UserCheck,
    UserX,
    Check,
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
    "bg-blue-100 text-blue-700",
    "bg-indigo-100 text-indigo-700",
    "bg-sky-100 text-sky-700",
    "bg-violet-100 text-violet-700",
    "bg-teal-100 text-teal-700",
];

function getAvatarColor(name: string) {
    const code = name.charCodeAt(0) || 0;
    return avatarColors[code % avatarColors.length];
}

// ── Inline Coordinator Picker ─────────────────────────────────
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
    const { mutate: assignCoordinator, isPending } = useUpdateDepartmentCoordinator();
    const current = department.departmentCoOrdinatorId;

    const handleSelect = (coordId: string) => {
        const newId = current?._id === coordId ? null : coordId;
        assignCoordinator(
            { departmentid: department._id, departmentCoOrdinatorId: newId },
            { onSuccess: () => setOpen(false) }
        );
    };

    const handleUnassign = () => {
        assignCoordinator(
            { departmentid: department._id, departmentCoOrdinatorId: null },
            { onSuccess: () => setOpen(false) }
        );
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-2 px-2 text-slate-500 hover:text-[#1E3A8A] hover:bg-blue-50 transition-all text-xs font-medium"
                    disabled={isPending}
                >
                    {isPending ? (
                        <span className="text-xs text-slate-400">Updating…</span>
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
                            <UserX className="h-3.5 w-3.5 text-slate-400" />
                            <span>Assign</span>
                        </>
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent align="start" side="bottom" className="w-64 p-2 border-[#E2E8F0] shadow-xl">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 px-2 mb-2">
                    Select Coordinator
                </p>

                {isLoading ? (
                    <div className="space-y-2 py-1">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-2 px-2 py-1">
                                <Skeleton className="h-7 w-7 rounded-full" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        ))}
                    </div>
                ) : coordinators.length === 0 ? (
                    <p className="text-xs text-amber-600 px-2 py-2">
                        No <strong>Department Coordinators</strong> found. Go to Users and set a user's role to "Department Coordinator".
                    </p>
                ) : (
                    <div className="space-y-0.5 max-h-56 overflow-y-auto pr-1">
                        {coordinators.map((coord) => {
                            const isSelected = current?._id === coord._id;
                            return (
                                <button
                                    key={coord._id}
                                    onClick={() => handleSelect(coord._id)}
                                    className={`w-full flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors cursor-pointer border-none
                    ${isSelected ? "bg-blue-50 text-[#1E3A8A]" : "hover:bg-slate-50 text-[#0F172A]"}`}
                                >
                                    <Avatar className="h-7 w-7 shrink-0">
                                        <AvatarFallback className={`text-[10px] font-bold ${getAvatarColor(coord.userName)}`}>
                                            {getInitials(coord.userName)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0 leading-tight">
                                        <p className="text-sm font-medium truncate">{coord.userName}</p>
                                        <p className="text-xs text-slate-400 truncate">{coord.email}</p>
                                    </div>
                                    {isSelected && <Check className="h-3.5 w-3.5 text-[#1E3A8A] shrink-0" />}
                                </button>
                            );
                        })}
                    </div>
                )}

                {current && (
                    <>
                        <div className="my-2 h-px bg-[#E2E8F0]" />
                        <button
                            onClick={handleUnassign}
                            className="w-full flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs text-red-500 hover:bg-red-50 transition-colors border-none cursor-pointer"
                        >
                            <UserX className="h-3.5 w-3.5" />
                            Remove coordinator
                        </button>
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
        <Card className="border-[#E2E8F0] shadow-sm bg-white overflow-hidden">
            {/* Blue gradient top bar */}
            <div className="h-1 w-full bg-gradient-to-r from-[#1E3A8A] via-[#4F46E5] to-[#0EA5E9]" />

            <CardHeader className="pb-4 bg-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#4F46E5] shadow-sm">
                            <School className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-bold text-[#0F172A]">Departments</CardTitle>
                            <CardDescription className="text-sm text-slate-500">
                                Manage departments — click coordinator cell to assign
                            </CardDescription>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs font-semibold border-blue-200 text-[#1E3A8A] bg-blue-50">
                            {isLoading ? "Loading…" : `${departments.length} departments`}
                        </Badge>

                        {/* ── Add Department Dialog ── */}
                        <Dialog open={open} onOpenChange={handleDialogOpenChange}>
                            <DialogTrigger asChild>
                                <Button className="h-9 rounded-lg bg-gradient-to-r from-[#1E3A8A] to-[#4F46E5] hover:from-[#1e40af] hover:to-[#4338ca] text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all border-0 gap-1.5">
                                    <Plus className="h-4 w-4" />
                                    Add Department
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-[480px] border-[#E2E8F0] bg-white shadow-2xl">
                                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-lg bg-gradient-to-r from-[#1E3A8A] via-[#4F46E5] to-[#0EA5E9]" />

                                <DialogHeader className="pt-4">
                                    <div className="flex items-center gap-3 mb-1">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#1E3A8A] to-[#4F46E5]">
                                            <School className="h-4 w-4 text-white" />
                                        </div>
                                        <div>
                                            <DialogTitle className="text-lg font-bold text-[#0F172A]">Add New Department</DialogTitle>
                                            <DialogDescription className="text-slate-500 text-sm">Fill in the details to create a department.</DialogDescription>
                                        </div>
                                    </div>
                                </DialogHeader>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-2">
                                    {/* Department Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="departmentName" className="text-sm font-semibold text-[#0F172A]">
                                            Department Name <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="departmentName"
                                            {...register("departmentName", { required: "Department name is required" })}
                                            placeholder="e.g. Computer Science"
                                            className="h-11 border-[#E2E8F0] focus-visible:ring-[#1E3A8A] bg-[#F8FAFC]"
                                        />
                                        {errors.departmentName && (
                                            <p className="text-xs text-red-500">{String(errors.departmentName.message)}</p>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-2">
                                        <Label htmlFor="departmentDescription" className="text-sm font-semibold text-[#0F172A]">Description</Label>
                                        <textarea
                                            id="departmentDescription"
                                            {...register("departmentDescription")}
                                            placeholder="Brief description of the department…"
                                            rows={3}
                                            className="w-full rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent transition-all resize-none"
                                        />
                                    </div>

                                    {/* Institute Dropdown */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-[#0F172A]">
                                            <span className="flex items-center gap-1.5">
                                                <Building2 className="h-3.5 w-3.5 text-[#1E3A8A]" />
                                                Institute <span className="text-red-500">*</span>
                                            </span>
                                        </Label>
                                        <Select
                                            value={selectedInstitute}
                                            onValueChange={setSelectedInstitute}
                                            disabled={institutesLoading}
                                        >
                                            <SelectTrigger className="h-11 border-[#E2E8F0] bg-[#F8FAFC] focus:ring-[#1E3A8A] text-sm">
                                                <SelectValue placeholder={institutesLoading ? "Loading…" : institutes.length === 0 ? "No institutes found" : "Select an institute"} />
                                            </SelectTrigger>
                                            <SelectContent className="border-[#E2E8F0] shadow-lg">
                                                {institutes.map((inst) => (
                                                    <SelectItem key={inst._id} value={inst._id} className="cursor-pointer hover:bg-blue-50">
                                                        <div className="flex items-center gap-2">
                                                            <Building2 className="h-3.5 w-3.5 text-[#1E3A8A]" />
                                                            <span>{inst.instituteName}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {!selectedInstitute && (
                                            <p className="text-xs text-slate-400">Institute is required</p>
                                        )}
                                    </div>

                                    {/* Coordinator Dropdown */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-[#0F172A]">
                                            <span className="flex items-center gap-1.5">
                                                <UserCheck className="h-3.5 w-3.5 text-[#1E3A8A]" />
                                                Department Coordinator
                                            </span>
                                        </Label>
                                        <Select
                                            value={selectedCoordinator}
                                            onValueChange={setSelectedCoordinator}
                                            disabled={usersLoading}
                                        >
                                            <SelectTrigger className="h-11 border-[#E2E8F0] bg-[#F8FAFC] focus:ring-[#1E3A8A] text-sm">
                                                <SelectValue placeholder={usersLoading ? "Loading…" : departmentCoordinators.length === 0 ? "No dept coordinators available" : "Select a coordinator (optional)"} />
                                            </SelectTrigger>
                                            <SelectContent className="border-[#E2E8F0] shadow-lg">
                                                {departmentCoordinators.map((coord: Coordinator) => (
                                                    <SelectItem key={coord._id} value={coord._id} className="cursor-pointer hover:bg-blue-50">
                                                        <div className="flex items-center gap-2.5">
                                                            <Avatar className="h-6 w-6">
                                                                <AvatarFallback className={`text-[10px] font-bold ${getAvatarColor(coord.userName)}`}>
                                                                    {getInitials(coord.userName)}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="leading-tight">
                                                                <p className="text-sm font-medium">{coord.userName}</p>
                                                                <p className="text-xs text-slate-400">{coord.email}</p>
                                                            </div>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {addError && (
                                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                                            <p className="text-sm text-red-600">
                                                {String((addError as any).response?.data?.message ?? "Failed to add department")}
                                            </p>
                                        </div>
                                    )}

                                    <DialogFooter className="pt-2 gap-2">
                                        <Button type="button" variant="outline" onClick={() => handleDialogOpenChange(false)} className="border-[#E2E8F0] text-slate-600 hover:bg-slate-50">
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isPending || !selectedInstitute}
                                            className="bg-gradient-to-r from-[#1E3A8A] to-[#4F46E5] hover:from-[#1e40af] hover:to-[#4338ca] text-white font-semibold shadow-sm border-0"
                                        >
                                            {isPending ? "Creating…" : "Create Department"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                {isError && (
                    <div className="mx-6 mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                        <span className="text-sm text-red-600 font-medium">Failed to load departments. Please try again.</span>
                    </div>
                )}

                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-[#E2E8F0] bg-[#F8FAFC]">
                            <TableHead className="pl-6 font-semibold text-[#0F172A] text-xs uppercase tracking-wide">Department</TableHead>
                            <TableHead className="font-semibold text-[#0F172A] text-xs uppercase tracking-wide">Institute</TableHead>
                            <TableHead className="font-semibold text-[#0F172A] text-xs uppercase tracking-wide">Description</TableHead>
                            <TableHead className="font-semibold text-[#0F172A] text-xs uppercase tracking-wide">
                                Coordinator
                                <span className="ml-1.5 text-[10px] normal-case text-slate-400 font-normal">(click to change)</span>
                            </TableHead>
                            <TableHead className="font-semibold text-[#0F172A] text-xs uppercase tracking-wide">Added</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {isLoading
                            ? Array.from({ length: 4 }).map((_, i) => (
                                <TableRow key={i} className="border-[#E2E8F0]">
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
                                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 border border-blue-100">
                                                    <School className="h-7 w-7 text-[#1E3A8A]" />
                                                </div>
                                                <p className="text-sm font-medium text-slate-500">No departments yet</p>
                                                <p className="text-xs text-slate-400">Click "Add Department" to register the first one.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                                : departments.map((dept) => (
                                    <TableRow key={dept._id} className="border-[#E2E8F0] hover:bg-blue-50/40 transition-colors">
                                        {/* Department Name */}
                                        <TableCell className="pl-6">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#1E3A8A]/10 to-[#4F46E5]/10 border border-blue-100">
                                                    <School className="h-4 w-4 text-[#1E3A8A]" />
                                                </div>
                                                <span className="font-semibold text-[#0F172A]">{dept.departmentName}</span>
                                            </div>
                                        </TableCell>

                                        {/* Institute Badge */}
                                        <TableCell>
                                            {dept.instituteId ? (
                                                <Badge variant="outline" className="border-blue-200 text-[#1E3A8A] bg-blue-50 text-xs gap-1">
                                                    <Building2 className="h-3 w-3" />
                                                    {dept.instituteId.instituteName}
                                                </Badge>
                                            ) : (
                                                <span className="text-slate-400 text-xs italic">—</span>
                                            )}
                                        </TableCell>

                                        {/* Description */}
                                        <TableCell className="text-slate-500 text-sm max-w-[180px]">
                                            <p className="line-clamp-2">
                                                {dept.departmentDescription || <span className="italic text-slate-400">—</span>}
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
                                        <TableCell className="text-slate-400 text-xs">
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
            </CardContent>
        </Card>
    );
}
