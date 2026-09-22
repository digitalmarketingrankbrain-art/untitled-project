import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { StatusBadge } from "@/components/ui/status-badge";
import { Alert } from "@/components/ui/alert";
import { AdminApplicationRequestReview } from "@/components/portal/admin-application-request-review";
import { APPLY_FOR_LABEL, REQUEST_STATUS_LABEL, REQUEST_STATUS_TONE } from "@/lib/portal/application-request-status";
import { getApplicationRequest } from "@/lib/portal/application-requests-data";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="font-sans text-xs font-medium text-text-muted">{label}</dt>
      <dd className="mt-0.5 font-sans text-sm text-text">{value || "—"}</dd>
    </div>
  );
}

export default async function AdminApplicationRequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const request = await getApplicationRequest(id);
  if (!request) notFound();

  const address = [request.address1, request.address2, request.addressDetails, request.city, request.state, request.zipCode, request.country]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="px-6 py-8">
      <Breadcrumbs
        items={[
          { label: "Application Requests", href: "/admin/application-requests" },
          { label: request.referenceId },
        ]}
      />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="font-display text-2xl font-semibold text-text">{request.companyName}</h1>
        <StatusBadge tone={REQUEST_STATUS_TONE[request.status]} label={REQUEST_STATUS_LABEL[request.status]} />
      </div>
      <p className="mt-1 font-mono text-xs text-text-muted">{request.referenceId}</p>

      {request.status === "PENDING" ? (
        <div className="mt-6">
          <AdminApplicationRequestReview requestId={request.id} email={request.email} />
        </div>
      ) : (
        <div className="mt-6">
          <Alert tone={request.status === "APPROVED" ? "success" : "error"} title={REQUEST_STATUS_LABEL[request.status]}>
            {request.reviewedByName ? `By ${request.reviewedByName}` : "Reviewed"}
            {request.reviewedAt ? ` on ${new Date(request.reviewedAt).toISOString().slice(0, 10)}` : ""}.
            {request.rejectionReason ? ` Reason sent to applicant: ${request.rejectionReason}` : ""}
          </Alert>
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="font-display text-base font-semibold text-text">Personal info</h2>
          <dl className="mt-3 grid gap-4 sm:grid-cols-2">
            <Field label="Name" value={request.contactName} />
            <Field label="Email" value={request.email} />
            <Field label="Phone" value={request.phone} />
            <Field label="Address" value={address} />
          </dl>
        </section>

        <section>
          <h2 className="font-display text-base font-semibold text-text">Company info</h2>
          <dl className="mt-3 grid gap-4 sm:grid-cols-2">
            <Field label="Company name" value={request.companyName} />
            <Field label="Website" value={request.companyWebsite} />
            <Field label="Directors" value={request.directors} />
            <Field label="Responsible person" value={request.responsiblePerson} />
            <Field label="Already accredited" value={request.alreadyAccredited ? "Yes" : "No"} />
            <Field
              label="Date of establishment"
              value={request.dateOfEstablishment ? request.dateOfEstablishment.slice(0, 10) : null}
            />
            <Field label="License number" value={request.licenseNumber} />
            <Field label="License file" value={request.licenseFileName} />
          </dl>
        </section>
      </div>

      <section className="mt-8">
        <h2 className="font-display text-base font-semibold text-text">Applying for</h2>
        <ul className="mt-3 list-disc pl-5 font-sans text-sm text-text">
          {request.applyFor.map((a) => (
            <li key={a}>{APPLY_FOR_LABEL[a] ?? a}</li>
          ))}
        </ul>
        {request.remarks && (
          <>
            <h3 className="mt-5 font-sans text-xs font-medium text-text-muted">Remarks</h3>
            <p className="mt-1 whitespace-pre-wrap font-sans text-sm text-text">{request.remarks}</p>
          </>
        )}
      </section>
    </div>
  );
}
