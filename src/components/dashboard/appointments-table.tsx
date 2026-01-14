'use client'

import { Check, X, LoaderCircle } from "lucide-react";
import { AppointmentItem } from "@/types/appointment";
import { useSession } from "next-auth/react";
import { toastMessage } from "@/utils/toast-message";
import { useState } from "react";
import { useMutationHook } from "@/hooks/useMutation";
import { useQueryClient } from "@tanstack/react-query";
import { DataTable, ColumnDef } from "@/components/ui/data-table";
import { sendSchedulingCancellation, sendSchedulingConfirmation } from "@/utils/send-email";
import { CancellationModal } from "./cancellation-modal";

interface AppointmentsTableProps {
    data: AppointmentItem[];
    onSort: () => void;
    page?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
}

interface ScheduleResponse { userEmail: string, userName: string, dateString: string, time: string, status: string, isAdmin: boolean }

export function AppointmentsTable({ data, onSort, page = 1, totalPages = 1, onPageChange = () => { } }: AppointmentsTableProps) {
    const { data: session } = useSession();
    const queryClient = useQueryClient();
    const isAdmin = session?.user?.role === 'ADMIN';

    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [appointmentToCancel, setAppointmentToCancel] = useState<AppointmentItem | null>(null);

    const mutation = useMutationHook<ScheduleResponse, Error, { id: string, status: string }>({
        url: ({ id }) => `/schedules/${id}/status`,
        method: 'PATCH',
        onSuccess: async (data) => {
            const { userEmail, userName, dateString, time, status, isAdmin } = data
            if (status === 'CONFIRMED') {
                try {
                    await sendSchedulingConfirmation(userEmail, userName, dateString, time)
                } catch { }
            }
            else if (status === 'CANCELLED') {
                try {
                    await sendSchedulingCancellation(userEmail, userName, dateString, time, isAdmin)
                } catch { }
            }
            queryClient.invalidateQueries({ queryKey: ['schedules'] });
            toastMessage({ message: "Status atualizado com sucesso!", type: "success" });
            setLoadingId(null);
            setIsCancelModalOpen(false);
            setAppointmentToCancel(null);
        },
        onError: (error) => {
            toastMessage({ message: error.message || "Erro ao atualizar", type: "error" });
            setLoadingId(null);
        }
    });

    function handleUpdateStatus(id: string, newStatus: 'CONFIRMED' | 'CANCELLED') {
        setLoadingId(id);
        mutation.mutate({ id, status: newStatus });
    };

    function openCancelModal(item: AppointmentItem) {
        setAppointmentToCancel(item);
        setIsCancelModalOpen(true);
    }

    function confirmCancellation() {
        if (appointmentToCancel) {
            handleUpdateStatus(appointmentToCancel.id, 'CANCELLED');
        }
    }

    function getStatusBadge(status: string) {
        switch (status) {
            case "CONFIRMED":
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-700 border border-teal-700">
                        Agendado
                    </span>
                );
            case "CANCELLED":
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-500 border border-red-500">
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

    function getStatusTranslate(status: string) {
        switch (status) {
            case 'PENDING':
                return 'Pendente'
            case 'CONFIRMED':
                return 'Confirmado'
            case 'CANCELLED':
                return 'Cancelado'
            default:
                return 'Inválido'
        }
    }

    function getRowColor(status: string) {
        switch (status) {
            case "CONFIRMED": return "bg-teal-50"
            case "CANCELLED": return "bg-red-50";
            default: return "bg-white";
        }
    };

    const columns: ColumnDef<AppointmentItem>[] = [
        {
            header: "Data agendamento",
            accessorKey: 'date',
            exportValue: (item) => `${item.date} às ${item.startTime}h`,
            onSort: onSort,
            cell: (item) => (
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-zinc-900">
                        {item.date}
                    </span>
                    <span className="text-xs text-zinc-500 font-medium mt-0.5">
                        {item.startTime}h - {item.endTime}h
                    </span>
                </div>
            )
        },
        {
            header: "Nome",
            accessorKey: 'clientName',
            cell: (item) => (
                <div className="flex flex-col">
                    <span className="font-medium text-zinc-900">{item.clientName}</span>
                    <span className="text-xs text-zinc-500 capitalize">{item.role}</span>
                </div>
            )
        },
        {
            header: "Sala",
            accessorKey: 'room',
            className: "text-center",
            cell: (item) => (
                <span className="inline-flex items-center px-3 py-2 rounded-full text-xs font-bold bg-zinc-900 text-white">
                    {item.room}
                </span>
            )
        },
        {
            header: "Status",
            accessorKey: 'status',
            exportValue: (item) => getStatusTranslate(item.status),
            className: "text-center",
            cell: (item) => getStatusBadge(item.status)
        },
        {
            header: "Ação",
            className: "text-right",
            cell: (item) => (
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
                                    onClick={() => openCancelModal(item)}
                                    className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-black text-white hover:bg-red-600 transition-colors cursor-pointer"
                                    title="Cancelar Agendamento"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </>
                    )}
                </div>
            )
        }
    ];

    return (
        <>
            <DataTable
                data={data}
                columns={columns}
                getRowClassName={(item) => getRowColor(item.status)}
                pagination={{
                    currentPage: page,
                    totalPages: totalPages,
                    onPageChange: onPageChange
                }}
            />
            <CancellationModal
                appointmentToCancel={appointmentToCancel}
                isCancelModalOpen={isCancelModalOpen}
                confirmCancellation={confirmCancellation}
                setIsCancelModalOpen={setIsCancelModalOpen}
                isAdmin={isAdmin}
                loadingId={loadingId}
            />
        </>
    );
}