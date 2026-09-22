"use client";

import Link from "next/link";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { StatusBadge, type StatusTone } from "@/components/ui/status-badge";
import { NC_STATUS_LABEL, type NonConformityAdminSummary, type NcStatus } from "@/lib/portal/nc-data";

const STATUS_TONE: Record<NcStatus, StatusTone> = {
  OPEN: "warning",
  RESPONSE_SUBMITTED: "info",
  UNDER_REVIEW: "info",
  ACCEPTED: "success",
  REJECTED: "error",
  CLOSED: "success",
};

const columns: DataTableColumn<NonConformityAdminSummary>[] = [
  {
    key: "ncNumber",
    header: "NC#",
    mono: true,
    render: (n) => (
      <Link href={`/admin/non-conformities/${n.id}`} className="font-medium text-secondary hover:underline">
        {n.ncNumber}
      </Link>
    ),
  },
  { key: "organisationName", header: "Organisation", render: (n) => n.organisationName },
  { key: "category", header: "Category", render: (n) => n.category },
  { key: "standardReference", header: "Standard", render: (n) => n.standardReference },
  { key: "status", header: "Status", render: (n) => <StatusBadge tone={STATUS_TONE[n.status]} label={NC_STATUS_LABEL[n.status]} /> },
  { key: "dueDate", header: "Due", mono: true, render: (n) => (n.overdue ? <span className="text-error-text">{n.dueDate} (overdue)</span> : n.dueDate ?? "—") },
];

export function AdminNcTable({ items }: { items: NonConformityAdminSummary[] }) {
  return <DataTable columns={columns} rows={items} getRowKey={(n) => n.id} />;
}
