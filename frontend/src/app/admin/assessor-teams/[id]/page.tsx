import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { StatusBadge } from "@/components/ui/status-badge";
import { getProposalByIdAdmin, getAllAssessorsForPicker, PROPOSAL_STATUS_LABEL } from "@/lib/portal/assessor-team-data";
import { AdminAssessorTeamReview, AssessorLinkPicker } from "@/components/portal/admin-assessor-team-review";

const TONE: Record<string, "success" | "warning" | "info" | "neutral" | "error"> = {
  DRAFT: "neutral",
  SUBMITTED: "info",
  UNDER_REVIEW: "info",
  APPROVED: "success",
  CHANGES_REQUESTED: "warning",
  REJECTED: "error",
};

export default async function AdminAssessorTeamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const proposal = await getProposalByIdAdmin(id);
  if (!proposal) notFound();
  const assessors = await getAllAssessorsForPicker();

  return (
    <div className="px-6 py-8">
      <Breadcrumbs items={[{ label: "Assessor Teams", href: "/admin/assessor-teams" }, { label: proposal.applicationReference }]} />

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="font-display text-2xl font-semibold text-text">{proposal.organisationName}</h1>
        <StatusBadge tone={TONE[proposal.status] ?? "neutral"} label={PROPOSAL_STATUS_LABEL[proposal.status]} />
      </div>
      <p className="font-sans text-sm text-text-muted">{proposal.applicationReference}</p>

      <div className="mt-6">
        <AdminAssessorTeamReview proposal={proposal} />
      </div>

      <h2 className="mb-3 mt-8 font-sans text-sm font-semibold text-text">Proposed team members</h2>
      <ul className="flex flex-col gap-3">
        {proposal.members.map((m) => (
          <li key={m.id} className="rounded-md border border-border bg-surface p-4">
            <p className="font-sans text-sm font-medium text-text">{m.name} — {m.role}</p>
            <p className="font-sans text-xs text-text-muted">
              {[m.expertise, m.qualification, m.experienceYears ? `${m.experienceYears} yrs experience` : null, m.availabilityNote].filter(Boolean).join(" · ")}
            </p>
            {proposal.status === "SUBMITTED" && (
              <div className="mt-2">
                <label className="font-sans text-xs font-medium text-text-muted">Link to assessor account</label>
                <AssessorLinkPicker memberId={m.id} proposalId={proposal.id} currentLinkedId={m.linkedAssessorId ?? null} assessors={assessors} />
              </div>
            )}
            {m.linkedAssessorName && proposal.status !== "SUBMITTED" && (
              <p className="mt-1 font-sans text-xs text-text">Linked to: {m.linkedAssessorName}</p>
            )}
          </li>
        ))}
      </ul>

      {proposal.reviewNote && (
        <p className="mt-6 font-sans text-sm text-text-muted">Review note: {proposal.reviewNote}</p>
      )}
    </div>
  );
}
