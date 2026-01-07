import {
    Calendar,
    User,
} from "lucide-react";

export function ModuleBadge({ module }: { module: string }) {
    const Icon = module === "Agendamento" ? Calendar : User;

    return (
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
            <Icon className="w-3 h-3 text-zinc-500" />
            {module}
        </span>
    );
}