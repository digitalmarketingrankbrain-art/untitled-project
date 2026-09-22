import { auth } from "@/auth";
import { InvoicesTable } from "@/components/portal/invoices-table";
import { EmptyState } from "@/components/ui/empty-state";
import { getInvoicesForUser } from "@/lib/portal/applicant-data";

export default async function InvoicesListPage() {
  const session = await auth();
  const userInvoices = await getInvoicesForUser(session!.user.id);

  return (
    <div className="px-6 py-8">
      <h1 className="font-display text-2xl font-semibold text-text">Invoices</h1>
      <div className="mt-6">
        {userInvoices.length === 0 ? (
          <EmptyState title="No invoices yet." />
        ) : (
          <InvoicesTable invoices={userInvoices} />
        )}
      </div>
    </div>
  );
}
