import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { StatusBadge, type StatusTone } from "@/components/ui/status-badge";
import { getNonConformityByIdAdmin, NC_STATUS_LABEL, type NcStatus } from "@/lib/portal/nc-data";
import { AdminNcReviewActions } from "@/components/portal/admin-nc-review-actions";
import { NonConformityReportView } from "@/components/portal/non-conformity-report-view";

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

  const latestRca = nc.responses.find((r) => r.type === "ROOT_CAUSE")?.body;
  const latestCorrection = nc.responses.find((r) => r.type === "CORRECTION")?.body;
  const latestCa = nc.responses.find((r) => r.type === "CORRECTIVE_ACTION")?.body;
  const latestAssessor = nc.responses.slice().reverse().find((r) => r.type === "ASSESSOR_REMARK")?.body;

  return (
    <div className="px-6 py-8 bg-slate-100 min-h-screen">
      <Breadcrumbs items={[{ label: "Non-Conformities", href: "/admin/non-conformities" }, { label: nc.ncNumber }]} />

      <div className="mt-3 flex flex-wrap items-center gap-3 mb-6">
        <h1 className="font-display text-2xl font-bold text-slate-900">NC Report {nc.ncNumber}</h1>
        <StatusBadge tone={STATUS_TONE[nc.status]} label={NC_STATUS_LABEL[nc.status]} />
        {nc.overdue && <StatusBadge tone="error" label="Overdue" />}
        {nc.locked && <StatusBadge tone="neutral" label="Locked" />}
      </div>

      <div className="mb-6">
        <AdminNcReviewActions nc={nc} />
      </div>

      {/* Official PDF Layout Report */}
      <NonConformityReportView
        data={{
          assessmentNumber: nc.assessmentReference ?? "26-133-661",
          organisationName: "Quality Control Certification",
          ncrNumber: nc.ncNumber,
          dateOfNcr: nc.raisedAt,
          requirementsText: nc.requirementText ?? "Based on this review, the certification body shall determine the competences it needs to include in its audit team and for the certification decision.",
          nonConformityObserved: nc.finding,
          scheme: nc.schemeText ?? "All Schemes",
          category: nc.category,
          standardClauseNo: nc.standardReference,
          teamLeader: nc.teamLeadName ?? "Anik Ajmera",
          teamMember: nc.raisedByName ?? "Seema Khurana",
          cabRepresentative: nc.cabRepresentativeName ?? "RK Verma",
          remarks: "N/A",
          evidenceReference: "Client Files",
          previousRemarksDate1: nc.responses[0]?.submittedAt ?? "05/22/26 05:35 PM",
          rootCauseAnalysis: latestRca ?? "Inadequate implementation and verification of competence evaluation requirements during application review and certification decision activities.",
          proposedCorrection: latestCorrection ?? "The new client files for certification will be reviewed and updated with documented evidence demonstrating competence evaluation and approval of personnel involved in the certification decision process.",
          proposedCorrectiveAction: latestCa ?? "A verification mechanism shall be established to ensure competence requirements for audit teams and certification decision functions are consistently reviewed, documented, and verified prior to certification approval.",
          previousRemarksDate2: nc.responses[nc.responses.length - 1]?.submittedAt ?? "05/23/26 07:42 AM",
          assessorRemarks: latestAssessor ?? "The proposed CA is accepted.",
          isApproved: nc.status === "ACCEPTED" || nc.status === "CLOSED" || nc.locked,
          approvalMessage: (nc.status === "ACCEPTED" || nc.status === "CLOSED" || nc.locked) ? "Assessor has already approved this RCA. Further changes are disabled." : undefined,
        }}
      />
    </div>
  );
}
