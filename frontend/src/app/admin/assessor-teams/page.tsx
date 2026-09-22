import { AdminAssessorTeamsTable } from "@/components/portal/admin-assessor-teams-table";
import { getAllProposalsForAdmin } from "@/lib/portal/assessor-team-data";

export default async function AdminAssessorTeamsPage() {
  const proposals = await getAllProposalsForAdmin();

  return (
    <div className="px-6 py-8">
      <h1 className="font-display text-2xl font-semibold text-text">Assessor Team Proposals</h1>
      <p className="mt-1 font-sans text-sm text-text-muted">
        Assessment teams proposed by certification bodies, awaiting review.
      </p>
      <div className="mt-6">
        <AdminAssessorTeamsTable proposals={proposals} />
      </div>
    </div>
  );
}
