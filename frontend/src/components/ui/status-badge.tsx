import * as React from "react";
import {
  CheckCircle2,
  PauseCircle,
  XCircle,
  Clock,
  Circle,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type StatusTone = "success" | "warning" | "error" | "info" | "neutral";

const toneStyles: Record<StatusTone, string> = {
  success: "bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-xs",
  warning: "bg-amber-50 text-amber-700 border border-amber-200/80 shadow-xs",
  error: "bg-rose-50 text-rose-700 border border-rose-200/80 shadow-xs",
  info: "bg-blue-50 text-blue-700 border border-blue-200/80 shadow-xs",
  neutral: "bg-slate-100 text-slate-700 border border-slate-200/80 shadow-xs",
};

const toneIcons: Record<StatusTone, LucideIcon> = {
  success: CheckCircle2,
  warning: PauseCircle,
  error: XCircle,
  info: Clock,
  neutral: Circle,
};

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone: StatusTone;
  label: string;
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  showDot?: boolean;
}

const sizeStyles: Record<NonNullable<StatusBadgeProps["size"]>, string> = {
  sm: "px-2.5 py-0.5 text-xs font-semibold tracking-wide",
  md: "px-3 py-1 text-xs font-semibold tracking-wide",
  lg: "px-3.5 py-1.5 text-sm font-semibold tracking-wide",
};

const iconSizeStyles: Record<NonNullable<StatusBadgeProps["size"]>, string> = {
  sm: "size-3.5",
  md: "size-4",
  lg: "size-4.5",
};

/**
 * Status is always colour + icon + label per Phase 4/7 — never colour alone.
 */
function StatusBadge({
  tone,
  label,
  size = "md",
  icon,
  className,
  showDot = false,
  ...props
}: StatusBadgeProps) {
  const Icon = icon ?? toneIcons[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-sans transition-all duration-200",
        toneStyles[tone],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {showDot ? (
        <span className="relative flex size-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-current" />
        </span>
      ) : (
        <Icon className={iconSizeStyles[size]} strokeWidth={2} />
      )}
      <span>{label}</span>
    </span>
  );
}

/** Verification statuses per Phase 7 — exact tone/label mapping. */
export const VERIFICATION_STATUS: Record<
  "ACTIVE" | "SUSPENDED" | "WITHDRAWN" | "CANCELLED" | "EXPIRED",
  { tone: StatusTone; label: string }
> = {
  ACTIVE: { tone: "success", label: "Active" },
  SUSPENDED: { tone: "warning", label: "Suspended" },
  WITHDRAWN: { tone: "error", label: "Withdrawn" },
  CANCELLED: { tone: "error", label: "Cancelled" },
  EXPIRED: { tone: "info", label: "Expired" },
};

export { StatusBadge };
