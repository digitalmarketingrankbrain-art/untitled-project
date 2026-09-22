"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
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

const FILTERS: { key: "ALL" | AssignmentStatus; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "PENDING", label: "Pending" },
  { key: "IN_PROGRESS", label: "In progress" },
  { key: "REPORT_SUBMITTED", label: "Report submitted" },
  { key: "COMPLETED", label: "Completed" },
];

function AssignmentsTable({ assignments }: { assignments: Assignment[] }) {
  const router = useRouter();
  const [filter, setFilter] = React.useState<"ALL" | AssignmentStatus>("ALL");

  const filtered = filter === "ALL" ? assignments : assignments.filter((a) => a.status === filter);
  const sorted = [...filtered].sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const columns: DataTableColumn<Assignment>[] = [
    { key: "organisationName", header: "Organisation", render: (a) => a.organisationName },
    { key: "programName", header: "Program", render: (a) => a.programName },
    {
      key: "status",
      header: "Status",
      render: (a) => <StatusBadge tone={STATUS_TONE[a.status]} label={ASSIGNMENT_STATUS_LABEL[a.status]} size="sm" />,
    },
    { key: "dueDate", header: "Due", mono: true, align: "right", render: (a) => a.dueDate },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-3 py-1 font-sans text-xs font-medium ${
              filter === f.key ? "bg-primary text-text-inverse" : "bg-background-portal text-text-muted hover:text-text"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <DataTable
        columns={columns}
        rows={sorted}
        getRowKey={(a) => a.id}
        onRowClick={(a) => router.push(`/assessor/assignments/${a.id}`)}
      />
    </div>
  );
}

export { AssignmentsTable };
