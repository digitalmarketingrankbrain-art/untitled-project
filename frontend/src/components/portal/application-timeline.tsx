import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  APPLICATION_STAGE_ORDER,
  STAGE_LABEL,
  type ApplicationStage,
} from "@/lib/portal/applicant-data";

/**
 * ApplicationTimeline renders the stage-by-stage progression of an application.
 * Highlights complete, active, and upcoming stages cleanly without line cut-throughs.
 */
function ApplicationTimeline({ stage }: { stage: ApplicationStage }) {
  const isDeclined = stage === "DECLINED";
  const currentIndex = isDeclined
    ? APPLICATION_STAGE_ORDER.length - 1
    : APPLICATION_STAGE_ORDER.indexOf(stage);

  return (
    <ol className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between py-2 min-w-[600px] sm:min-w-0">
      {APPLICATION_STAGE_ORDER.map((s, i) => {
        const isComplete =
          i < currentIndex ||
          (i === currentIndex && !isDeclined && stage === "ACCREDITED");
        const isCurrent = i === currentIndex && !isDeclined;
        const isLast = i === APPLICATION_STAGE_ORDER.length - 1;

        return (
          <li
            key={s}
            className="relative flex flex-row items-start gap-4 sm:flex-1 sm:flex-col sm:items-center sm:gap-0 group"
          >
            {/* Desktop horizontal connecting line to next step */}
            {!isLast && (
              <div
                aria-hidden="true"
                className={cn(
                  "absolute left-1/2 top-4 hidden h-[2px] w-full -translate-y-1/2 sm:block z-0 transition-colors duration-200",
                  isComplete ? "bg-emerald-600" : "bg-slate-200"
                )}
              />
            )}

            {/* Mobile vertical connecting line to next step */}
            {!isLast && (
              <div
                aria-hidden="true"
                className={cn(
                  "absolute left-4 top-8 block h-[calc(100%+1.5rem)] w-[2px] -translate-x-1/2 sm:hidden z-0 transition-colors duration-200",
                  isComplete ? "bg-emerald-600" : "bg-slate-200"
                )}
              />
            )}

            {/* Step Circle */}
            <div
              className={cn(
                "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full font-mono text-xs transition-all duration-200",
                isComplete && "bg-emerald-600 text-white shadow-xs",
                isCurrent &&
                  "bg-primary text-white ring-4 ring-blue-100 shadow-xs font-bold scale-105",
                !isComplete &&
                  !isCurrent &&
                  "border-2 border-slate-200 bg-white text-slate-400 font-medium"
              )}
            >
              {isComplete ? (
                <Check className="size-4" strokeWidth={2.5} />
              ) : (
                i + 1
              )}
            </div>

            {/* Step Label */}
            <p
              className={cn(
                "pt-1 font-sans text-xs px-1 leading-tight sm:pt-3 sm:text-center",
                isCurrent
                  ? "font-semibold text-slate-900"
                  : isComplete
                  ? "font-medium text-slate-700"
                  : "font-normal text-slate-400"
              )}
            >
              {STAGE_LABEL[s]}
            </p>
          </li>
        );
      })}

      {isDeclined && (
        <li className="relative flex flex-row items-start gap-4 sm:flex-1 sm:flex-col sm:items-center sm:gap-0">
          <div className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full bg-red-600 font-mono text-xs font-bold text-white ring-4 ring-red-100 shadow-xs">
            !
          </div>
          <p className="pt-1 font-sans text-xs font-semibold text-red-600 sm:pt-3 sm:text-center">
            Declined
          </p>
        </li>
      )}
    </ol>
  );
}

export { ApplicationTimeline };

