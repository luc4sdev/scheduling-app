import { DataTable, ColumnDef } from "@/components/ui/data-table";
import { UserItem } from "@/types/user";
import { PermissionTag } from "./permission-tag";
import { StatusSwitch } from "./status-siwtch";

interface UsersTableProps {
    data: UserItem[];
    onSort: () => void;
    onToggleStatus: (userId: string, isActive: boolean) => void;
    onTogglePermission: (userId: string, permission: string, currentPermissions: string[]) => void;
    page?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
}

export function UsersTable({ data, onSort, onToggleStatus, onTogglePermission, page = 1, totalPages = 1, onPageChange = () => { } }: UsersTableProps) {

    const columns: ColumnDef<UserItem>[] = [
        {
            header: "Data de cadastro",
            className: "text-zinc-600",
            onSort: onSort,
            accessorKey: "date"
        },
        {
            header: "Nome",
            cell: (client) => (
                <div className="flex flex-col">
                    <span className="font-medium text-zinc-900">{client.name}</span>
                    <span className="text-xs text-zinc-500">{client.role}</span>
                </div>
            )
        },
        {
            header: "Endereço",
            className: "text-zinc-600 max-w-62.5 truncate",
            cell: (client) => <span title={client.address}>{client.address}</span>
        },
        {
            header: "Permissões",
            cell: (client) => (
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
            )
        },
        {
            header: "Status",
            cell: (client) => (
                <StatusSwitch
                    isActive={client.isActive}
                    onToggle={() => onToggleStatus(client.id, client.isActive)}
                />
            )
        }
    ];

    return <DataTable
        data={data}
        columns={columns}
        pagination={{
            currentPage: page,
            totalPages: totalPages,
            onPageChange: onPageChange
        }}
    />;
}