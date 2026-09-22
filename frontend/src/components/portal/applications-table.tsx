"use client";

import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { useRouter } from "next/navigation";
import { STAGE_LABEL, type Application } from "@/lib/portal/applicant-data";
import { StatusBadge } from "@/components/ui/status-badge";

const STAGE_TONE: Record<string, "success" | "warning" | "info" | "neutral"> = {
  DRAFT: "neutral",
  SUBMITTED: "info",
  INITIAL_REVIEW: "info",
  DOCUMENT_REVIEW: "warning",
  ASSESSMENT: "info",
  DECISION: "info",
  ACCREDITED: "success",
  DECLINED: "warning",
};

function ApplicationsTable({ applications }: { applications: Application[] }) {
  const router = useRouter();

  const columns: DataTableColumn<Application>[] = [
    { key: "programName", header: "Program", render: (a) => a.programName },
    { key: "referenceNumber", header: "Reference", mono: true, render: (a) => a.referenceNumber },
    {
      key: "stage",
      header: "Stage",
      render: (a) => (
        <StatusBadge tone={STAGE_TONE[a.stage] ?? "neutral"} label={STAGE_LABEL[a.stage]} size="sm" />
      ),
    },
    { key: "updatedAt", header: "Last updated", mono: true, align: "right", render: (a) => a.updatedAt },
    {
      key: "action",
      header: "",
      render: (a) => (a.infoRequested ? <span className="text-xs font-medium text-warning-text">Action needed</span> : null),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={applications}
      getRowKey={(a) => a.id}
      onRowClick={(a) => router.push(`/cab/applicant/applications/${a.id}`)}
    />
  );
}

export { ApplicationsTable };
