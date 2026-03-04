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
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { Building2, Plus, UserCheck } from "lucide-react";
import {
    useGetInstitutes,
    useAddInstitute,
    useGetAllCoordinators,
} from "@/api/admin.queries";
import type { AddInstitutePayload } from "@/api/admin.api";
import CoordinatorPicker, { getAvatarColor, getInitials } from "./CordinatorPicker";

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
        <Card className="border-[#E2E8F0] shadow-sm bg-white overflow-hidden">
            {/* Blue gradient top bar */}
            <div className="h-1 w-full bg-gradient-to-r from-[#1E3A8A] via-[#4F46E5] to-[#0EA5E9]" />

            <CardHeader className="pb-4 bg-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#4F46E5] shadow-sm">
                            <Building2 className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-bold text-[#0F172A]">Institutes</CardTitle>
                            <CardDescription className="text-sm text-slate-500">
                                Manage institutes — click coordinator cell to assign
                            </CardDescription>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs font-semibold border-blue-200 text-[#1E3A8A] bg-blue-50">
                            {isLoading ? "Loading…" : `${institutes.length} institutes`}
                        </Badge>
 
                        {/* ── Add Institute Dialog ── */}
                        <Dialog open={open} onOpenChange={handleDialogOpenChange}>
                            <DialogTrigger asChild>
                                <Button className="h-9 rounded-lg bg-gradient-to-r from-[#1E3A8A] to-[#4F46E5] hover:from-[#1e40af] hover:to-[#4338ca] text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all border-0 gap-1.5">
                                    <Plus className="h-4 w-4" />
                                    Add Institute
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-[480px] border-[#E2E8F0] bg-white shadow-2xl">
                                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-lg bg-gradient-to-r from-[#1E3A8A] via-[#4F46E5] to-[#0EA5E9]" />

                                <DialogHeader className="pt-4">
                                    <div className="flex items-center gap-3 mb-1">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#1E3A8A] to-[#4F46E5]">
                                            <Building2 className="h-4 w-4 text-white" />
                                        </div>
                                        <div>
                                            <DialogTitle className="text-lg font-bold text-[#0F172A]">Add New Institute</DialogTitle>
                                            <DialogDescription className="text-slate-500 text-sm">Fill in the details to register an institute.</DialogDescription>
                                        </div>
                                    </div>
                                </DialogHeader>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-2">
                                    {/* Institute Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="instituteName" className="text-sm font-semibold text-[#0F172A]">
                                            Institute Name <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="instituteName"
                                            {...register("instituteName", { required: "Institute name is required" })}
                                            placeholder="e.g. Darshan University – Rajkot"
                                            className="h-11 border-[#E2E8F0] focus-visible:ring-[#1E3A8A] bg-[#F8FAFC]"
                                        />
                                        {errors.instituteName && (
                                            <p className="text-xs text-red-500">{String(errors.instituteName.message)}</p>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-2">
                                        <Label htmlFor="instituteDescription" className="text-sm font-semibold text-[#0F172A]">Description</Label>
                                        <textarea
                                            id="instituteDescription"
                                            {...register("instituteDescription")}
                                            placeholder="Brief description of the institute…"
                                            rows={3}
                                            className="w-full rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent transition-all resize-none"
                                        />
                                    </div>

                                    {/* Coordinator Dropdown */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-[#0F172A]">
                                            <span className="flex items-center gap-1.5">
                                                <UserCheck className="h-3.5 w-3.5 text-[#1E3A8A]" />
                                                Institute Coordinator
                                            </span>
                                        </Label>
                                        <Select value={selectedCoordinator} onValueChange={setSelectedCoordinator} disabled={usersLoading}>
                                            <SelectTrigger className="h-11 border-[#E2E8F0] bg-[#F8FAFC] focus:ring-[#1E3A8A] text-sm">
                                                <SelectValue placeholder={usersLoading ? "Loading…" : coordinators.length === 0 ? "No coordinators available" : "Select a coordinator (optional)"} />
                                            </SelectTrigger>
                                            <SelectContent className="border-[#E2E8F0] shadow-lg">
                                                {coordinators.map((coord) => (
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
                                                {String((addError as any).response?.data?.message ?? "Failed to add institute")}
                                            </p>
                                        </div>
                                    )}

                                    <DialogFooter className="pt-2 gap-2">
                                        <Button type="button" variant="outline" onClick={() => handleDialogOpenChange(false)} className="border-[#E2E8F0] text-slate-600 hover:bg-slate-50">
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={isPending} className="bg-gradient-to-r from-[#1E3A8A] to-[#4F46E5] hover:from-[#1e40af] hover:to-[#4338ca] text-white font-semibold shadow-sm border-0">
                                            {isPending ? "Creating…" : "Create Institute"}
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
                        <span className="text-sm text-red-600 font-medium">Failed to load institutes. Please try again.</span>
                    </div>
                )}

                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-[#E2E8F0] bg-[#F8FAFC]">
                            <TableHead className="pl-6 font-semibold text-[#0F172A] text-xs uppercase tracking-wide">Institute</TableHead>
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
                                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 border border-blue-100">
                                                    <Building2 className="h-7 w-7 text-[#1E3A8A]" />
                                                </div>
                                                <p className="text-sm font-medium text-slate-500">No institutes yet</p>
                                                <p className="text-xs text-slate-400">Click "Add Institute" to register the first one.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                                : institutes.map((inst) => (
                                    <TableRow key={inst._id} className="border-[#E2E8F0] hover:bg-blue-50/40 transition-colors">
                                        {/* Name */}
                                        <TableCell className="pl-6">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#1E3A8A]/10 to-[#4F46E5]/10 border border-blue-100">
                                                    <Building2 className="h-4 w-4 text-[#1E3A8A]" />
                                                </div>
                                                <span className="font-semibold text-[#0F172A]">{inst.instituteName}</span>
                                            </div>
                                        </TableCell>

                                        {/* Description */}
                                        <TableCell className="text-slate-500 text-sm max-w-[200px]">
                                            <p className="line-clamp-2">
                                                {inst.instituteDescription || <span className="italic text-slate-400">—</span>}
                                            </p>
                                        </TableCell>

                                        {/* Coordinator — inline picker */}
                                        <TableCell>
                                            <CoordinatorPicker
                                                institute={inst}
                                                coordinators={coordinators}
                                                isLoading={usersLoading}
                                            />
                                        </TableCell>

                                        {/* Date */}
                                        <TableCell className="text-slate-400 text-xs">
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
            </CardContent>
        </Card>
    );
}
