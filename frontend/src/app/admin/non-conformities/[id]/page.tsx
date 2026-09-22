import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { StatusBadge, type StatusTone } from "@/components/ui/status-badge";
import { getNonConformityByIdAdmin, NC_STATUS_LABEL, type NcStatus } from "@/lib/portal/nc-data";
import { NcResponseThread } from "@/components/portal/nc-response-panel";
import { AdminNcReviewActions } from "@/components/portal/admin-nc-review-actions";

const STATUS_TONE: Record<NcStatus, StatusTone> = {
  OPEN: "warning",
  RESPONSE_SUBMITTED: "info",
  UNDER_REVIEW: "info",
  ACCEPTED: "success",
  REJECTED: "error",
  CLOSED: "success",
};

export default async function AdminNcDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const nc = await getNonConformityByIdAdmin(id);
  if (!nc) notFound();

  return (
    <div className="px-6 py-8">
      <Breadcrumbs items={[{ label: "Non-Conformities", href: "/admin/non-conformities" }, { label: nc.ncNumber }]} />

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="font-display text-2xl font-semibold text-text">NC {nc.ncNumber}</h1>
        <StatusBadge tone={STATUS_TONE[nc.status]} label={NC_STATUS_LABEL[nc.status]} />
        {nc.overdue && <StatusBadge tone="error" label="Overdue" />}
        {nc.locked && <StatusBadge tone="neutral" label="Locked" />}
      </div>
      <p className="font-sans text-sm text-text-muted">{nc.standardReference}</p>

      <div className="mt-6">
        <AdminNcReviewActions nc={nc} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-2 font-sans text-sm font-semibold text-text">Non-Conformity Observed</h2>
          <p className="font-sans text-sm text-text">{nc.finding}</p>
          {nc.requirementText && (
            <>
              <h2 className="mb-2 mt-6 font-sans text-sm font-semibold text-text">Standard / AB Requirements</h2>
              <p className="font-sans text-sm text-text">{nc.requirementText}</p>
            </>
          )}
          <h2 className="mb-2 mt-6 font-sans text-sm font-semibold text-text">Previous Remarks</h2>
          <NcResponseThread responses={nc.responses} />
        </div>
        <div>
          <h2 className="mb-2 font-sans text-sm font-semibold text-text">Details</h2>
          <ul className="flex flex-col gap-2 font-sans text-sm">
            <li><span className="text-text-muted">Scheme:</span> {nc.schemeText ?? "—"}</li>
            <li><span className="text-text-muted">Raised:</span> {nc.raisedAt}</li>
            <li><span className="text-text-muted">Due:</span> {nc.dueDate ?? "—"}</li>
            <li><span className="text-text-muted">Raised by:</span> {nc.raisedByName ?? "—"}</li>
            <li><span className="text-text-muted">Team lead:</span> {nc.teamLeadName ?? "—"}</li>
            <li><span className="text-text-muted">CAB representative:</span> {nc.cabRepresentativeName ?? "—"}</li>
            <li><span className="text-text-muted">Reviewed by:</span> {nc.reviewedByName ?? "—"}</li>
            <li><span className="text-text-muted">Closed:</span> {nc.closedAt ?? "—"}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
