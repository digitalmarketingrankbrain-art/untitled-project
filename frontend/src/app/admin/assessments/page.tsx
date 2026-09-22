import { AdminAssessmentsTable } from "@/components/portal/admin-assessments-table";
import { getAllAssignments } from "@/lib/portal/assessor-data";

export default async function AdminAssessmentsPage() {
  const assignments = await getAllAssignments();

  return (
    <div className="px-6 py-8">
      <h1 className="font-display text-2xl font-semibold text-text">Assessments</h1>
      <p className="mt-1 font-sans text-sm text-text-muted">
        Every assessment assignment across the system — send assessment notifications and review/finalize reports here.
      </p>
      <div className="mt-6">
        <AdminAssessmentsTable assignments={assignments} />
      </div>
    </div>
  );
}
