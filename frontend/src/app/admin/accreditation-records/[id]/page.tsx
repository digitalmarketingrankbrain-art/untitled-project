import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { StatusBadge, VERIFICATION_STATUS } from "@/components/ui/status-badge";
import { AccreditationStatusActions } from "@/components/portal/accreditation-status-actions";
import { VerificationCurationControls } from "@/components/portal/verification-curation-controls";
import { getAccreditationRecordByReference } from "@/lib/portal/accreditation-record-data";
import { getAuditLogForTarget } from "@/lib/portal/audit-log";

export default async function AdminAccreditationRecordDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: reference } = await params;
  const record = await getAccreditationRecordByReference(reference);
  if (!record) notFound();

  const [recordEntries, verificationEntries] = await Promise.all([
    getAuditLogForTarget("AccreditationRecord", reference),
    getAuditLogForTarget("VerificationRecord", reference),
  ]);
  const auditEntries = [...recordEntries, ...verificationEntries].sort((a, b) =>
    b.timestamp.localeCompare(a.timestamp),
  );

  return (
    <div className="px-6 py-8">
      <Breadcrumbs items={[{ label: "Accreditation Records", href: "/admin/accreditation-records" }, { label: reference }]} />

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="font-display text-2xl font-semibold text-text">{record.organisationName}</h1>
        <StatusBadge tone={VERIFICATION_STATUS[record.status].tone} label={VERIFICATION_STATUS[record.status].label} />
      </div>
      <p className="font-sans text-sm text-text-muted">{record.programName} · {record.reference}</p>

      <div className="mt-6">
        <AccreditationStatusActions reference={record.reference} currentStatus={record.status} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 font-sans text-sm font-semibold text-text">Record details</h2>
          <div className="rounded-lg border border-border bg-surface p-4">
            <div className="flex items-center justify-between border-b border-border py-2">
              <span className="font-sans text-sm text-text-muted">Effective date</span>
              <span className="font-mono text-sm text-text">{record.effectiveDate}</span>
            </div>
            {record.expiryDate && (
              <div className="flex items-center justify-between border-b border-border py-2">
                <span className="font-sans text-sm text-text-muted">Expiry date</span>
                <span className="font-mono text-sm text-text">{record.expiryDate}</span>
              </div>
            )}
            {record.lastSurveillanceDate && (
              <div className="flex items-center justify-between border-b border-border py-2">
                <span className="font-sans text-sm text-text-muted">Last surveillance</span>
                <span className="font-mono text-sm text-text">{record.lastSurveillanceDate}</span>
              </div>
            )}
            {record.nextRenewalDate && (
              <div className="flex items-center justify-between py-2">
                <span className="font-sans text-sm text-text-muted">Next renewal</span>
                <span className="font-mono text-sm text-text">{record.nextRenewalDate}</span>
              </div>
            )}
          </div>

          <h2 className="mb-3 mt-6 font-sans text-sm font-semibold text-text">Status history</h2>
          {record.statusHistory.length === 0 ? (
            <p className="font-sans text-sm text-text-muted">No status changes recorded yet.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {record.statusHistory.map((h, i) => (
                <li key={i} className="rounded-md border border-border bg-surface px-4 py-3">
                  <p className="font-sans text-sm text-text">{h.from} → {h.to}</p>
                  <p className="font-sans text-xs text-text-muted">{h.reason}</p>
                  <p className="font-mono text-xs text-text-muted">{h.changedBy} · {h.changedAt}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h2 className="mb-3 font-sans text-sm font-semibold text-text">Public verification record</h2>
          <div className="rounded-lg border border-border bg-surface p-4">
            <VerificationCurationControls
              reference={record.reference}
              isPublished={record.isPublished}
              certificateVisible={record.certificateVisible}
            />
          </div>

          <h2 className="mb-3 mt-6 font-sans text-sm font-semibold text-text">Audit log for this record</h2>
          {auditEntries.length === 0 ? (
            <p className="font-sans text-sm text-text-muted">No admin actions recorded yet.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {auditEntries.map((e) => (
                <li key={e.id} className="rounded-md border border-border bg-surface px-4 py-2">
                  <p className="font-mono text-xs text-text-muted">{e.timestamp}</p>
                  <p className="font-sans text-sm text-text">{e.actorName} — {e.action}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
