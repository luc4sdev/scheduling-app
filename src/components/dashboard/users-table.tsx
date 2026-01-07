'use client'

import { ArrowUpDown } from "lucide-react";
import { UserItem } from "@/types/user";
import { PermissionTag } from "./permission-tag";
import { StatusSwitch } from "./status-siwtch";

interface UsersTableProps {
    data: UserItem[];
    onSort: () => void;
    onToggleStatus: (id: string, currentStatus: boolean) => void;
    onTogglePermission: (id: string, permission: string, currentPermissions: string[]) => void;
}

export function UsersTable({ data, onSort, onToggleStatus, onTogglePermission }: UsersTableProps) {
    return (
        <div className="flex-1 w-full overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-zinc-500 font-semibold bg-white border-b border-zinc-100">
                    <tr>
                        <th className="px-6 py-4 font-medium cursor-pointer hover:text-zinc-800 transition-colors" onClick={onSort}>
                            <div className="flex items-center gap-1">
                                Data de cadastro
                                <ArrowUpDown className="w-3 h-3" />
                            </div>
                        </th>
                        <th className="px-6 py-4 font-medium">Nome</th>
                        <th className="px-6 py-4 font-medium">Endereço</th>
                        <th className="px-6 py-4 font-medium">Permissões</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100/50">
                    {data.map((client) => (
                        <tr key={client.id} className="hover:bg-zinc-50/50 transition-colors bg-white">
                            <td className="px-6 py-4 text-zinc-600">
                                {client.date}
                            </td>

                            <td className="px-6 py-4">
                                <div className="flex flex-col">
                                    <span className="font-medium text-zinc-900">{client.name}</span>
                                    <span className="text-xs text-zinc-500">{client.role}</span>
                                </div>
                            </td>

                            <td className="px-6 py-4 text-zinc-600 max-w-62.5 truncate" title={client.address}>
                                {client.address}
                            </td>

                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <PermissionTag
                                        label="Agendamentos"
                                        isActive={client.permissions.includes('APPOINTMENTS')}
                                        onClick={() => onTogglePermission(client.id, 'APPOINTMENTS', client.permissions)}
                                    />
                                    <PermissionTag
                                        label="Logs"
                                        isActive={client.permissions.includes('LOGS')}
                                        onClick={() => onTogglePermission(client.id, 'LOGS', client.permissions)}
                                    />
                                </div>
                            </td>

                            <td className="px-6 py-4">
                                <StatusSwitch
                                    isActive={client.isActive}
                                    onToggle={() => onToggleStatus(client.id, client.isActive)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

