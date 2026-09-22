import { AdminAssessorsTable } from "@/components/portal/admin-assessors-table";
import { getAssessorSummaries } from "@/lib/portal/admin-data";

export default async function AdminAssessorsPage() {
  const assessors = await getAssessorSummaries();

  return (
    <div className="px-6 py-8">
      <h1 className="font-display text-2xl font-semibold text-text">Assessors</h1>
      <div className="mt-6">
        <AdminAssessorsTable assessors={assessors} />
      </div>
    </div>
  );
}
