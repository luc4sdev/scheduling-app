'use client'

import {
    Calendar,
    ListCheck,
    User,
    ChevronDown,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/utils/utis'
import Image from 'next/image'
import useFetch from '@/hooks/useFetch'
import { useSession } from 'next-auth/react'

const navItems = [
    { label: 'Agendamentos', icon: Calendar, href: '/dashboard/[id]', exact: true },
    { label: 'Logs', icon: ListCheck, href: '/dashboard/[id]/logs', exact: false },
    { label: 'Minha Conta', icon: User, href: '/dashboard/[id]/profile', exact: false },
]

interface Profile {
    id: string;
    name: string;
    email: string;
    role: 'USER' | 'ADMIN';
}

export function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const userId = pathname.split('/')[2] || session?.user?.id || '';

    const isActive = (resolvedHref: string, exact: boolean) => {
        const path = pathname.split('?')[0];
        if (exact) {
            return path === resolvedHref;
        }
        return path.startsWith(resolvedHref);
    }

    const {
        data: fetchData,
        isLoading: loading,
    } = useFetch({
        url: '/api/profile',
        options: {
            method: 'GET',
        },
        cacheKeys: ['profile', userId],
    });

    const profile = fetchData?.user as Profile || {};
    const displayName = profile.name || session?.user?.name || 'Usuário';
    const displayRole = profile.role || 'Cliente';

    return (
        <aside className="w-64 h-screen fixed top-0 left-0 bg-[#F5F4F2] border-r border-gray-200 flex flex-col">

            <div className="h-20 flex items-center px-6">
                <div className="w-10 h-10 relative">
                    <Image
                        src='/logo.svg'
                        alt='Logo'
                        width={40}
                        height={40}
                        className="object-contain"
                    />
                </div>
            </div>

            <nav className="flex flex-col gap-2 px-4 mt-4">
                {navItems.map(({ label, icon: Icon, href, exact }) => {
                    const resolvedHref = href.replace('[id]', userId);
                    const active = isActive(resolvedHref, exact);

                    return (
                        <Link
                            key={href}
                            href={resolvedHref}
                            className={cn(
                                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                                active
                                    ? 'bg-black text-white shadow-sm'
                                    : 'text-zinc-700 hover:bg-zinc-200/50'
                            )}
                        >
                            <Icon className={cn("w-5 h-5", active ? "text-white" : "text-zinc-900")} />
                            {label}
                        </Link>
                    )
                })}
            </nav>

            <div className="mt-auto p-4 border-t border-gray-200/60">
                <div className="flex items-center justify-between p-2 rounded-md hover:bg-zinc-200/50 cursor-pointer transition-colors group">
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-zinc-900 leading-tight">
                            {loading ? <div className="h-4 w-24 bg-zinc-200 animate-pulse rounded" /> : displayName}
                        </span>
                        <span className="text-xs text-zinc-500 mt-0.5">
                            {displayRole}
                        </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
                </div>
            </div>
        </aside>
    )
}