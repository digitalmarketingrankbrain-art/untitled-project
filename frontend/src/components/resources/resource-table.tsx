"use client";

import Link from "next/link";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import type { Resource } from "@/lib/resources";

const TYPE_LABEL: Record<Resource["type"], string> = {
  POLICY: "Policy",
  PROCEDURE: "Procedure",
  FORM: "Form",
};

function ResourceTable({ resources }: { resources: Resource[] }) {
  if (resources.length === 0) {
    return (
      <EmptyState
        title="No resources match your filters."
        description="Try clearing your search or browsing all resources."
      />
    );
  }

  const columns: DataTableColumn<Resource>[] = [
    {
      key: "title",
      header: "Title",
      render: (r) => (
        <Link href={`/resources/${r.slug}`} className="font-medium text-secondary hover:underline">
          {r.title}
        </Link>
      ),
    },
    { key: "type", header: "Type", render: (r) => TYPE_LABEL[r.type] },
    { key: "version", header: "Version", mono: true, render: (r) => r.version },
    { key: "effectiveDate", header: "Effective", mono: true, align: "right", render: (r) => r.effectiveDate },
  ];

  return <DataTable columns={columns} rows={resources} getRowKey={(r) => r.slug} />;
}

export { ResourceTable, TYPE_LABEL };
