"use client";

import Link from "next/link";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { PROPOSAL_STATUS_LABEL, type AssessorTeamProposalSummary } from "@/lib/portal/assessor-team-data";

const TONE: Record<AssessorTeamProposalSummary["status"], "success" | "warning" | "info" | "neutral" | "error"> = {
  DRAFT: "neutral",
  SUBMITTED: "info",
  UNDER_REVIEW: "info",
  APPROVED: "success",
  CHANGES_REQUESTED: "warning",
  REJECTED: "error",
};

const columns: DataTableColumn<AssessorTeamProposalSummary>[] = [
  {
    key: "organisationName",
    header: "Organisation",
    render: (p) => (
      <Link href={`/admin/assessor-teams/${p.id}`} className="font-medium text-secondary hover:underline">
        {p.organisationName}
      </Link>
    ),
  },
  { key: "applicationReference", header: "Application", mono: true, render: (p) => p.applicationReference },
  { key: "memberCount", header: "Members", align: "right", mono: true, render: (p) => String(p.memberCount) },
  { key: "status", header: "Status", render: (p) => <StatusBadge tone={TONE[p.status]} label={PROPOSAL_STATUS_LABEL[p.status]} /> },
  { key: "updatedAt", header: "Updated", mono: true, render: (p) => p.updatedAt },
];

export function AdminAssessorTeamsTable({ proposals }: { proposals: AssessorTeamProposalSummary[] }) {
  return <DataTable columns={columns} rows={proposals} getRowKey={(p) => p.id} />;
}
