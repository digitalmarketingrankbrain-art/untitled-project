"use client";

import { useRouter } from "next/navigation";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import type { CbAssessmentSummary } from "@/lib/portal/cb-assessments-data";
import { STATUS_TONE, STATUS_LABEL, TYPE_LABEL } from "@/lib/portal/cb-assessments-status";

function CbAssessmentsTable({ items, basePath }: { items: CbAssessmentSummary[]; basePath: string }) {
  const router = useRouter();

  if (items.length === 0) {
    return <EmptyState title="No assessments yet." description="Scheduled and completed assessments will appear here." />;
  }

  const columns: DataTableColumn<CbAssessmentSummary>[] = [
    { key: "assessmentNumber", header: "Assessment#", mono: true, render: (a) => a.assessmentNumber },
    { key: "assessmentType", header: "Assessment Type", render: (a) => TYPE_LABEL[a.assessmentType] },
    { key: "schemeNames", header: "Scheme Name", render: (a) => a.schemeNames.join(", ") || "—" },
    { key: "status", header: "Status", render: (a) => <StatusBadge tone={STATUS_TONE[a.status]} label={STATUS_LABEL[a.status]} size="sm" /> },
  ];

  return <DataTable columns={columns} rows={items} getRowKey={(a) => a.id} onRowClick={(a) => router.push(`${basePath}/${a.id}`)} />;
}

export { CbAssessmentsTable };
