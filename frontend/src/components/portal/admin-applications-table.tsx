"use client";

import { useRouter } from "next/navigation";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { StatusBadge, type StatusTone } from "@/components/ui/status-badge";
import { STAGE_LABEL, type Application, type ApplicationStage } from "@/lib/portal/applicant-data";

const STAGE_TONE: Record<ApplicationStage, StatusTone> = {
  DRAFT: "neutral",
  SUBMITTED: "info",
  INITIAL_REVIEW: "info",
  DOCUMENT_REVIEW: "warning",
  ASSESSMENT: "info",
  DECISION: "warning",
  ACCREDITED: "success",
  DECLINED: "error",
};

interface Row extends Application {
  organisationName: string;
}

function AdminApplicationsTable({ rows }: { rows: Row[] }) {
  const router = useRouter();

  const columns: DataTableColumn<Row>[] = [
    { key: "organisationName", header: "Organisation", render: (a) => a.organisationName },
    { key: "programName", header: "Program", render: (a) => a.programName },
    { key: "referenceNumber", header: "Reference", mono: true, render: (a) => a.referenceNumber },
    {
      key: "stage",
      header: "Stage",
      render: (a) => <StatusBadge tone={STAGE_TONE[a.stage]} label={STAGE_LABEL[a.stage]} size="sm" />,
    },
    {
      key: "flag",
      header: "",
      render: (a) => (a.infoRequested ? <span className="text-xs font-medium text-warning-text">Action needed</span> : null),
    },
    { key: "updatedAt", header: "Updated", mono: true, align: "right", render: (a) => a.updatedAt },
  ];

  return (
    <DataTable
      columns={columns}
      rows={rows}
      getRowKey={(a) => a.id}
      onRowClick={(a) => router.push(`/admin/applications/${a.id}`)}
    />
  );
}

export { AdminApplicationsTable };
