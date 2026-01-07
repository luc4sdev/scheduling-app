'use client'

import { LogsTable } from "@/components/dashboard/logs-table";
import { Skeleton } from "@/components/dashboard/skeleton";
import { LogItem, LogApiResponse } from "@/types/log";
import useFetch from "@/hooks/useFetch";
import { Search } from "lucide-react";
import { useState } from "react";
import { formatDate } from "@/utils/format-date";
import { useSession } from "next-auth/react";

export default function Logs() {
    const { data: session } = useSession();
    const isAdmin = session?.user?.role === 'ADMIN';

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

    const { data: fetchResponse, isLoading } = useFetch({
        url: `/logs?page=${page}&limit=7&query=${search}&date=${dateFilter}&order=${sortOrder}`,
        options: {
            method: 'GET',
        },
        cacheKeys: ['logs', page, search, dateFilter, sortOrder],
    });

    const logs: LogItem[] = fetchResponse?.data?.map((item: LogApiResponse) => ({
        id: item.id,
        activityType: item.action,
        module: item.module,
        clientName: `${item.user?.name} ${item.user?.lastName}` || 'Cliente',
        date: formatDate(item.createdAt)
    })) || [];

    const totalPages = fetchResponse?.totalPages || 1;

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

                <div className="p-6 border-b border-zinc-100 flex flex-col md:flex-row gap-4 items-center">

                    <div className="relative w-full md:max-w-100">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Filtre por tipo de atividade ou Módulo"
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

                <div className="flex-1 flex flex-col">
                    {isLoading ? (
                        <div className="p-6">
                            <Skeleton />
                        </div>
                    ) : logs.length > 0 ? (
                        <LogsTable logs={logs} onSort={toggleSort} isAdmin={isAdmin} page={page} totalPages={totalPages} onPageChange={setPage} />
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-zinc-500 text-sm p-6">
                            Nenhum registro encontrado.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}