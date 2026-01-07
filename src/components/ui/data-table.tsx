'use client'

import { ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/utils/utis";
import { ReactNode } from "react";

export interface ColumnDef<T> {
    header: string | ReactNode;
    accessorKey?: keyof T;
    cell?: (item: T) => ReactNode;
    className?: string;
    onSort?: () => void;
}

interface DataTableProps<T> {
    data: T[];
    columns: ColumnDef<T>[];
    isLoading?: boolean;
    pagination?: {
        currentPage: number;
        totalPages: number;
        onPageChange: (page: number) => void;
        totalItems?: number;
    };
    getRowClassName?: (item: T) => string;
}

export function DataTable<T extends { id: string | number }>({
    data,
    columns,
    isLoading,
    pagination,
    getRowClassName
}: DataTableProps<T>) {

    return (
        <>
            <div className="w-full flex-1 overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-zinc-700 bg-zinc-50/50 border-b border-zinc-200">
                        <tr>
                            {columns.map((col, index) => (
                                <th
                                    key={index}
                                    className={cn("px-6 py-4", col.className)}
                                >
                                    {col.onSort ? (
                                        <div
                                            onClick={col.onSort}
                                            className="flex items-center gap-1 cursor-pointer hover:text-zinc-800 transition-colors select-none"
                                        >
                                            {col.header}
                                            <ArrowUpDown className="w-3 h-3" />
                                        </div>
                                    ) : (
                                        col.header
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-zinc-100">
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i}>
                                    {columns.map((_, j) => (
                                        <td key={j} className="px-6 py-4">
                                            <div className="h-4 bg-zinc-100 rounded animate-pulse" />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-8 text-center text-zinc-500">
                                    Nenhum registro encontrado.
                                </td>
                            </tr>
                        ) : (
                            data.map((item) => (
                                <tr
                                    key={item.id}
                                    className={cn(
                                        "transition-colors",
                                        getRowClassName ? getRowClassName(item) : "bg-white"
                                    )}
                                >
                                    {columns.map((col, index) => (
                                        <td key={index} className={cn("px-6 py-4", col.className)}>
                                            {col.cell
                                                ? col.cell(item)
                                                : (col.accessorKey ? String(item[col.accessorKey]) : null)
                                            }
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {pagination && (
                <div className="p-4 border-t border-zinc-100 flex justify-center items-center gap-2 mt-auto">
                    <button
                        onClick={() => pagination.onPageChange(1)}
                        type="button"
                        disabled={pagination.currentPage === 1 || isLoading}
                        className="p-2 rounded-md hover:bg-zinc-100 disabled:opacity-50 text-black transition-colors cursor-pointer"
                    >
                        <ChevronsLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                        type="button"
                        disabled={pagination.currentPage === 1 || isLoading}
                        className="p-2 rounded-md hover:bg-zinc-100 disabled:opacity-50 text-black transition-colors cursor-pointer"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    <span className="w-8 h-8 flex items-center justify-center bg-black text-white rounded-md text-sm font-medium">
                        {pagination.currentPage}
                    </span>

                    <button
                        onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                        type="button"
                        disabled={pagination.currentPage >= pagination.totalPages || isLoading}
                        className="p-2 rounded-md hover:bg-zinc-100 disabled:opacity-50 text-black transition-colors cursor-pointer"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>

                    <button
                        onClick={() => pagination.onPageChange(pagination.totalPages)}
                        type="button"
                        disabled={pagination.currentPage >= pagination.totalPages || isLoading}
                        className="p-2 rounded-md hover:bg-zinc-100 disabled:opacity-50 text-black transition-colors cursor-pointer"
                    >
                        <ChevronsRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </>
    );
}