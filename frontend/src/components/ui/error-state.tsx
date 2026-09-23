import * as React from "react";
import { AlertOctagon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

/**
 * A system failure must never look like a "no such record" answer (Phase 7) —
 * this is visually and structurally distinct from EmptyState.
 */
function ErrorState({
  title,
  description,
  onRetry,
  retryLabel = "Try again",
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center gap-3 rounded-2xl border border-rose-200/90 bg-rose-50/40 px-6 py-12 text-center shadow-2xs",
        className,
      )}
      {...props}
    >
      <div className="flex size-12 items-center justify-center rounded-2xl bg-white border border-rose-200 shadow-2xs text-rose-600">
        <AlertOctagon className="size-6" strokeWidth={1.75} />
      </div>
      <p className="font-sans text-base font-bold text-rose-900 tracking-tight">{title}</p>
      {description && (
        <p className="max-w-md font-sans text-sm text-slate-700 leading-relaxed">{description}</p>
      )}
      {onRetry && (
        <Button variant="destructive-outline" size="sm" onClick={onRetry} className="mt-2">
          {retryLabel}
        </Button>
      )}
    </div>
  );
}

export { ErrorState };
