import { Check, Clock, AlertTriangle, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorkflowStep } from "@/lib/portal/workflow-progress-data";

const ROLE_LABEL: Record<WorkflowStep["responsibleRole"], string> = {
  ABCD: "Certification Body",
  AB: "Accreditation Body",
  ASSESSOR: "Assessor",
  "-": "",
};

/**
 * The spec's 10-step visual progress tracker (§19), composed from the real
 * sub-entity statuses by getWorkflowProgressForApplication() — for every
 * case, always answers "what stage, who needs to act, what's pending, what
 * happens next," per the spec's own framing.
 */
export function WorkflowProgressTracker({ steps }: { steps: WorkflowStep[] }) {
  return (
    <ol className="flex flex-col gap-0">
      {steps.map((s, i) => {
        const isLast = i === steps.length - 1;
        return (
          <li key={s.key} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full font-mono text-xs",
                  s.status === "COMPLETE" && "bg-success-text text-text-inverse",
                  s.status === "CURRENT" && "bg-primary text-text-inverse",
                  s.status === "BLOCKED" && "bg-error-text text-text-inverse",
                  s.status === "PENDING" && "border border-border bg-surface text-text-muted",
                  s.status === "NOT_APPLICABLE" && "border border-border bg-background-portal text-text-muted",
                )}
              >
                {s.status === "COMPLETE" && <Check className="size-4" strokeWidth={2} />}
                {s.status === "CURRENT" && <Clock className="size-4" strokeWidth={2} />}
                {s.status === "BLOCKED" && <AlertTriangle className="size-4" strokeWidth={2} />}
                {s.status === "NOT_APPLICABLE" && <Minus className="size-4" strokeWidth={2} />}
                {s.status === "PENDING" && <span>{i + 1}</span>}
              </div>
              {!isLast && (
                <span
                  aria-hidden="true"
                  className={cn("w-px flex-1", s.status === "COMPLETE" ? "bg-success-text" : "bg-border")}
                  style={{ minHeight: "1.5rem" }}
                />
              )}
            </div>
            <div className="min-w-0 flex-1 pb-6">
              <p
                className={cn(
                  "font-sans text-sm",
                  s.status === "CURRENT" || s.status === "BLOCKED" ? "font-semibold text-text" : "text-text",
                  s.status === "NOT_APPLICABLE" && "text-text-muted",
                )}
              >
                {s.label}
              </p>
              {s.pendingAction && (
                <p className={cn("mt-0.5 font-sans text-xs", s.status === "BLOCKED" ? "text-error-text" : "text-text-muted")}>
                  {s.pendingAction}
                  {s.responsibleRole !== "-" && <span className="font-medium"> — {ROLE_LABEL[s.responsibleRole]}</span>}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
