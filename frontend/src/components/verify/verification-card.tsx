import Link from "next/link";
import { StatusBadge, VERIFICATION_STATUS } from "@/components/ui/status-badge";
import { CopyLinkButton, PrintButton } from "./page-actions";
import { STATUS_EXPLANATION, type VerificationRecord } from "@/lib/verification-records";

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-3 last:border-b-0">
      <span className="font-sans text-sm text-text-muted">{label}</span>
      <span className="font-mono text-sm text-text">{value}</span>
    </div>
  );
}

/**
 * Shared layout for the 4 real statuses (Active/Suspended/Withdrawn/
 * Expired) — status badge is the first, most dominant element, above the
 * organisation's own name, per Phase 7.
 */
function VerificationCard({
  record,
  lastVerifiedAt,
}: {
  record: VerificationRecord;
  lastVerifiedAt: string;
}) {
  const s = VERIFICATION_STATUS[record.status];
  const explanation =
    record.status === "EXPIRED"
      ? `${STATUS_EXPLANATION.EXPIRED} It was valid from ${record.effectiveDate} to ${record.expiryDate}.`
      : STATUS_EXPLANATION[record.status];

  return (
    <div className="rounded-lg border border-border bg-surface">
      <div className="border-b border-border px-6 py-6 sm:px-8 sm:py-8">
        <StatusBadge tone={s.tone} label={s.label} size="lg" />
        <p className="mt-2 max-w-xl font-sans text-sm text-text-muted">{explanation}</p>
        <h1 className="mt-4 font-display text-2xl font-semibold text-text sm:text-3xl">
          {record.organisationName}
        </h1>
        <p className="mt-1 font-mono text-sm text-text-muted">{record.reference}</p>
      </div>

      <div className="px-6 py-4 sm:px-8">
        <div className="flex items-center justify-between border-b border-border py-3">
          <span className="font-sans text-sm text-text-muted">Program</span>
          <Link
            href={`/accreditation/programs/${record.programSlug}`}
            className="font-sans text-sm text-secondary hover:underline"
          >
            {record.programName}
          </Link>
        </div>
        <DetailRow label="Effective date" value={record.effectiveDate} />
        {record.expiryDate && <DetailRow label="Expiry date" value={record.expiryDate} />}
        {record.lastSurveillanceDate && (
          <DetailRow label="Last surveillance" value={record.lastSurveillanceDate} />
        )}
        {record.nextRenewalDate && (
          <DetailRow label="Next renewal due" value={record.nextRenewalDate} />
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-6 py-4 sm:px-8">
        <div className="flex flex-col gap-1">
          <p className="font-sans text-xs text-text-muted">
            Last verified against our records: {lastVerifiedAt}
          </p>
          {record.certificateVisible ? (
            <Link href="#" className="font-sans text-xs text-secondary hover:underline">
              View certificate
            </Link>
          ) : (
            <p className="font-sans text-xs text-text-muted">
              Certificate document not publicly available for this record.
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <CopyLinkButton />
          <PrintButton />
        </div>
      </div>
    </div>
  );
}

export { VerificationCard };
