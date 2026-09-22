import { AdminOrganisationsTable } from "@/components/portal/admin-organisations-table";
import { getOrganisations } from "@/lib/portal/admin-data";

export default async function AdminOrganisationsPage() {
  const organisations = await getOrganisations();

  return (
    <div className="px-6 py-8">
      <h1 className="font-display text-2xl font-semibold text-text">Organisations</h1>
      <div className="mt-6">
        <AdminOrganisationsTable organisations={organisations} />
      </div>
    </div>
  );
}
