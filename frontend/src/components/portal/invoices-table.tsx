"use client";

import { useRouter } from "next/navigation";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Invoice } from "@/lib/portal/applicant-data";
import { INVOICE_STATUS_STYLE } from "@/lib/portal/invoice-status";

function InvoicesTable({ invoices }: { invoices: Invoice[] }) {
  const router = useRouter();

  const totalInvoiced = invoices.reduce((s, i) => s + i.amount, 0);
  const paidTotal = invoices.filter((i) => i.status === "PAID").reduce((s, i) => s + i.amount, 0);
  const outstandingTotal = invoices.filter((i) => i.status === "ISSUED" || i.status === "OVERDUE").reduce((s, i) => s + i.amount, 0);

  const columns: DataTableColumn<Invoice>[] = [
    { key: "invoiceNumber", header: "Invoice #", mono: true, render: (i) => <span className="font-bold text-blue-700">{i.invoiceNumber}</span> },
    { key: "description", header: "Service Description", render: (i) => <span className="font-medium text-slate-800">{i.description}</span> },
    {
      key: "amount",
      header: "Amount",
      mono: true,
      align: "right",
      render: (i) => <span className="font-semibold text-slate-900">{i.currency} ${i.amount.toLocaleString()}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (i) => {
        const s = INVOICE_STATUS_STYLE[i.status];
        return <StatusBadge tone={s.tone} label={s.label} size="sm" />;
      },
    },
    { key: "dueAt", header: "Due Date", mono: true, align: "right", render: (i) => <span className="text-slate-500 font-medium">{i.dueAt}</span> },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Invoiced</p>
          <p className="mt-1 font-mono text-xl font-bold text-slate-900">${totalInvoiced.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-4 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Settled / Paid</p>
          <p className="mt-1 font-mono text-xl font-bold text-emerald-700">${paidTotal.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-4 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Outstanding Balance</p>
          <p className="mt-1 font-mono text-xl font-bold text-amber-700">${outstandingTotal.toLocaleString()}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
        <DataTable
          columns={columns}
          rows={invoices}
          getRowKey={(i) => i.id}
          onRowClick={(i) => router.push(`/cab/applicant/invoices/${i.id}`)}
        />
      </div>
    </div>
  );
}

export { InvoicesTable };
