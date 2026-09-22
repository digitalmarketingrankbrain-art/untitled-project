"use client";

import { useRouter } from "next/navigation";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { StatusBadge, type StatusTone } from "@/components/ui/status-badge";
import { STAGE_LABEL, type ScopeExtensionApplicationRow, type ApplicationStage } from "@/lib/portal/applicant-data";

const STAGE_TONE: Record<ApplicationStage, StatusTone> = {
  DRAFT: "neutral",
  SUBMITTED: "info",
  INITIAL_REVIEW: "info",
  DOCUMENT_REVIEW: "info",
  ASSESSMENT: "warning",
  DECISION: "warning",
  ACCREDITED: "success",
  DECLINED: "error",
};

function ScopeExtensionHistory({ items }: { items: ScopeExtensionApplicationRow[] }) {
  const router = useRouter();

  if (items.length === 0) return null;

  const columns: DataTableColumn<ScopeExtensionApplicationRow>[] = [
    { key: "referenceNumber", header: "Reference", mono: true, render: (a) => a.referenceNumber },
    {
      key: "scopes",
      header: "Scope(s)",
      render: (a) => (a.additionalScopeCount > 0 ? `${a.primaryProgramName} + ${a.additionalScopeCount} more` : a.primaryProgramName),
    },
    { key: "stage", header: "Status", render: (a) => <StatusBadge tone={STAGE_TONE[a.stage]} label={STAGE_LABEL[a.stage]} size="sm" /> },
    { key: "submittedAt", header: "Submitted", mono: true, render: (a) => a.submittedAt ?? "—" },
  ];

  return (
    <div className="mb-8">
      <h2 className="font-sans text-sm font-semibold text-text">Previous Scope Extension Applications</h2>
      <div className="mt-3">
        <DataTable columns={columns} rows={items} getRowKey={(a) => a.id} onRowClick={(a) => router.push(`/cab/applicant/applications/${a.id}`)} />
      </div>
    </div>
  );
}

export { ScopeExtensionHistory };
