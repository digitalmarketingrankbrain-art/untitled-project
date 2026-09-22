import { auth } from "@/auth";
import { AssignmentsTable } from "@/components/portal/assignments-table";
import { EmptyState } from "@/components/ui/empty-state";
import { getAssignmentsForUser } from "@/lib/portal/assessor-data";

export default async function AssignmentsListPage() {
  const session = await auth();
  const myAssignments = await getAssignmentsForUser(session!.user.id);

  return (
    <div className="px-6 py-8">
      <h1 className="font-display text-2xl font-semibold text-text">Assignments</h1>
      <div className="mt-6">
        {myAssignments.length === 0 ? (
          <EmptyState title="No assignments yet." />
        ) : (
          <AssignmentsTable assignments={myAssignments} />
        )}
      </div>
    </div>
  );
}
