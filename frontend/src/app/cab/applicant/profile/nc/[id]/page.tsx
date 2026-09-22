import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/auth";
import { StatusBadge, type StatusTone } from "@/components/ui/status-badge";
import { getNonConformityById, NC_STATUS_LABEL, type NcSeverity, type NcStatus } from "@/lib/portal/nc-data";
import { NcResponseForm } from "@/components/portal/nc-response-panel";
import { NonConformityReportView } from "@/components/portal/non-conformity-report-view";

const CATEGORY_TONE: Record<NcSeverity, StatusTone> = { MAJOR: "error", MINOR: "warning", OBSERVATION: "info" };
const CATEGORY_LABEL: Record<NcSeverity, string> = { MAJOR: "Major", MINOR: "Minor", OBSERVATION: "Observation" };
const STATUS_TONE: Record<NcStatus, StatusTone> = {
  OPEN: "warning",
  RESPONSE_SUBMITTED: "info",
  UNDER_REVIEW: "info",
  ACCEPTED: "success",
  REJECTED: "error",
  CLOSED: "success",
};

export default async function NcDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const nc = await getNonConformityById(id, session!.user.id);
  if (!nc) notFound();

  const latestRca = nc.responses.find((r) => r.type === "ROOT_CAUSE")?.body;
  const latestCorrection = nc.responses.find((r) => r.type === "CORRECTION")?.body;
  const latestCa = nc.responses.find((r) => r.type === "CORRECTIVE_ACTION")?.body;
  const latestAssessor = nc.responses.slice().reverse().find((r) => r.type === "ASSESSOR_REMARK")?.body;

  return (
    <div className="px-6 py-8 bg-slate-100 min-h-screen">
      <Link href="/cab/applicant/profile" className="flex items-center gap-1.5 font-sans text-sm text-blue-700 hover:underline mb-4 font-semibold">
        <ArrowLeft className="size-3.5" strokeWidth={2} /> Back to Profile
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">NC Report {nc.ncNumber}</h1>
          <p className="font-mono text-sm text-slate-500">Assessment {nc.assessmentReference ?? "26-133-661"}</p>
        </div>
        <div className="flex gap-2">
          <StatusBadge tone={CATEGORY_TONE[nc.category]} label={CATEGORY_LABEL[nc.category]} />
          <StatusBadge tone={STATUS_TONE[nc.status]} label={NC_STATUS_LABEL[nc.status]} />
          {nc.overdue && <StatusBadge tone="error" label="Overdue" />}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Official Document Report View */}
        <div className="lg:col-span-8">
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

        {/* Response Action Form Side Card */}
        <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-slate-200 shadow-md">
          <h2 className="font-display text-base font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4">
            Submit RCA / Corrective Action
          </h2>
          <NcResponseForm ncId={nc.id} locked={nc.locked || nc.status === "CLOSED"} />
        </div>
      </div>
    </div>
  );
}
