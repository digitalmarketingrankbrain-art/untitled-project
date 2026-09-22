"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, Search, SearchX, X } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import type { ApplicationRequestSummary } from "@/lib/portal/application-requests-data";
import {
  APPLY_FOR_LABEL,
  REQUEST_STATUS_LABEL,
  REQUEST_STATUS_TONE,
  formatShortDate,
} from "@/lib/portal/application-request-status";
import { cn } from "@/lib/utils";

const FOCUS_RING = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary";

/** Column template shared by the header and every row on wide screens. */
const GRID = "md:grid md:grid-cols-[minmax(0,2.4fr)_minmax(0,1.9fr)_minmax(0,1.7fr)_9.5rem_7.5rem_1rem] md:items-center md:gap-x-5";

const AVATAR_TONES = [
  "bg-info-surface text-info-text",
  "bg-success-surface text-success-text",
  "bg-warning-surface text-warning-text",
  "bg-background-portal text-secondary",
];

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? (parts[1]?.[0] ?? "") : "")).toUpperCase() || "?";
}

/** Same organisation always gets the same tint, so rows are easy to tell apart at a glance. */
function avatarTone(seed: string): string {
  let hash = 0;
  for (const ch of seed) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return AVATAR_TONES[hash % AVATAR_TONES.length]!;
}

function timeAgo(iso: string, now: number): string | null {
  const minutes = Math.floor((now - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} d ago`;
  return null;
}

function OrgCell({ r }: { r: ApplicationRequestSummary }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span
        aria-hidden
        className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg font-sans text-sm font-semibold", avatarTone(r.companyName))}
      >
        {initials(r.companyName)}
      </span>
      <div className="min-w-0">
        <p className="break-words font-sans text-sm font-semibold text-text md:truncate">{r.companyName}</p>
        <p className="mt-0.5 break-words font-mono text-xs text-text-muted md:truncate">{r.referenceId}</p>
      </div>
    </div>
  );
}

function ApplyingFor({ ids }: { ids: string[] }) {
  const labels = ids.map((id) => APPLY_FOR_LABEL[id] ?? id);
  const [first, ...rest] = labels;
  return (
    <div className="flex min-w-0 items-center gap-1.5">
      <span className="truncate rounded-md bg-background-portal px-2 py-1 font-sans text-xs font-medium text-text">{first ?? "—"}</span>
      {rest.length > 0 && (
        <span className="shrink-0 font-sans text-xs font-medium text-text-muted" title={rest.join(", ")}>
          +{rest.length}
        </span>
      )}
    </div>
  );
}

interface Props {
  rows: ApplicationRequestSummary[];
  /** The status tabs, rendered by the server page and placed on the left of the toolbar. */
  tabs: React.ReactNode;
  /** Shown when the selected tab has nothing in it (rendered by the server page, which knows which tab this is). */
  empty: React.ReactNode;
}

function AdminApplicationRequestsTable({ rows, tabs, empty }: Props) {
  const [query, setQuery] = React.useState("");
  // Relative times depend on the clock, so they are filled in after mount; the server render shows plain dates.
  const [now, setNow] = React.useState<number | null>(null);
  React.useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const q = query.trim().toLowerCase();
  const visible = q
    ? rows.filter((r) => [r.companyName, r.contactName, r.email, r.referenceId].some((v) => v.toLowerCase().includes(q)))
    : rows;

  return (
    <div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        {tabs}
        {rows.length > 0 && (
          <div className="relative w-full sm:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" strokeWidth={1.75} aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search organisation or email"
              aria-label="Search application requests"
              className="h-10 w-full rounded-lg border border-border bg-surface pl-9 pr-9 font-sans text-sm text-text placeholder:text-text-muted transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-background-portal hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <X className="size-3.5" strokeWidth={2} aria-hidden />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-4">
        {rows.length === 0 ? (
          empty
        ) : visible.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title={`No requests match “${query.trim()}”`}
            description="Check the spelling, or try an organisation name, contact name, email or reference number."
            className="bg-white rounded-2xl border border-slate-200/80 p-8"
            action={
              <button
                type="button"
                onClick={() => setQuery("")}
                className="rounded-xl bg-blue-50 px-3.5 py-1.5 font-sans text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
              >
                Clear search
              </button>
            }
          />
        ) : (
          <>
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
              {/* Column headers (wide screens) */}
              <div className={cn("hidden border-b border-slate-200/80 bg-slate-50/80 px-5 py-3 font-sans text-[11px] font-bold uppercase tracking-wider text-slate-400", GRID)}>
                <span>Organisation</span>
                <span>Contact</span>
                <span>Applying for</span>
                <span>Status</span>
                <span className="text-right">Submitted</span>
                <span />
              </div>

              <ul className="divide-y divide-slate-100">
                {visible.map((r) => {
                  const ago = now === null ? null : timeAgo(r.createdAt, now);
                  return (
                    <li key={r.id}>
                      <Link
                        href={`/admin/application-requests/${r.id}`}
                        className={cn("group block px-4 py-4 transition-colors duration-150 hover:bg-slate-50/80 md:px-5", GRID, FOCUS_RING)}
                      >
                        {/* Phones: organisation + status on the first line, the rest stacked beneath. */}
                        <div className="flex items-start justify-between gap-3 md:contents">
                          <OrgCell r={r} />
                          <span className="shrink-0 md:hidden">
                            <StatusBadge tone={REQUEST_STATUS_TONE[r.status]} label={REQUEST_STATUS_LABEL[r.status]} size="sm" />
                          </span>
                        </div>

                        <div className="mt-2 min-w-0 md:mt-0">
                          <p className="truncate font-sans text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">{r.contactName}</p>
                          <p className="truncate font-sans text-xs text-slate-500">{r.email}</p>
                        </div>

                        <div className="mt-2 md:mt-0">
                          <ApplyingFor ids={r.applyFor} />
                        </div>

                        <div className="hidden md:block">
                          <StatusBadge tone={REQUEST_STATUS_TONE[r.status]} label={REQUEST_STATUS_LABEL[r.status]} size="sm" />
                        </div>

                        <div className="mt-2 flex items-baseline gap-2 md:mt-0 md:block md:text-right">
                          <time
                            dateTime={r.createdAt}
                            suppressHydrationWarning
                            className="block font-sans text-sm font-medium text-slate-800 md:whitespace-nowrap"
                          >
                            {ago ?? formatShortDate(r.createdAt)}
                          </time>
                          {ago && <span className="font-mono text-xs text-slate-400 md:block">{formatShortDate(r.createdAt)}</span>}
                        </div>

                        <ChevronRight
                          className="hidden size-4 text-slate-400 transition-transform duration-150 group-hover:translate-x-1 group-hover:text-blue-700 md:block"
                          strokeWidth={2}
                          aria-hidden
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {q && (
              <p className="mt-3 font-sans text-xs text-text-muted" aria-live="polite">
                Showing {visible.length} of {rows.length}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export { AdminApplicationRequestsTable };
