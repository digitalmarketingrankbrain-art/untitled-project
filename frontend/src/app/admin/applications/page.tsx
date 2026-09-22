import { AdminApplicationsTable } from "@/components/portal/admin-applications-table";
import { getAllApplications } from "@/lib/portal/applicant-data";
import { getUserOrgName } from "@/lib/portal/admin-data";

export default async function AdminApplicationsPage() {
  const applications = await getAllApplications();
  const rows = await Promise.all(
    applications.map(async (a) => ({ ...a, organisationName: await getUserOrgName(a.applicantUserId) })),
  );

  return (
    <div className="px-6 py-8">
      <h1 className="font-display text-2xl font-semibold text-text">Applications</h1>
      <div className="mt-6">
        <AdminApplicationsTable rows={rows} />
      </div>
    </div>
  );
}
