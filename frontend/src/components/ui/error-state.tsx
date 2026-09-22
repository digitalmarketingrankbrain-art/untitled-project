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
        "flex flex-col items-center gap-3 rounded-lg border border-error-text/30 bg-error-surface px-6 py-12 text-center",
        className,
      )}
      {...props}
    >
      <AlertOctagon className="size-8 text-error-text" strokeWidth={1.5} />
      <p className="font-sans text-base font-medium text-error-text">{title}</p>
      {description && (
        <p className="max-w-sm font-sans text-sm text-text">{description}</p>
      )}
      {onRetry && (
        <Button variant="destructive-outline" size="sm" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
}

export { ErrorState };
