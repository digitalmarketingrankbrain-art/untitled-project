import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { StatusBadge, type StatusTone } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import type { AssignedAssessorEntry } from "@/lib/portal/cab-info-data";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Awaiting response",
  ACCEPTED: "Accepted",
  IN_PROGRESS: "In progress",
  REPORT_SUBMITTED: "Report submitted",
  COMPLETED: "Completed",
};
const STATUS_TONE: Record<string, StatusTone> = {
  PENDING: "warning",
  ACCEPTED: "info",
  IN_PROGRESS: "info",
  REPORT_SUBMITTED: "info",
  COMPLETED: "success",
};

/** Read-only: the assessors the accreditation body has assigned to this CAB's applications. */
function AssessorMembersTable({ assessors }: { assessors: AssignedAssessorEntry[] }) {
  if (assessors.length === 0) {
    return (
      <EmptyState
        title="No assessors assigned yet"
        description="Assessors appear here once the accreditation body assigns them to one of your applications."
      />
    );
  }

  const columns: DataTableColumn<AssignedAssessorEntry>[] = [
    { key: "assessorName", header: "Assessor", render: (a) => a.assessorName },
    { key: "assessorEmail", header: "Email", render: (a) => a.assessorEmail },
    { key: "programName", header: "Program", render: (a) => a.programName },
    { key: "applicationReference", header: "Application", mono: true, render: (a) => a.applicationReference },
    {
      key: "assignmentStatus",
      header: "Status",
      render: (a) => (
        <StatusBadge
          tone={STATUS_TONE[a.assignmentStatus] ?? "neutral"}
          label={STATUS_LABEL[a.assignmentStatus] ?? a.assignmentStatus}
          size="sm"
        />
      ),
    },
    { key: "assignedByName", header: "Assigned by", render: (a) => a.assignedByName },
    { key: "assignedAt", header: "Assigned", mono: true, align: "right", render: (a) => a.assignedAt.slice(0, 10) },
  ];

  return <DataTable columns={columns} rows={assessors} getRowKey={(a) => a.id} />;
}

export { AssessorMembersTable };
