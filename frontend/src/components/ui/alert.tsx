import * as React from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StatusTone } from "./status-badge";

const toneStyles: Record<Exclude<StatusTone, "neutral">, string> = {
  success: "border-success-text bg-success-surface text-success-text",
  warning: "border-warning-text bg-warning-surface text-warning-text",
  error: "border-error-text bg-error-surface text-error-text",
  info: "border-info-text bg-info-surface text-info-text",
};

const toneIcons: Record<Exclude<StatusTone, "neutral">, typeof Info> = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
};

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  tone: Exclude<StatusTone, "neutral">;
  title?: string;
}

function Alert({ tone, title, className, children, ...props }: AlertProps) {
  const Icon = toneIcons[tone];
  return (
    <div
      role="alert"
      className={cn(
        "flex gap-3 rounded-md border-l-4 px-4 py-3 font-sans text-sm",
        toneStyles[tone],
        className,
      )}
      {...props}
    >
      <Icon className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
      <div className="flex flex-col gap-0.5">
        {title && <p className="font-medium">{title}</p>}
        <div className="text-text">{children}</div>
      </div>
    </div>
  );
}

export { Alert };
