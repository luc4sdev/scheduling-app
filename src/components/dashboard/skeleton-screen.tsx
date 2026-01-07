import { Skeleton } from "@/components/dashboard/skeleton";
import Image from "next/image";

export function ScreenSkeleton() {
    return (
        <div className="min-h-screen flex w-full bg-white">
            <aside className="w-64 h-screen border-r border-zinc-200 bg-zinc-50/50 hidden md:flex flex-col fixed left-0 top-0 z-10">

                <div className="h-20 flex items-center px-8 border-b border-zinc-100/50">
                    <Image
                        src="/logo.svg"
                        alt="Logo"
                        width={32}
                        height={32}
                        className="object-contain opacity-50 grayscale"
                        priority
                    />
                </div>

                <div className="flex-1 py-6 px-4 space-y-4">
                    <div className="flex items-center gap-3 px-3 py-2">
                        <Skeleton className="w-4 h-4 rounded-md" />
                        <Skeleton className="w-24 h-4 rounded-md" />
                    </div>
                    <div className="flex items-center gap-3 px-3 py-2">
                        <Skeleton className="w-4 h-4 rounded-md" />
                        <Skeleton className="w-32 h-4 rounded-md" />
                    </div>
                    <div className="flex items-center gap-3 px-3 py-2">
                        <Skeleton className="w-4 h-4 rounded-md" />
                        <Skeleton className="w-20 h-4 rounded-md" />
                    </div>
                </div>

                <div className="p-4 border-t border-zinc-200">
                    <div className="flex items-center gap-3">
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <div className="flex flex-col gap-1">
                            <Skeleton className="w-24 h-3 rounded-md" />
                            <Skeleton className="w-16 h-2 rounded-md" />
                        </div>
                    </div>
                </div>
            </aside>

            <div className="flex-1 flex items-center justify-center md:ml-64 min-h-screen bg-white">
                <div className="animate-pulse">
                    <Image
                        src="/logo.svg"
                        alt="Logo Grande"
                        width={128}
                        height={128}
                        className="object-contain opacity-20 grayscale"
                        priority
                    />
                </div>
            </div>
        </div>
    );
}