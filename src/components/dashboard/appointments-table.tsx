import {
    ArrowUpDown,
    X,
} from "lucide-react";
import { cn } from "@/utils/utis";
import { AppointmentItem } from "@/types/appointment";


interface AppointmentsTableProps {
    data: AppointmentItem[];
    onSort: () => void;
}

export function AppointmentsTable({ data, onSort }: AppointmentsTableProps) {

    const getRowColor = (status: string) => {
        switch (status) {
            case "Agendado": return "bg-teal-200/10";
            case "Cancelado": return "bg-red-200/20";
            default: return "bg-white";
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Agendado":
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-200/20 text-teal-500 border border-teal-500">
                        Agendado
                    </span>
                );
            case "Cancelado":
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-red-500 border border-red-200">
                        Cancelado
                    </span>
                );
            case "Em análise":
            default:
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-zinc-500 border border-zinc-200">
                        Em análise
                    </span>
                );
        }
    };

    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-zinc-500 font-semibold bg-white border-b border-zinc-100">
                    <tr>
                        <th className="px-6 py-4 w-[20%]">
                            <div
                                onClick={onSort}
                                className="flex items-center gap-1 cursor-pointer hover:text-zinc-800">
                                Data agendamento
                                <ArrowUpDown className="w-3 h-3" />
                            </div>
                        </th>
                        <th className="px-6 py-4 w-[25%]">Nome</th>
                        <th className="px-6 py-4 w-[20%] text-center">Sala de agendamento</th>
                        <th className="px-6 py-4 w-[20%] text-center">Status transação</th>
                        <th className="px-6 py-4 w-[15%] text-right">Ação</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100/50">
                    {data.map((item) => (
                        <tr key={item.id} className={cn("transition-colors", getRowColor(item.status))}>

                            <td className="px-6 py-4 text-zinc-600 font-medium">
                                {item.date}
                            </td>

                            <td className="px-6 py-4">
                                <div className="flex flex-col">
                                    <span className="font-semibold text-zinc-900">{item.clientName}</span>
                                    <span className="text-xs text-zinc-500">{item.role}</span>
                                </div>
                            </td>

                            <td className="px-6 py-4 text-center">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-black text-white">
                                    {item.room}
                                </span>
                            </td>

                            <td className="px-6 py-4 text-center">
                                {getStatusBadge(item.status)}
                            </td>

                            <td className="px-6 py-4 text-right">
                                {item.status !== "Cancelado" && (
                                    <button type="button" className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-black text-white hover:bg-zinc-800 transition-colors cursor-pointer">
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}