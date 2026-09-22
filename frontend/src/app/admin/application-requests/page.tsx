import Link from "next/link";
import { CheckCircle2, Inbox, XCircle, type LucideIcon } from "lucide-react";
import { AdminApplicationRequestsTable } from "@/components/portal/admin-application-requests-table";
import { EmptyState } from "@/components/ui/empty-state";
import { listApplicationRequests, type ApplicationRequestStatus } from "@/lib/portal/application-requests-data";
import { cn } from "@/lib/utils";

type FilterKey = ApplicationRequestStatus | "ALL";

const FILTERS: { key: FilterKey; label: string; param: string }[] = [
  { key: "PENDING", label: "Pending", param: "PENDING" },
  { key: "APPROVED", label: "Approved", param: "APPROVED" },
  { key: "REJECTED", label: "Rejected", param: "REJECTED" },
  { key: "ALL", label: "All", param: "all" },
];

/** What to say when a tab has nothing in it: what the tab is for, so an empty list never reads as broken. */
const EMPTY: Record<FilterKey, { icon: LucideIcon; title: string; description: string }> = {
  PENDING: {
    icon: Inbox,
    title: "No pending requests",
    description: "You're all caught up. New applications from the public Apply page will show up here for review.",
  },
  APPROVED: {
    icon: CheckCircle2,
    title: "No approved requests yet",
    description: "Requests you approve are listed here, along with the account that was created for the organisation.",
  },
  REJECTED: {
    icon: XCircle,
    title: "No rejected requests",
    description: "Requests you reject are listed here, together with the reason that was sent to the applicant.",
  },
  ALL: {
    icon: Inbox,
    title: "No application requests yet",
    description: "When an organisation submits the Application Request Form, it will appear here.",
  },
};

export default async function AdminApplicationRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const active: FilterKey = FILTERS.find((f) => f.param === status)?.key ?? "PENDING";

  // One fetch: the tab counts and the visible rows both come from it.
  const all = await listApplicationRequests();
  const counts: Record<FilterKey, number> = {
    PENDING: all.filter((r) => r.status === "PENDING").length,
    APPROVED: all.filter((r) => r.status === "APPROVED").length,
    REJECTED: all.filter((r) => r.status === "REJECTED").length,
    ALL: all.length,
  };
  const rows = active === "ALL" ? all : all.filter((r) => r.status === active);
  const empty = EMPTY[active];

  return (
    <div className="px-6 py-8">
      <h1 className="font-display text-2xl font-semibold text-text">Application Requests</h1>
      <p className="mt-1 max-w-2xl font-sans text-sm text-text-muted">
        Organisations asking to become a certification body. Approve to create their account, or reject with a reason.
      </p>

      <AdminApplicationRequestsTable
        rows={rows}
        tabs={
      <nav
        aria-label="Filter application requests"
        className="inline-flex max-w-full flex-wrap gap-1 rounded-lg border border-border bg-background-portal p-1"
      >
        {FILTERS.map((f) => {
          const isActive = f.key === active;
          return (
            <Link
              key={f.key}
              href={`/admin/application-requests?status=${f.param}`}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "inline-flex items-center gap-2 rounded-md px-3 py-1.5 font-sans text-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
                isActive ? "bg-surface text-text shadow-sm" : "text-text-muted hover:text-text",
              )}
            >
              {f.label}
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 font-mono text-xs font-semibold",
                  f.key === "PENDING" && counts.PENDING > 0 ? "bg-warning-surface text-warning-text" : "bg-border/60 text-text-muted",
                )}
              >
                {counts[f.key]}
              </span>
            </Link>
          );
        })}
      </nav>
        }
        empty={
          <EmptyState
            icon={empty.icon}
            title={empty.title}
            description={empty.description}
            className="bg-surface"
            action={
              active !== "PENDING" && counts.PENDING > 0 ? (
                <Link
                  href="/admin/application-requests?status=PENDING"
                  className="rounded-sm font-sans text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
                >
                  View {counts.PENDING} pending {counts.PENDING === 1 ? "request" : "requests"}
                </Link>
              ) : undefined
            }
          />
        }
      />
    </div>
  );
}
