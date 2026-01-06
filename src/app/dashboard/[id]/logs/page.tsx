'use client'

import { LogsTable } from "@/components/dashboard/logs-table";
import { Skeleton } from "@/components/dashboard/skeleton";
import { LogItem } from "@/types/log";
import {
    Search,
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useState } from "react";


const mockLogs: LogItem[] = [
    { id: "1", activityType: "Criação de agendamento", module: "Agendamento", date: "04/06/2025 às 22:00" },
    { id: "2", activityType: "Login", module: "Minha Conta", date: "04/06/2025 às 21:40" },
    { id: "3", activityType: "Logout", module: "Minha Conta", date: "04/06/2025 às 21:38" },
    { id: "4", activityType: "Cancelamento de agendamento", module: "Agendamento", date: "04/06/2025 às 21:21" },
    { id: "5", activityType: "Atualização de e-mail", module: "Minha Conta", date: "04/06/2025 às 21:00" },
    { id: "6", activityType: "Cancelamento de agendamento", module: "Agendamento", date: "04/06/2025 às 20:41" },
    { id: "7", activityType: "Criação de agendamento", module: "Agendamento", date: "04/06/2025 às 20:33" },
];

export default function Logs() {

    const [hasData, setHasData] = useState(true);


    return (
        <div className="flex flex-col gap-6">
            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm min-h-150 flex flex-col">

                <div className="p-6 border-b border-zinc-100 flex flex-col md:flex-row gap-4 items-center">

                    <div className="relative w-full md:max-w-100">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Filtre por tipo de atividade ou Módulo"
                            className="w-full h-11 pl-10 pr-4 rounded-md border border-zinc-200 bg-white text-sm outline-none focus:ring-2 focus:ring-zinc-950 placeholder:text-zinc-400"
                        />
                    </div>

                    <button className="flex items-center justify-between w-full md:w-50 h-11 px-3 rounded-md border border-zinc-200 bg-white text-sm text-zinc-500 hover:bg-zinc-50 transition-colors outline-none focus:ring-2 focus:ring-zinc-950">
                        <span>Selecione</span>
                        <CalendarIcon className="w-4 h-4 text-zinc-400" />
                    </button>
                </div>
                <div className="flex-1 flex flex-col">
                    {!hasData ? (
                        <Skeleton />
                    ) : (
                        <LogsTable data={mockLogs} />

                    )}
                </div>

                <div className="p-4 border-t border-zinc-100 flex justify-center items-center gap-2 mt-auto">
                    <button className="p-2 rounded-md hover:bg-zinc-100 disabled:opacity-50 text-black">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center bg-black text-white rounded-md text-sm font-medium">
                        1
                    </button>
                    <button className="p-2 rounded-md hover:bg-zinc-100 disabled:opacity-50 text-black">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

