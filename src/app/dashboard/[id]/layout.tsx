'use client'

import { usePathname } from "next/navigation";
import { Header } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { useSession } from "next-auth/react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { data: session } = useSession();

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
            title: "Agendamentos",
            subtitle: isAdmin ? "Acompanhe todos os agendamentos de clientes de forma simples" : "Acompanhe todos os seus agendamentos de forma simples"
        };
    };

    const headerInfo = getHeaderInfo();

    return (
        <div className="min-h-screen">
            <Sidebar />
            <div className="md:ml-64 flex flex-col min-h-screen">
                <Header
                    title={headerInfo.title}
                    subtitle={headerInfo.subtitle}
                />

                <main className="flex-1 p-8 w-full mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}