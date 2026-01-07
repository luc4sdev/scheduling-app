import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

type SkeletonProps = ComponentProps<"div">

export function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div className={twMerge("flex-1 flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-500", className)} {...props}>
            <div className="w-48 h-48 bg-zinc-50 rounded-full flex items-center justify-center mb-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-50/50 rounded-full" />
                <div className="relative z-10 opacity-20">
                    <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-600">
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                        <line x1="3" x2="21" y1="9" y2="9" />
                        <line x1="9" x2="9" y1="21" y2="9" />
                    </svg>
                </div>
            </div>
            <h3 className="text-lg font-semibold text-zinc-900">
                Nada por aqui ainda...
            </h3>
        </div>
    )
}