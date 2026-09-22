import { AdminNcTable } from "@/components/portal/admin-nc-table";
import { getAllNonConformitiesForAdmin } from "@/lib/portal/nc-data";

export default async function AdminNonConformitiesPage() {
  const items = await getAllNonConformitiesForAdmin();

  return (
    <div className="px-6 py-8">
      <h1 className="font-display text-2xl font-semibold text-text">Non-Conformities</h1>
      <p className="mt-1 font-sans text-sm text-text-muted">Review CB responses, accept/reject, and close NCs.</p>
      <div className="mt-6">
        <AdminNcTable items={items} />
      </div>
    </div>
  );
}
