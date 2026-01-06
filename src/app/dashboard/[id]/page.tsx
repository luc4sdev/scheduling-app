'use client'

import { useState } from "react";
import {
    Search,
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/dashboard/skeleton";
import { AppointmentsTable } from "@/components/dashboard/appointments-table";
import { Appointment } from "@/types/appointment";





const mockAppointments: Appointment[] = [
    { id: "1", date: "22/01/2025 às 16:00", clientName: "Camila Mendes", role: "Cliente", room: "Sala 012", status: "Em análise" },
    { id: "2", date: "21/01/2025 às 16:00", clientName: "Camila Mendes", role: "Cliente", room: "Sala 012", status: "Em análise" },
    { id: "3", date: "20/01/2025 às 16:00", clientName: "Camila Mendes", role: "Cliente", room: "Sala 012", status: "Agendado" },
    { id: "4", date: "19/01/2025 às 16:00", clientName: "Camila Mendes", role: "Cliente", room: "Sala 012", status: "Agendado" },
    { id: "5", date: "19/01/2025 às 16:00", clientName: "Camila Mendes", role: "Cliente", room: "Sala 012", status: "Cancelado" },
    { id: "6", date: "19/01/2025 às 16:00", clientName: "Camila Mendes", role: "Cliente", room: "Sala 012", status: "Cancelado" },
    { id: "7", date: "18/01/2025 às 16:00", clientName: "Camila Mendes", role: "Cliente", room: "Sala 012", status: "Agendado" },
    { id: "8", date: "12/01/2025 às 16:00", clientName: "Camila Mendes", role: "Cliente", room: "Sala 012", status: "Agendado" },
];

export default function Appointments() {
    const [hasData, setHasData] = useState(true);

    return (
        <div className="flex flex-col gap-6">
            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm min-h-150 flex flex-col">

                <div className="p-6 border-b border-zinc-100 flex flex-col md:flex-row gap-4 justify-between items-center">

                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto flex-1">
                        <div className="relative w-full md:max-w-100">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Filtre por nome, CPF / CNPJ ou E-mail"
                                className="w-full h-11 pl-10 pr-4 rounded-md border border-zinc-200 bg-white text-sm outline-none focus:ring-2 focus:ring-zinc-950 placeholder:text-zinc-400"
                            />
                        </div>

                        <button className="flex items-center justify-between w-full md:w-50 h-11 px-3 rounded-md border border-zinc-200 bg-white text-sm text-zinc-500 hover:bg-zinc-50 transition-colors outline-none focus:ring-2 focus:ring-zinc-950">
                            <span>Selecione</span>
                            <CalendarIcon className="w-4 h-4 text-zinc-400" />
                        </button>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <Button className="bg-black text-white hover:bg-zinc-800 h-11 px-6 whitespace-nowrap font-medium w-full md:w-auto">
                            Novo Agendamento
                        </Button>

                        {/* Botão APENAS PARA DESENVOLVIMENTO (Alternar visualização) */}
                        <button
                            onClick={() => setHasData(!hasData)}
                            className="text-[10px] text-zinc-400 border px-2 py-1 rounded hover:bg-zinc-100"
                            title="Alternar estado vazio/cheio"
                        >
                            {hasData ? "Ver Vazio" : "Ver Dados"}
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex flex-col">
                    {!hasData ? (
                        <Skeleton />
                    ) : (
                        <AppointmentsTable data={mockAppointments} />
                    )}
                </div>

                <div className="p-4 border-t border-zinc-100 flex justify-center items-center gap-2">
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


