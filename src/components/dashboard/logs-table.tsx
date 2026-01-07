import { DataTable, ColumnDef } from "@/components/ui/data-table";
import { ModuleBadge } from "./module-badge";
import { LogItem } from "@/types/log";

interface LogsTableProps {
    logs: LogItem[];
    onSort: () => void;
    isAdmin: boolean;
    page?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
}

export function LogsTable({ logs, onSort, isAdmin, page = 1, totalPages = 1, onPageChange = () => { } }: LogsTableProps) {

    const columns: ColumnDef<LogItem>[] = [
        ...(isAdmin ? [{
            header: "Cliente",
            className: "w-[30%]",
            cell: (log: LogItem) => (
                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
                    {log.clientName || 'Usuário'}
                </span>
            )
        }] : []),
        {
            header: "Tipo de atividade",
            className: "w-[20%]",
            cell: (log) => (
                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
                    {log.activityType}
                </span>
            )
        },
        {
            header: "Módulo",
            className: "w-[20%]",
            cell: (log) => <ModuleBadge module={log.module} />
        },
        {
            header: "Data e horário",
            className: "w-[20%] text-zinc-600 font-medium",
            onSort: onSort,
            cell: (log) => (
                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
                    {log.date}
                </span>
            )
        }
    ];

    return (
        <DataTable
            data={logs}
            columns={columns}
            pagination={{
                currentPage: page,
                totalPages: totalPages,
                onPageChange: onPageChange
            }}
        />
    );
}