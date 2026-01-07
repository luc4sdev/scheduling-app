'use client'

import { useState } from "react";
import {
    Search,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/dashboard/skeleton";
import { AppointmentsTable } from "@/components/dashboard/appointments-table";
import { AppointmentItem, AppointmentApiResponse } from "@/types/appointment";
import useFetch from "@/hooks/useFetch";
import { formatDateNative } from "@/utils/format-date";
import { ScheduleSettingsModal } from "@/components/dashboard/schedule-settings-modal";
import { useSession } from "next-auth/react";
import { UserAppointmentModal } from "@/components/dashboard/user-appointment-modal";


export default function Appointments() {
    const { data: session } = useSession();
    const isAdmin = session?.user.role === 'ADMIN';
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);


    const { data: fetchResponse, isLoading } = useFetch({
        url: `/schedules?page=${page}&limit=8&query=${search}&date=${dateFilter}&order=${sortOrder}`,
        options: {
            method: 'GET',
        },
        cacheKeys: ['schedules', page, search, dateFilter, sortOrder],
    });

    const appointments: AppointmentItem[] = fetchResponse?.data?.map((item: AppointmentApiResponse) => ({
        id: item.id,
        date: formatDateNative(item.date),
        startTime: item.startTime,
        endTime: item.endTime,
        clientName: item.user ? `${item.user.name} ${item.user.lastName}` : 'Usuário desconhecido',
        role: item.user?.role === 'ADMIN' ? 'Admin' : 'Cliente',
        room: item.room?.name || 'Sala removida',
        status: item.status
    })) || [];

    const totalPages = fetchResponse?.totalPages || 1;

    const handlePreviousPage = () => {
        if (page > 1) setPage((prev) => prev - 1);
    };

    const handleNextPage = () => {
        if (page < totalPages) setPage((prev) => prev + 1);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDateFilter(e.target.value);
        setPage(1);
    };

    const toggleSort = () => {
        setSortOrder(prev => prev === 'DESC' ? 'ASC' : 'DESC');
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm min-h-190 flex flex-col">

                <div className="p-6 border-b border-zinc-100 flex flex-col md:flex-row gap-4 justify-between items-center">

                    <div className="flex flex-col md:flex-row gap-4 w-full flex-1">
                        <div className="relative w-full md:max-w-100">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Filtre por nome"
                                value={search}
                                onChange={handleSearch}
                                className="w-full h-11 pl-10 pr-4 rounded-md border border-zinc-200 bg-white text-sm outline-none focus:ring-2 focus:ring-zinc-950 placeholder:text-zinc-400 transition-all"
                            />
                        </div>

                        <div className="relative w-full md:w-50 h-11">
                            <input
                                type="date"
                                value={dateFilter}
                                onChange={handleDateChange}
                                className="w-full h-full px-3 rounded-md border border-zinc-200 text-sm text-zinc-500 hover:bg-zinc-50 transition-colors outline-none focus:ring-2 focus:ring-zinc-950 appearance-none z-10 relative bg-transparent"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 w-1/7">
                        <Button onClick={() => setIsSettingsOpen(true)} className="bg-black text-white hover:bg-zinc-800 h-11 px-6 whitespace-nowrap font-medium w-full">
                            {isAdmin ? 'Configurações' : 'Novo Agendamento'}
                        </Button>
                    </div>
                </div>

                <div className="flex-1 flex flex-col">
                    {isLoading ? (
                        <div className="p-6">
                            <Skeleton />
                        </div>
                    ) : appointments.length > 0 ? (
                        <AppointmentsTable data={appointments} onSort={toggleSort} />
                    ) : (
                        <div className="p-6">
                            <Skeleton />
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-zinc-100 flex justify-center items-center gap-2 mt-auto">
                    <button
                        onClick={handlePreviousPage}
                        disabled={page === 1 || isLoading}
                        className="p-2 rounded-md hover:bg-zinc-100 disabled:opacity-50 text-black transition-colors cursor-pointer"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    <span className="w-8 h-8 flex items-center justify-center bg-black text-white rounded-md text-sm font-medium">
                        {page}
                    </span>

                    <button
                        onClick={handleNextPage}
                        disabled={page >= totalPages || isLoading}
                        className="p-2 rounded-md hover:bg-zinc-100 disabled:opacity-50 text-black transition-colors cursor-pointer"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

            </div>
            {isAdmin && (
                <ScheduleSettingsModal
                    isOpen={isSettingsOpen}
                    onClose={() => setIsSettingsOpen(false)}
                />
            )}
            {!isAdmin && (
                <UserAppointmentModal
                    isOpen={isSettingsOpen}
                    onClose={() => setIsSettingsOpen(false)}
                />
            )}
        </div>
    );
}