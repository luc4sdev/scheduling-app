'use client'

import { usePathname } from "next/navigation";
import { Header } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const getHeaderInfo = () => {
        if (pathname.includes('/logs')) {
            return {
                title: "Logs do Sistema",
                subtitle: "Acompanhe todos os seus Logs"
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
            subtitle: "Acompanhe todos os seus agendamentos de forma simples"
        };
    };

    const headerInfo = getHeaderInfo();

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