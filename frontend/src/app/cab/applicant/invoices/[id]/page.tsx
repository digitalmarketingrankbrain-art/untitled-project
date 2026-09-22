import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { getInvoiceById } from "@/lib/portal/applicant-data";
import { INVOICE_STATUS_STYLE } from "@/lib/portal/invoice-status";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const invoice = await getInvoiceById(id, session!.user.id);
  if (!invoice) notFound();
  const style = INVOICE_STATUS_STYLE[invoice.status];

  return (
    <div className="px-6 py-8">
      <Breadcrumbs items={[{ label: "Invoices", href: "/cab/applicant/invoices" }, { label: invoice.invoiceNumber }]} />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="font-display text-2xl font-semibold text-text">{invoice.invoiceNumber}</h1>
        <StatusBadge tone={style.tone} label={style.label} />
      </div>

      <div className="mt-6 max-w-lg rounded-lg border border-border bg-surface p-6">
        <div className="flex items-center justify-between border-b border-border py-2">
          <span className="font-sans text-sm text-text-muted">Issued</span>
          <span className="font-mono text-sm text-text">{invoice.issuedAt || "—"}</span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="font-sans text-sm text-text-muted">Due</span>
          <span className="font-mono text-sm text-text">{invoice.dueAt || "—"}</span>
        </div>

        <table className="mt-4 w-full border-t border-border text-sm">
          <thead>
            <tr className="text-left text-xs text-text-muted">
              <th className="py-2">Description</th>
              <th className="py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.lineItems.map((item, i) => (
              <tr key={i} className="border-t border-border">
                <td className="py-2 pr-4 text-text">{item.description}</td>
                <td className="py-2 text-right font-mono text-text">
                  {invoice.currency} {item.amount.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-border font-semibold">
              <td className="py-2 text-text">Total</td>
              <td className="py-2 text-right font-mono text-text">
                {invoice.currency} {invoice.amount.toLocaleString()}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <a href={`/api/invoices/${invoice.id}`} download>
          <Button variant="secondary">Download PDF</Button>
        </a>
        {invoice.status === "ISSUED" && (
          <Button variant="primary" disabled>
            Pay now
          </Button>
        )}
      </div>
      {invoice.status === "ISSUED" && (
        <p className="mt-2 font-sans text-xs text-text-muted">
          Online payment isn&apos;t available yet — please contact us to arrange payment for this
          invoice.
        </p>
      )}
    </div>
  );
}
