import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { VERIFICATION_STATUS } from "@/components/ui/status-badge";
import type { VerificationRecord } from "@/lib/verification-records";

function ResultsList({ results }: { results: VerificationRecord[] }) {
  return (
    <ul className="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface">
      {results.map((record) => {
        const s = VERIFICATION_STATUS[record.status];
        return (
          <li key={record.reference}>
            <Link
              href={`/verify/${record.reference}`}
              className="flex flex-col gap-2 px-5 py-4 hover:bg-background-portal sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-sans text-sm font-semibold text-text">{record.organisationName}</p>
                <p className="mt-0.5 font-sans text-xs text-text-muted">{record.programName}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-text-muted">{record.reference}</span>
                <StatusBadge tone={s.tone} label={s.label} size="sm" />
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export { ResultsList };
