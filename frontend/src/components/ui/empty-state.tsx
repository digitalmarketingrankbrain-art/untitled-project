import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { SearchX } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

/** Icon + one-sentence explanation + a specific next action — never a bare "No results." */
function EmptyState({
  icon: Icon = SearchX,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-lg border border-dashed border-border px-6 py-12 text-center",
        className,
      )}
      {...props}
    >
      <Icon className="size-8 text-text-muted" strokeWidth={1.5} />
      <p className="font-sans text-base font-medium text-text">{title}</p>
      {description && (
        <p className="max-w-sm font-sans text-sm text-text-muted">{description}</p>
      )}
      {action}
    </div>
  );
}

export { EmptyState };
