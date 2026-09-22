import Link from "next/link";
import { auth } from "@/auth";
import { StatusBadge, VERIFICATION_STATUS } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { STATUS_EXPLANATION } from "@/lib/verification-records";
import { getAccreditationRecordsForUser } from "@/lib/portal/accreditation-record-data";
import { getCertificatesForUser } from "@/lib/portal/certificate-data";

/**
 * Uses the identical status badge system as the public /verify page —
 * an applicant should recognise their own status as the same thing the
 * public sees, not a different private truth (Phase 8).
 */
export default async function AccreditationPage() {
  const session = await auth();
  const [accreditation] = await getAccreditationRecordsForUser(session!.user.id);
  const certificates = await getCertificatesForUser(session!.user.id);

  return (
    <div className="px-6 py-8">
      <h1 className="font-display text-2xl font-semibold text-text">Accreditation</h1>

      {certificates.length > 0 && (
        <div className="mt-6 max-w-lg rounded-lg border border-border bg-surface p-6">
          <h2 className="font-sans text-sm font-semibold text-text">Issued Certificates</h2>
          <ul className="mt-3 flex flex-col gap-2">
            {certificates.map((c) => (
              <li key={c.id} className="flex items-center justify-between rounded-md border border-border px-4 py-2">
                <div>
                  <p className="font-mono text-sm text-text">{c.certificateNumber}</p>
                  <p className="font-sans text-xs text-text-muted">
                    {c.status} · v{c.version} · valid until {c.validUntil ?? "—"}
                  </p>
                </div>
                <a
                  href={`/api/certificates/${c.id}`}
                  className="font-sans text-sm text-secondary hover:underline"
                >
                  Download
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!accreditation ? (
        <div className="mt-6">
          <EmptyState title="No active accreditation yet." description="This will appear here once an application is accredited." />
        </div>
      ) : (
        <div className="mt-6 max-w-lg rounded-lg border border-border bg-surface p-6">
          <StatusBadge
            tone={VERIFICATION_STATUS[accreditation.status].tone}
            label={VERIFICATION_STATUS[accreditation.status].label}
            size="lg"
          />
          <p className="mt-2 font-sans text-sm text-text-muted">{STATUS_EXPLANATION[accreditation.status]}</p>
          <h2 className="mt-4 font-sans text-lg font-semibold text-text">{accreditation.organisationName}</h2>
          <p className="font-mono text-sm text-text-muted">{accreditation.reference}</p>

          <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <span className="font-sans text-sm text-text-muted">Program</span>
              <span className="font-sans text-sm text-text">{accreditation.programName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-sans text-sm text-text-muted">Effective</span>
              <span className="font-mono text-sm text-text">{accreditation.effectiveDate}</span>
            </div>
            {accreditation.nextRenewalDate && (
              <div className="flex items-center justify-between">
                <span className="font-sans text-sm text-text-muted">Next renewal due</span>
                <span className="font-mono text-sm text-text">{accreditation.nextRenewalDate}</span>
              </div>
            )}
          </div>

          <Link
            href={`/verify/${accreditation.reference}`}
            className="mt-4 inline-block font-sans text-sm text-secondary hover:underline"
          >
            View public verification page →
          </Link>
        </div>
      )}
    </div>
  );
}
