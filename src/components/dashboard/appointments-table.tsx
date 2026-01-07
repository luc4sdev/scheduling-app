'use client'

import { ArrowUpDown, Check, X, LoaderCircle } from "lucide-react";
import { cn } from "@/utils/utis";
import { AppointmentItem } from "@/types/appointment";
import { useSession } from "next-auth/react";
import { toastMessage } from "@/utils/toast-message";
import { useState } from "react";
import { useMutationHook } from "@/hooks/useMutation";
import { useQueryClient } from "@tanstack/react-query";

interface AppointmentsTableProps {
    data: AppointmentItem[];
    onSort: () => void;
}

export function AppointmentsTable({ data, onSort }: AppointmentsTableProps) {
    const { data: session } = useSession();
    const queryClient = useQueryClient();

    const isAdmin = session?.user?.role === 'ADMIN';

    const [loadingId, setLoadingId] = useState<string | null>(null);

    const mutation = useMutationHook<void, Error, { id: string, status: string }>({
        url: ({ id }) => `/schedules/${id}/status`,
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${session?.user?.token}`
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['schedules'] });
            toastMessage({ message: "Status atualizado com sucesso!", type: "success" });
            setLoadingId(null);
        },
        onError: (error) => {
            toastMessage({ message: error.message || "Erro ao atualizar", type: "error" });
            setLoadingId(null);
        }
    });

    const handleUpdateStatus = (id: string, newStatus: 'CONFIRMED' | 'CANCELLED') => {
        setLoadingId(id);
        mutation.mutate({ id, status: newStatus });
    };

    const getRowColor = (status: string) => {
        switch (status) {
            case "CONFIRMED": return "bg-teal-50";
            case "CANCELLED": return "bg-red-50";
            default: return "bg-white";
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "CONFIRMED":
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-700 border border-teal-200">
                        Agendado
                    </span>
                );
            case "CANCELLED":
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-red-500 border border-red-200">
                        Cancelado
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-600 border border-zinc-200">
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
                        <th className="px-6 py-4 cursor-pointer hover:text-zinc-800 transition-colors font-medium" onClick={onSort}>
                            <div className="flex items-center gap-1">
                                Data agendamento <ArrowUpDown className="w-3 h-3" />
                            </div>
                        </th>
                        <th className="px-6 py-4 font-medium">Nome</th>
                        <th className="px-6 py-4 text-center font-medium">Sala</th>
                        <th className="px-6 py-4 text-center font-medium">Status</th>
                        <th className="px-6 py-4 text-right font-medium">Ação</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                    {data.map((item) => (
                        <tr key={item.id} className={cn("transition-colors", getRowColor(item.status))}>

                            <td className="px-6 py-4">
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-zinc-900">
                                        {item.date}
                                    </span>
                                    <span className="text-xs text-zinc-500 font-medium mt-0.5">
                                        {item.startTime}h - {item.endTime}h
                                    </span>
                                </div>
                            </td>

                            <td className="px-6 py-4">
                                <div className="flex flex-col">
                                    <span className="font-medium text-zinc-900">{item.clientName}</span>
                                    <span className="text-xs text-zinc-500 capitalize">{item.role}</span>
                                </div>
                            </td>

                            <td className="px-6 py-4 text-center">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-zinc-900 text-white">
                                    {item.room}
                                </span>
                            </td>

                            <td className="px-6 py-4 text-center">
                                {getStatusBadge(item.status)}
                            </td>

                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">

                                    {loadingId === item.id ? (
                                        <LoaderCircle className="w-5 h-5 animate-spin text-zinc-400" />
                                    ) : (
                                        <>
                                            {item.status === 'PENDING' && isAdmin && (
                                                <button
                                                    onClick={() => handleUpdateStatus(item.id, 'CONFIRMED')}
                                                    className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-black text-white hover:bg-green-600 transition-colors cursor-pointer"
                                                    title="Aprovar Agendamento"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                            )}

                                            {item.status !== 'CANCELLED' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(item.id, 'CANCELLED')}
                                                    className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-black text-white hover:bg-red-600 transition-colors cursor-pointer"
                                                    title="Cancelar Agendamento"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}