import { cn } from "@/utils/utis";

interface HeaderProps {
    title: string;
    subtitle: string;
    className?: string;
}

export function Header({ title, subtitle, className }: HeaderProps) {
    return (
        <header
            className={cn(
                "h-22 w-full flex flex-col justify-center px-8 border-b border-gray-200 bg-white",
                className
            )}
        >
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight leading-none">
                {title}
            </h1>

            {subtitle && (
                <span className="text-sm font-medium text-zinc-900 mt-1">
                    {subtitle}
                </span>
            )}
        </header>
    );
}