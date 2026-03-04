import { useUpdateInstituteCoordinator } from "@/api/admin.queries";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Check, UserCheck, UserX } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
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
    "bg-blue-100 text-blue-700",
    "bg-indigo-100 text-indigo-700",
    "bg-sky-100 text-sky-700",
    "bg-violet-100 text-violet-700",
    "bg-teal-100 text-teal-700",
];
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

export function getAvatarColor(name: string) {
    const code = name.charCodeAt(0) || 0;
    return avatarColors[code % avatarColors.length];
}
export default function CoordinatorPicker({
    institute,
    coordinators,
    isLoading,
}: {
    institute: Institute;
    coordinators: Coordinator[];
    isLoading: boolean;
}) {
    const [open, setOpen] = useState(false);
    const { mutate: assignCoordinator, isPending } = useUpdateInstituteCoordinator();

    const current = institute.instituteCoOrdinatorId;

    const handleSelect = (coordId: string) => {
        // If selecting the same one, unassign; otherwise assign
        const newId = current?._id === coordId ? null : coordId;
        assignCoordinator(
            { instituteid: institute._id, instituteCoOrdinatorId: newId },
            { onSuccess: () => setOpen(false) }
        );
    };

    const handleUnassign = () => {
        assignCoordinator(
            { instituteid: institute._id, instituteCoOrdinatorId: null },
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

            <PopoverContent
                align="start"
                side="bottom"
                className="w-64 p-2 border-[#E2E8F0] shadow-xl"
            >
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
                        No <strong>Institute Coordinators</strong> found. Go to Users and set a user's role to "Institute Coordinator".
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
                    ${isSelected
                                            ? "bg-blue-50 text-[#1E3A8A]"
                                            : "hover:bg-slate-50 text-[#0F172A]"
                                        }`}
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

                {/* Unassign option if currently assigned */}
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