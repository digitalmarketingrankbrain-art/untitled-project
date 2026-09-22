"use client";

import Link from "next/link";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { StatusBadge, VERIFICATION_STATUS } from "@/components/ui/status-badge";
import type { VerificationRecord } from "@/lib/verification-records";

const columns: DataTableColumn<VerificationRecord>[] = [
  {
    key: "organisationName",
    header: "Organisation",
    render: (r) => (
      <Link href={`/admin/accreditation-records/${r.reference}`} className="font-medium text-secondary hover:underline">
        {r.organisationName}
      </Link>
    ),
  },
  { key: "programName", header: "Program", render: (r) => r.programName },
  { key: "reference", header: "Reference", mono: true, render: (r) => r.reference },
  {
    key: "status",
    header: "Status",
    render: (r) => {
      const s = VERIFICATION_STATUS[r.status];
      return <StatusBadge tone={s.tone} label={s.label} size="sm" />;
    },
  },
  {
    key: "published",
    header: "Public",
    render: (r) => (
      <span className={r.isPublished ? "text-xs text-success-text" : "text-xs text-text-muted"}>
        {r.isPublished ? "Published" : "Unpublished"}
      </span>
    ),
  },
];

function AdminAccreditationRecordsTable({ records }: { records: VerificationRecord[] }) {
  return <DataTable columns={columns} rows={records} getRowKey={(r) => r.reference} />;
}

export { AdminAccreditationRecordsTable };
