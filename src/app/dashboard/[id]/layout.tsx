'use client'

import { usePathname, useRouter } from "next/navigation";
import { Header } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { Skeleton } from "@/components/dashboard/skeleton";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session, status } = useSession();

    const checkAccess = () => {
        if (status === 'loading' || !session) {
            return { authorized: false, redirect: null };
        }

        const user = session.user;

        if (user.role === 'ADMIN') {
            return { authorized: true, redirect: null };
        }

        const permissions = user.permissions || [];

        if (pathname.includes('/logs')) {
            if (!permissions.includes('LOGS')) {
                return { authorized: false, redirect: `/dashboard/${user.id}` };
            }
        }
        else if (
            !pathname.includes('/users') &&
            !pathname.includes('/profile') &&
            !pathname.includes('/clients') &&
            !pathname.includes('/logs')
        ) {
            if (!permissions.includes('APPOINTMENTS')) {
                return { authorized: false, redirect: `/dashboard/${user.id}/profile` };
            }
        }
        else if (pathname.includes('/users') || pathname.includes('/clients')) {
            return { authorized: false, redirect: `/dashboard/${user.id}` };
        }
        return { authorized: true, redirect: null };
    };

    const access = checkAccess();
    useEffect(() => {
        if (status === 'loading') return;

        if (status === 'unauthenticated') {
            router.replace('/');
            return;
        }

        if (access.redirect) {
            router.replace(access.redirect);
        }
    }, [status, access.redirect, router]);

    const isAdmin = session?.user?.role === 'ADMIN';

    const getHeaderInfo = () => {
        if (pathname.includes('/logs')) {
            return {
                title: "Logs",
                subtitle: isAdmin ? "Acompanhe todos os Logs de clientes" : "Acompanhe todos os seus Logs"
            };
        }
        if (pathname.includes('/users') || pathname.includes('/clients')) {
            return {
                title: "Clientes",
                subtitle: "Overview de todos os clientes"
            };
        }
        if (pathname.includes('/profile')) {
            return {
                title: "Minha Conta",
                subtitle: "Ajuste informações da sua conta de forma simples"
            };
        }
        return {
            title: "Agendamento",
            subtitle: isAdmin ? "Acompanhe todos os agendamentos de clientes de forma simples" : "Acompanhe todos os seus agendamentos de forma simples"
        };
    };

    const headerInfo = getHeaderInfo();

    if (status === 'loading' || !access.authorized) {
        return (
            <div className="min-h-screen flex">
                <Sidebar />
                <div className="ml-64 flex flex-col min-h-screen w-full p-8">
                    <Skeleton className="w-full h-12 mb-8" />
                    <Skeleton className="w-full h-96" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Sidebar />
            <div className="ml-64 flex flex-col min-h-screen">
                <Header
                    title={headerInfo.title}
                    subtitle={headerInfo.subtitle}
                />

                <main className="flex-1 p-8 w-full mx-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}