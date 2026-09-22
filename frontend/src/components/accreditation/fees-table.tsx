"use client";

import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import type { Program } from "@/lib/programs";
import type { ProgramFee } from "@/lib/program-fees";

export interface FeesTableRow extends Program {
  fee?: ProgramFee;
}

const columns: DataTableColumn<FeesTableRow>[] = [
  { key: "name", header: "Program", render: (p) => p.name },
  {
    key: "fee",
    header: "Application Fee",
    align: "right",
    mono: true,
    render: (p) => (p.fee ? `${p.fee.currency} ${p.fee.amount.toLocaleString()}` : "To be confirmed"),
  },
];

function FeesTable({ programs }: { programs: FeesTableRow[] }) {
  return <DataTable columns={columns} rows={programs} getRowKey={(p) => p.slug} />;
}

export { FeesTable };
