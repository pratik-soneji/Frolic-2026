import { useRef, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { UploadCloud, LogOut, Camera, Mail, CheckCircle2, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { useAuthStore } from "@/store/useAuthStore"
import { useUploadAvatar } from "@/api/user.queries"

export default function ProfileMenu({ handleLogout }: any) {
    const user = useAuthStore((s) => s.user)
    const fileRef = useRef<HTMLInputElement>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [open, setOpen] = useState(false)

    const { mutate: uploadAvatar, isPending } = useUploadAvatar()

    const handleFile = (file: File) => {
        const previewUrl = URL.createObjectURL(file)
        setPreview(previewUrl)
    }

    const handleUpload = () => {
        if (!fileRef.current?.files?.[0]) return
        uploadAvatar(fileRef.current.files[0], {
            onSuccess: () => {
                toast.success("Avatar updated!")
                setPreview(null)
            },
            onError: (err: any) => {
                const errorMsg = err.response?.data?.message || err.message || "Upload failed"
                toast.error(`${errorMsg}. Please try again.`)
                setPreview(null)
            },
        })
    }

    const avatarSrc = preview || user?.avatar

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    className="relative flex h-9 w-9 items-center justify-center rounded-full overflow-hidden
                     bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600
                     ring-2 ring-foreground/10 hover:ring-violet-400/50
                     shadow-lg shadow-violet-500/20
                     hover:shadow-xl hover:shadow-violet-500/30
                     hover:scale-105 transition-all duration-300 ease-out"
                >
                    {avatarSrc ? (
                        <img src={avatarSrc} alt="avatar" className="h-full w-full object-cover" />
                    ) : (
                        <span className="text-sm font-bold text-white tracking-tight">
                            {user?.userName?.charAt(0).toUpperCase()}
                        </span>
                    )}
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-background shadow-sm" />
                </button>
            </PopoverTrigger>

            <PopoverContent
                align="end"
                sideOffset={12}
                className="w-72 p-0 border-0 shadow-none bg-transparent"
            >
                {/* Theme-aware glassmorphism card */}
                <div
                    className="relative rounded-2xl overflow-hidden
                     border border-border/60
                     bg-popover/95 backdrop-blur-2xl
                     shadow-[0_24px_64px_rgba(0,0,0,0.15)] dark:shadow-[0_24px_64px_rgba(0,0,0,0.7)]"
                >
                    {/* Top accent gradient */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

                    {/* Header section */}
                    <div className="relative px-5 pt-5 pb-4">
                        {/* Blurred avatar glow */}
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 h-16 w-16 rounded-full bg-violet-500/15 blur-2xl pointer-events-none" />

                        <div className="flex items-center gap-4 relative">
                            {/* Avatar with camera overlay */}
                            <div className="relative group/avatar flex-shrink-0">
                                <Avatar className="h-14 w-14 ring-2 ring-violet-500/30 shadow-lg shadow-violet-500/10">
                                    <AvatarImage src={preview || user?.avatar} className="object-cover" />
                                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-xl font-bold">
                                        {user?.userName?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                {/* Camera overlay on hover */}
                                <button
                                    onClick={() => fileRef.current?.click()}
                                    className="absolute inset-0 flex items-center justify-center rounded-full
                             bg-black/60 backdrop-blur-sm opacity-0 group-hover/avatar:opacity-100
                             transition-opacity duration-200 cursor-pointer"
                                >
                                    <Camera className="h-4 w-4 text-white" />
                                </button>

                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    ref={fileRef}
                                    onChange={(e) => {
                                        if (!e.target.files?.[0]) return
                                        handleFile(e.target.files[0])
                                    }}
                                />
                            </div>

                            {/* User details — theme-aware */}
                            <div className="min-w-0 flex-1">
                                <p className="text-[15px] font-semibold text-foreground truncate leading-tight">
                                    {user?.userName}
                                </p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <Mail className="h-3 w-3 text-muted-foreground/60 flex-shrink-0" />
                                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                                </div>
                                {user?.isAdmin && (
                                    <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full
                                   bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-300 text-[10px] font-semibold tracking-wide">
                                        ✦ Admin
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Upload preview bar */}
                        {preview && (
                            <div className="mt-3 flex items-center gap-2 p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20">
                                <img src={preview} className="h-8 w-8 rounded-lg object-cover ring-1 ring-violet-400/30" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-foreground/70 truncate">New photo selected</p>
                                </div>
                                <button
                                    onClick={handleUpload}
                                    disabled={isPending}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                             bg-violet-600 hover:bg-violet-500 disabled:opacity-60
                             text-white text-xs font-semibold transition-colors"
                                >
                                    {isPending ? (
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                        <CheckCircle2 className="h-3 w-3" />
                                    )}
                                    {isPending ? "Saving…" : "Save"}
                                </button>
                            </div>
                        )}
                    </div>

                    <Separator className="bg-border/60" />

                    {/* Actions — theme-aware */}
                    <div className="p-2">
                        {/* Change photo button */}
                        <button
                            onClick={() => fileRef.current?.click()}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                         text-muted-foreground hover:text-foreground hover:bg-accent
                         transition-all duration-150 group text-left"
                        >
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent group-hover:bg-violet-500/15 transition-colors">
                                <UploadCloud className="h-3.5 w-3.5 text-muted-foreground group-hover:text-violet-500 transition-colors" />
                            </div>
                            <div>
                                <p className="text-[13px] font-medium leading-none">Change photo</p>
                                <p className="text-[11px] text-muted-foreground/60 mt-0.5">Update your profile picture</p>
                            </div>
                        </button>

                        <div className="h-1" />

                        {/* Logout button */}
                        <button
                            onClick={() => { handleLogout(); setOpen(false) }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                         text-muted-foreground hover:text-red-500 hover:bg-red-500/[0.08]
                         transition-all duration-150 group text-left"
                        >
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent group-hover:bg-red-500/10 transition-colors">
                                <LogOut className="h-3.5 w-3.5 text-muted-foreground group-hover:text-red-500 transition-colors" />
                            </div>
                            <div>
                                <p className="text-[13px] font-medium leading-none">Sign out</p>
                                <p className="text-[11px] text-muted-foreground/60 mt-0.5">End your session</p>
                            </div>
                        </button>
                    </div>

                    {/* Bottom accent */}
                    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-border/60 to-transparent" />
                </div>
            </PopoverContent>
        </Popover>
    )
}