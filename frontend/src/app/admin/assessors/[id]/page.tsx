import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { StatusBadge, type StatusTone } from "@/components/ui/status-badge";
import { findUserById } from "@/lib/auth/store";
import { getAllAssignments, getAllCompetence, ASSIGNMENT_STATUS_LABEL, type AssignmentStatus } from "@/lib/portal/assessor-data";

const STATUS_TONE: Record<AssignmentStatus, StatusTone> = {
  PENDING: "warning",
  ACCEPTED: "info",
  DECLINED: "neutral",
  IN_PROGRESS: "info",
  REPORT_SUBMITTED: "success",
  COMPLETED: "success",
};

const COMPETENCE_TONE: Record<string, StatusTone> = {
  CURRENT: "success",
  EXPIRING_SOON: "warning",
  EXPIRED: "error",
};

export default async function AdminAssessorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await findUserById(id);
  if (!user || user.primaryRole !== "ASSESSOR") notFound();

  const [allAssignments, allCompetence] = await Promise.all([getAllAssignments(), getAllCompetence()]);
  const assignments = allAssignments.filter((a) => a.assessorUserId === id);
  const competence = allCompetence.filter((c) => c.assessorUserId === id);

  return (
    <div className="px-6 py-8">
      <Breadcrumbs items={[{ label: "Assessors", href: "/admin/assessors" }, { label: user.name }]} />
      <h1 className="mt-3 font-display text-2xl font-semibold text-text">{user.name}</h1>
      <p className="font-sans text-sm text-text-muted">{user.email}</p>

      <div className="mt-8">
        <h2 className="mb-3 font-sans text-sm font-semibold text-text">Competence</h2>
        <ul className="flex flex-col gap-2">
          {competence.map((c) => (
            <li key={c.id} className="flex items-center justify-between rounded-md border border-border bg-surface px-4 py-3">
              <div>
                <p className="font-sans text-sm text-text">{c.programName}</p>
                <p className="font-sans text-xs text-text-muted">{c.qualifyingBasis}</p>
              </div>
              <StatusBadge tone={COMPETENCE_TONE[c.status] ?? "neutral"} label={c.status.replace("_", " ")} size="sm" />
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        <h2 className="mb-3 font-sans text-sm font-semibold text-text">Assignment history</h2>
        <ul className="flex flex-col gap-2">
          {assignments.map((a) => (
            <li key={a.id} className="rounded-md border border-border bg-surface px-4 py-3">
              <div className="flex items-center justify-between">
                <p className="font-sans text-sm text-text">{a.organisationName} — {a.programName}</p>
                <StatusBadge tone={STATUS_TONE[a.status]} label={ASSIGNMENT_STATUS_LABEL[a.status]} size="sm" />
              </div>
              {a.status === "DECLINED" && a.declineReason && (
                <p className="mt-1 font-sans text-xs text-text-muted">Decline reason: {a.declineReason}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
