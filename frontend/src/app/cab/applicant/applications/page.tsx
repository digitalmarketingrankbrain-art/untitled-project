import { auth } from "@/auth";
import { ApplicationsTable } from "@/components/portal/applications-table";
import { NewApplicationButton } from "@/components/portal/new-application-button";
import { EmptyState } from "@/components/ui/empty-state";
import { getApplicationsForUser } from "@/lib/portal/applicant-data";

export default async function ApplicationsListPage() {
  const session = await auth();
  const apps = await getApplicationsForUser(session!.user.id);

  return (
    <div className="px-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-text">Applications</h1>
        <NewApplicationButton />
      </div>
      <div className="mt-6">
        {apps.length === 0 ? (
          <EmptyState title="No applications yet." description="Start a new application to get going." />
        ) : (
          <ApplicationsTable applications={apps} />
        )}
      </div>
    </div>
  );
}
