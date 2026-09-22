import Link from "next/link";
import { ClipboardList, FileWarning, AlertTriangle } from "lucide-react";
import { auth } from "@/auth";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getAssignmentsForUser, getCompetenceForUser } from "@/lib/portal/assessor-data";

export default async function AssessorDashboardPage() {
  const session = await auth();
  const userId = session!.user.id;
  const [myAssignments, competence] = await Promise.all([getAssignmentsForUser(userId), getCompetenceForUser(userId)]);

  const pending = myAssignments.filter((a) => a.status === "PENDING");
  const active = myAssignments
    .filter((a) => a.status === "IN_PROGRESS" || a.status === "ACCEPTED")
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const awaitingReport = myAssignments.filter(
    (a) => (a.status === "IN_PROGRESS" || a.status === "ACCEPTED") &&
      a.criteria.length > 0 &&
      a.criteria.every((c) => a.findings[c.id]?.status && a.findings[c.id]?.status !== "UNANSWERED"),
  );
  const expiring = competence.filter((c) => c.status === "EXPIRING_SOON" || c.status === "EXPIRED");

  return (
    <div className="px-6 py-8">
      <h1 className="font-display text-2xl font-semibold text-text">Dashboard</h1>

      {pending.length > 0 && (
        <div className="mt-6 flex flex-col gap-3">
          {pending.map((a) => (
            <Link
              key={a.id}
              href={`/assessor/assignments/${a.id}`}
              className="flex items-center justify-between rounded-md border-l-4 border-warning-text bg-warning-surface px-4 py-3 hover:opacity-90"
            >
              <span className="font-sans text-sm text-warning-text">
                New assignment: {a.organisationName} ({a.programName}) — respond by reviewing
              </span>
              <span className="font-mono text-xs text-warning-text">Due {a.dueDate}</span>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <ClipboardList className="mb-1 size-5 text-secondary" strokeWidth={1.5} />
            <CardTitle>Active assignments</CardTitle>
          </CardHeader>
          <CardContent>
            {active.length === 0 ? (
              <p className="text-sm text-text-muted">No active assignments.</p>
            ) : (
              active.map((a) => (
                <p key={a.id} className="text-sm text-text-muted">
                  {a.organisationName} — due {a.dueDate}
                </p>
              ))
            )}
          </CardContent>
          <CardFooter>
            <Link href="/assessor/assignments" className="text-sm font-medium text-secondary hover:underline">
              View all →
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <FileWarning className="mb-1 size-5 text-secondary" strokeWidth={1.5} />
            <CardTitle>Reports awaiting submission</CardTitle>
          </CardHeader>
          <CardContent>
            {awaitingReport.length === 0 ? (
              <p className="text-sm text-text-muted">Nothing waiting on you.</p>
            ) : (
              awaitingReport.map((a) => (
                <Link key={a.id} href={`/assessor/assignments/${a.id}`} className="block text-sm text-secondary hover:underline">
                  {a.organisationName} — checklist complete, ready to submit
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <AlertTriangle className="mb-1 size-5 text-secondary" strokeWidth={1.5} />
            <CardTitle>Competence expiries</CardTitle>
          </CardHeader>
          <CardContent>
            {expiring.length === 0 ? (
              <p className="text-sm text-text-muted">All competence records current.</p>
            ) : (
              expiring.map((c) => (
                <div key={c.id} className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">{c.programName}</span>
                  <StatusBadge tone="warning" label={`Expires ${c.expiryDate}`} size="sm" />
                </div>
              ))
            )}
          </CardContent>
          <CardFooter>
            <Link href="/assessor/competence" className="text-sm font-medium text-secondary hover:underline">
              View competence →
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
