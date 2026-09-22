"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { StatusBadge, type StatusTone } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { NC_STATUS_LABEL, type NonConformitySummary, type NcStatus } from "@/lib/portal/nc-data";

const STATUS_TONE: Record<NcStatus, StatusTone> = {
  OPEN: "warning",
  RESPONSE_SUBMITTED: "info",
  UNDER_REVIEW: "info",
  ACCEPTED: "success",
  REJECTED: "error",
  CLOSED: "success",
};

const CATEGORY_TONE: Record<NonConformitySummary["category"], StatusTone> = {
  MAJOR: "error",
  MINOR: "warning",
  OBSERVATION: "info",
};

const CATEGORY_LABEL: Record<NonConformitySummary["category"], string> = {
  MAJOR: "Major",
  MINOR: "Minor",
  OBSERVATION: "Observation",
};

function NcTable({ items, basePath }: { items: NonConformitySummary[]; basePath: string }) {
  const router = useRouter();
  const [filter, setFilter] = React.useState<"ALL" | "OPEN" | "CLOSED">("ALL");
  const [query, setQuery] = React.useState("");

  const counts = {
    ALL: items.length,
    OPEN: items.filter((n) => n.status !== "CLOSED").length,
    CLOSED: items.filter((n) => n.status === "CLOSED").length,
  };

  const visible = items.filter((n) => {
    if (filter === "OPEN" && n.status === "CLOSED") return false;
    if (filter === "CLOSED" && n.status !== "CLOSED") return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      n.ncNumber.toLowerCase().includes(q) ||
      n.standardReference.toLowerCase().includes(q) ||
      (n.assessmentReference ?? "").toLowerCase().includes(q)
    );
  });

  const columns: DataTableColumn<NonConformitySummary>[] = [
    { key: "assessmentReference", header: "Assessment#", mono: true, render: (n) => n.assessmentReference ?? "—" },
    { key: "ncNumber", header: "NC#", mono: true, render: (n) => n.ncNumber },
    { key: "category", header: "Category", render: (n) => <StatusBadge tone={CATEGORY_TONE[n.category]} label={CATEGORY_LABEL[n.category]} size="sm" /> },
    { key: "standardReference", header: "Standard", render: (n) => n.standardReference },
    { key: "raisedAt", header: "Raise Date", mono: true, render: (n) => n.raisedAt },
    { key: "status", header: "Status", render: (n) => <StatusBadge tone={STATUS_TONE[n.status]} label={NC_STATUS_LABEL[n.status]} size="sm" /> },
    { key: "progressStage", header: "Progress Stage", render: (n) => n.progressStage },
    { key: "raisedByName", header: "Raised By", render: (n) => n.raisedByName ?? "—" },
    { key: "teamLeadName", header: "Team Lead", render: (n) => n.teamLeadName ?? "—" },
  ];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-5 font-sans text-sm">
          {(["ALL", "OPEN", "CLOSED"] as const).map((key) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={filter === key ? "font-semibold text-text" : "text-text-muted hover:text-text"}
            >
              {key === "ALL" ? "All" : key === "OPEN" ? "Open" : "Closed"} : {counts[key]}
            </button>
          ))}
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search…"
          className="h-9 w-56 rounded-[6px] border border-border bg-surface px-3 font-sans text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
        />
      </div>

      {visible.length === 0 ? (
        <EmptyState title="No non-conformities found." description="Non-conformities raised during assessments will appear here." />
      ) : (
        <DataTable columns={columns} rows={visible} getRowKey={(n) => n.id} onRowClick={(n) => router.push(`${basePath}/${n.id}`)} />
      )}
    </div>
  );
}

export { NcTable };
