import { cn } from "@/utils/utils";

interface PermissionTagProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
}

export function PermissionTag({ label, isActive, onClick }: PermissionTagProps) {
    return (
        <button
            onClick={onClick}
            type="button"
            className={cn(
                "px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 select-none cursor-pointer",
                isActive
                    ? "bg-black text-white border-black hover:bg-zinc-800"
                    : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400"
            )}
        >
            {label}
        </button>
    )
}