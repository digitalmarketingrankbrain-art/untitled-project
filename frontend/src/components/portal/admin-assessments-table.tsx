"use client";

import Link from "next/link";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { StatusBadge, type StatusTone } from "@/components/ui/status-badge";
import { ASSIGNMENT_STATUS_LABEL, type Assignment, type AssignmentStatus } from "@/lib/portal/assessor-data";

const STATUS_TONE: Record<AssignmentStatus, StatusTone> = {
  PENDING: "warning",
  ACCEPTED: "info",
  DECLINED: "neutral",
  IN_PROGRESS: "info",
  REPORT_SUBMITTED: "success",
  COMPLETED: "success",
};

const columns: DataTableColumn<Assignment>[] = [
  {
    key: "organisationName",
    header: "Organisation",
    render: (a) => (
      <Link href={`/admin/assessments/${a.id}`} className="font-medium text-secondary hover:underline">
        {a.organisationName}
      </Link>
    ),
  },
  { key: "applicationReference", header: "Application", mono: true, render: (a) => a.applicationReference },
  { key: "programName", header: "Scheme", render: (a) => a.programName },
  { key: "status", header: "Status", render: (a) => <StatusBadge tone={STATUS_TONE[a.status]} label={ASSIGNMENT_STATUS_LABEL[a.status]} /> },
  { key: "reportStatus", header: "Report", mono: true, render: (a) => a.reportStatus },
  { key: "dueDate", header: "Due", mono: true, render: (a) => a.dueDate },
];

export function AdminAssessmentsTable({ assignments }: { assignments: Assignment[] }) {
  return <DataTable columns={columns} rows={assignments} getRowKey={(a) => a.id} />;
}
