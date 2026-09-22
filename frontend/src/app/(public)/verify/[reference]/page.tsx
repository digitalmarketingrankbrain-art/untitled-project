import type { Metadata } from "next";
import { VerificationCard } from "@/components/verify/verification-card";
import { NotFoundCard } from "@/components/verify/not-found-card";
import { getPublicAccreditationRecord } from "@/lib/portal/accreditation-record-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ reference: string }>;
}): Promise<Metadata> {
  const { reference } = await params;
  const record = await getPublicAccreditationRecord(reference);
  return {
    title: record
      ? `${record.organisationName} — ${reference} | SAAF`
      : `Verify ${reference} | SAAF`,
    description: record
      ? `Verification status for ${record.organisationName}, accreditation ${reference}.`
      : `No matching public accreditation record was found for ${reference}.`,
  };
}

/**
 * Status must reflect current data on every load, and "Last verified"
 * has to mean "just now" — no long-TTL caching of an individual
 * verification page (Phase 7/11).
 */
export const dynamic = "force-dynamic";

export default async function VerificationDetailPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  const record = await getPublicAccreditationRecord(reference);
  const lastVerifiedAt = new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC";

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      {record ? (
        <VerificationCard record={record} lastVerifiedAt={lastVerifiedAt} />
      ) : (
        <NotFoundCard reference={reference} />
      )}
    </div>
  );
}
