"use client";

import Link from "next/link";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import type { OrganisationSummary } from "@/lib/portal/admin-data";

const columns: DataTableColumn<OrganisationSummary>[] = [
  {
    key: "organisationName",
    header: "Organisation",
    render: (o) => (
      <Link href={`/admin/organisations/${o.userId}`} className="font-medium text-secondary hover:underline">
        {o.organisationName}
      </Link>
    ),
  },
  { key: "contactName", header: "Primary Contact", render: (o) => o.contactName },
  { key: "contactEmail", header: "Email", render: (o) => o.contactEmail },
  { key: "applicationCount", header: "Applications", align: "right", mono: true, render: (o) => String(o.applicationCount) },
  { key: "accreditationCount", header: "Accreditation Records", align: "right", mono: true, render: (o) => String(o.accreditationCount) },
];

function AdminOrganisationsTable({ organisations }: { organisations: OrganisationSummary[] }) {
  return <DataTable columns={columns} rows={organisations} getRowKey={(o) => o.userId} />;
}

export { AdminOrganisationsTable };
