'use client'

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/dashboard/skeleton";
import { UsersTable } from "@/components/dashboard/users-table";
import { UserItem, UserApiResponse } from "@/types/user";
import useFetch from "@/hooks/useFetch";
import { formatDate } from "@/utils/format-date";
import { toastMessage } from "@/utils/toast-message";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMutationHook } from "@/hooks/useMutation";

export default function UsersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const queryClient = useQueryClient();

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

    useEffect(() => {
        if (status === 'loading') return;
        if (status === 'unauthenticated' || (session && session.user.role !== 'ADMIN')) {
            const redirectUrl = session?.user?.id ? `/dashboard/${session.user.id}` : '/';
            router.replace(redirectUrl);
        }
    }, [session, status, router]);

    const { data: fetchResponse, isLoading } = useFetch({
        url: `/users?page=${page}&limit=7&query=${search}&date=${dateFilter}&order=${sortOrder}`,
        options: { method: 'GET' },
        cacheKeys: ['users', page, search, dateFilter, sortOrder],
    });

    const users: UserItem[] = fetchResponse?.data?.map((item: UserApiResponse) => ({
        id: item.id,
        date: formatDate(item.createdAt),
        name: `${item.name} ${item.lastName}`,
        role: 'Cliente',
        address: `${item.street} nº${item.number}, ${item.neighborhood}, ${item.city} - ${item.state}`,
        permissions: item.permissions || [],
        isActive: item.isActive
    })) || [];

    const totalPages = fetchResponse?.totalPages || 1;

    const mutation = useMutationHook<void, Error, Partial<UserApiResponse>>({
        url: ({ id }) => `/users/${id}`,
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${session?.user?.token}`
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toastMessage({ message: "Dados atualizados com sucesso", type: "success" });
        },
        onError: () => {
            toastMessage({ message: "Erro ao atualizar cliente", type: "error" });
        }
    });

    function updateUser(userId: string, data: Partial<UserApiResponse>) {
        mutation.mutate({ id: userId, ...data });
    }

    const handleToggleStatus = (id: string, currentStatus: boolean) => {
        updateUser(id, { isActive: !currentStatus });
    };

    const handleTogglePermission = (id: string, permission: string, currentPermissions: string[]) => {
        let newPermissions = [...currentPermissions];

        if (newPermissions.includes(permission)) {
            newPermissions = newPermissions.filter(p => p !== permission);
        } else {
            newPermissions.push(permission);
        }

        updateUser(id, { permissions: newPermissions });
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
                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto flex-1">
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
                </div>

                <div className="flex-1 flex flex-col">
                    {isLoading ? (
                        <div className="p-6">
                            <Skeleton />
                        </div>
                    ) : users.length > 0 ? (
                        <UsersTable
                            data={users}
                            onSort={toggleSort}
                            onToggleStatus={handleToggleStatus}
                            onTogglePermission={handleTogglePermission}
                            page={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-zinc-500 text-sm p-6">
                            Nenhum cliente encontrado.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}