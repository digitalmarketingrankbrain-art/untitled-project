"use client";

import Link from "next/link";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import type { AssessorSummary } from "@/lib/portal/admin-data";

const columns: DataTableColumn<AssessorSummary>[] = [
  {
    key: "name",
    header: "Name",
    render: (a) => (
      <Link href={`/admin/assessors/${a.userId}`} className="font-medium text-secondary hover:underline">
        {a.name}
      </Link>
    ),
  },
  { key: "email", header: "Email", render: (a) => a.email },
  { key: "activeAssignmentCount", header: "Active Assignments", align: "right", mono: true, render: (a) => String(a.activeAssignmentCount) },
  { key: "competenceCount", header: "Competence Areas", align: "right", mono: true, render: (a) => String(a.competenceCount) },
];

function AdminAssessorsTable({ assessors }: { assessors: AssessorSummary[] }) {
  return <DataTable columns={columns} rows={assessors} getRowKey={(a) => a.userId} />;
}

export { AdminAssessorsTable };
