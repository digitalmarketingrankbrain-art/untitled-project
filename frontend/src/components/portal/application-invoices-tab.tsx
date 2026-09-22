"use client";

import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import type { Invoice } from "@/lib/portal/applicant-data";

function ApplicationInvoicesTab({ invoices }: { invoices: Invoice[] }) {
  if (invoices.length === 0) {
    return <p className="font-sans text-sm text-text-muted">No invoices for this application yet.</p>;
  }
  const columns: DataTableColumn<Invoice>[] = [
    { key: "invoiceNumber", header: "Invoice", mono: true, render: (i) => i.invoiceNumber },
    { key: "description", header: "Description", render: (i) => i.description },
    { key: "amount", header: "Amount", mono: true, align: "right", render: (i) => `$${i.amount.toLocaleString()}` },
    { key: "status", header: "Status", render: (i) => i.status },
  ];
  return <DataTable columns={columns} rows={invoices} getRowKey={(i) => i.id} />;
}

export { ApplicationInvoicesTab };
