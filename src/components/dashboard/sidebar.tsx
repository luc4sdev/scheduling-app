'use client'

import { useState } from 'react'
import {
    Calendar,
    ListCheck,
    User as UserIcon,
    ChevronDown,
    LogOut
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/utils/utis'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import useFetch from '@/hooks/useFetch'
import { User } from '@/types/user'

const navItems = [
    { label: 'Agendamentos', icon: Calendar, href: '/dashboard/[id]', exact: true },
    { label: 'Logs', icon: ListCheck, href: '/dashboard/[id]/logs', exact: false },
    { label: 'Minha Conta', icon: UserIcon, href: '/dashboard/[id]/profile', exact: false },
]

export function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const userId = pathname.split('/')[2] || session?.user?.id || '';

    const isActive = (resolvedHref: string, exact: boolean) => {
        const path = pathname.split('?')[0];
        if (exact) {
            return path === resolvedHref;
        }
        return path.startsWith(resolvedHref);
    }

    const {
        data: userData,
    } = useFetch({
        url: '/users/' + userId,
        options: {
            method: 'GET',
        },
        cacheKeys: ['profile'],
    });
    const profile = userData as User || {};
    const displayName = profile.name || 'Cliente';
    const displayRole = profile.role === 'ADMIN' ? 'Admin' : 'Cliente';

    const handleSignOut = async () => {
        await signOut({
            callbackUrl: '/signin',
            redirect: true
        });
    };

    return (
        <aside className="w-64 h-screen fixed top-0 left-0 bg-[#F5F4F2] border-r border-gray-200 flex flex-col z-50">

            <div className="h-22 flex items-center px-6 border-b border-gray-200">
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

            <nav className="flex flex-col gap-2 px-4 mt-8">
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

            <div className="mt-auto p-4 border-t border-gray-200/60 relative">

                {isMenuOpen && (
                    <div className="absolute bottom-full left-4 right-4 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-1 animate-in slide-in-from-bottom-2 fade-in duration-200">
                        <button
                            onClick={handleSignOut}
                            type='button'
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                        >
                            <LogOut className="w-4 h-4" />
                            Sair da conta
                        </button>
                    </div>
                )}

                <div
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className={cn(
                        "flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors group select-none",
                        isMenuOpen ? "bg-zinc-200/50" : "hover:bg-zinc-200/50"
                    )}
                >
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-zinc-900 leading-tight">
                            {displayName}
                        </span>
                        <span className="text-xs text-zinc-500 mt-0.5">
                            {displayRole}
                        </span>
                    </div>
                    <ChevronDown
                        className={cn(
                            "w-4 h-4 text-zinc-400 group-hover:text-zinc-600 transition-transform duration-200",
                            isMenuOpen && "rotate-180"
                        )}
                    />
                </div>
            </div>
        </aside>
    )
}