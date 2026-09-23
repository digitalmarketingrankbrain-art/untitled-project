"use client";

import * as React from "react";
import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  /** Numeric/date columns are right-aligned in mono, per Phase 4. */
  align?: "left" | "right";
  mono?: boolean;
  sortable?: boolean;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  onSort?: (key: string) => void;
  sortKey?: string;
  sortDirection?: "asc" | "desc";
  onRowClick?: (row: T) => void;
  className?: string;
}

function DataTable<T>({
  columns,
  rows,
  getRowKey,
  onSort,
  sortKey,
  sortDirection,
  onRowClick,
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn("overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-[0_10px_30px_rgba(7,26,47,.06)]", className)}>
      <table className="w-full border-collapse text-sm">
        <thead className="sticky top-0 bg-[#f2f7fa]/95 backdrop-blur-xs z-10 border-b border-slate-200/80">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={cn(
                  "px-4.5 py-3 font-sans text-[11px] font-bold uppercase tracking-wider text-slate-500",
                  col.align === "right" ? "text-right" : "text-left",
                )}
              >
                {col.sortable ? (
                  <button
                    onClick={() => onSort?.(col.key)}
                    className="inline-flex items-center gap-1.5 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    {col.header}
                    <ArrowUpDown
                      className={cn(
                        "size-3.5 transition-transform",
                        sortKey === col.key ? "text-teal-700" : "text-slate-400",
                        sortKey === col.key && sortDirection === "desc" && "rotate-180",
                      )}
                      strokeWidth={2}
                    />
                  </button>
                ) : (
                  col.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => (
            <tr
              key={getRowKey(row)}
              onClick={() => onRowClick?.(row)}
              tabIndex={onRowClick ? 0 : undefined}
              onKeyDown={
                onRowClick
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onRowClick(row);
                      }
                    }
                  : undefined
              }
              className={cn(
                "transition-colors duration-150",
                onRowClick &&
                  "cursor-pointer hover:bg-slate-50/80 active:bg-slate-100/60 focus-visible:outline-none focus-visible:bg-slate-50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-500",
              )}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    "px-4.5 py-3.5 text-slate-800 font-medium",
                    col.align === "right" ? "text-right" : "text-left",
                    col.mono && "font-mono text-xs text-slate-600",
                  )}
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export { DataTable };
