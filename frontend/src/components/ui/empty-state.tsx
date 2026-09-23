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
        "flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200/90 bg-slate-50/40 px-6 py-12 text-center shadow-2xs",
        className,
      )}
      {...props}
    >
      <div className="flex size-12 items-center justify-center rounded-2xl bg-white border border-slate-200/80 shadow-2xs text-slate-500">
        <Icon className="size-6" strokeWidth={1.5} />
      </div>
      <p className="font-sans text-base font-bold text-slate-900 tracking-tight">{title}</p>
      {description && (
        <p className="max-w-md font-sans text-sm text-slate-500 leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export { EmptyState };
