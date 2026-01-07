import { ArrowUpDown } from "lucide-react";
import { ModuleBadge } from "./module-badge";
import { LogItem } from "@/types/log";

interface LogsTableProps {
    data: LogItem[];
    onSort: () => void;
}
export function LogsTable({ data, onSort }: LogsTableProps) {
    return (
        <div className="flex-1 w-full overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-zinc-500 font-semibold bg-white border-b border-zinc-100">
                    <tr>
                        <th className="px-6 py-4 w-[40%] font-medium">Tipo de atividade</th>
                        <th className="px-6 py-4 w-[30%] font-medium">Módulo</th>
                        <th className="px-6 py-4 w-[30%] font-medium">
                            <div
                                onClick={onSort}
                                className="flex items-center gap-1 cursor-pointer hover:text-zinc-800"
                            >
                                Data e horário
                                <ArrowUpDown className="w-3 h-3" />
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100/50">
                    {data.map((log) => (
                        <tr key={log.id} className="hover:bg-zinc-50/50 transition-colors bg-white">

                            <td className="px-6 py-4">
                                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
                                    {log.activityType}
                                </span>
                            </td>

                            <td className="px-6 py-4">
                                <ModuleBadge module={log.module} />
                            </td>

                            <td className="px-6 py-4 text-zinc-600 font-medium">
                                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
                                    {log.date}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}           