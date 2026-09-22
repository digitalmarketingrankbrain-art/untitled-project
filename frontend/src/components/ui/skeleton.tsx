import { cn } from "@/lib/utils";

/** Skeleton placeholder for content-heavy views, per Phase 4 — never a full-page blocking spinner for partial loads. */
function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-border/60", className)} />;
}

/** A page heading + a few lines of body text. */
function SkeletonHeading() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-7 w-64" />
      <Skeleton className="h-4 w-96 max-w-full" />
    </div>
  );
}

/** A DataTable-shaped placeholder — header row + N body rows of aligned bars. */
function SkeletonTable({ rows = 6, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="flex gap-4 border-b border-border bg-background-portal px-4 py-3">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-3 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 border-b border-border px-4 py-4 last:border-b-0">
          {Array.from({ length: columns }).map((_, c) => (
            <Skeleton key={c} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

/** A Card-shaped placeholder for dashboard summary tiles. */
function SkeletonCard() {
  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <Skeleton className="mb-3 h-5 w-32" />
      <Skeleton className="h-8 w-16" />
    </div>
  );
}

export { Skeleton, SkeletonHeading, SkeletonTable, SkeletonCard };
