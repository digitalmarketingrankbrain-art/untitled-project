"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { issueCertificateForApplication } from "@/lib/portal/certificate-actions";
import type { CertificateRow } from "@/lib/portal/certificate-data";

export function AdminCertificateActions({
  applicationId,
  defaultScope,
  defaultStandard,
  existingCertificates,
}: {
  applicationId: string;
  defaultScope: string;
  defaultStandard: string;
  existingCertificates: CertificateRow[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [scopeText, setScopeText] = React.useState(defaultScope);
  const [standardReference, setStandardReference] = React.useState(defaultStandard);
  const [validityMonths, setValidityMonths] = React.useState(36);
  const [signatoryName, setSignatoryName] = React.useState("");
  const [signatoryTitle, setSignatoryTitle] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  async function handleIssue() {
    setSubmitting(true);
    const result = await issueCertificateForApplication({
      applicationId,
      scopeText,
      standardReference: standardReference || undefined,
      validityMonths,
      authorizedSignatoryName: signatoryName,
      authorizedSignatoryTitle: signatoryTitle || undefined,
    });
    setSubmitting(false);
    if (!result.ok) return toast({ tone: "error", persistent: true, title: "Couldn't issue certificate", description: result.error });
    toast({ tone: "success", title: `Certificate ${result.certificateNumber} issued` });
    setOpen(false);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-3">
      {existingCertificates.length > 0 && (
        <ul className="flex flex-col gap-2">
          {existingCertificates.map((c) => (
            <li key={c.id} className="flex items-center justify-between rounded-md border border-border bg-surface px-4 py-2">
              <span className="font-mono text-sm text-text">{c.certificateNumber} (v{c.version})</span>
              <span className="font-sans text-xs text-text-muted">{c.status} · valid until {c.validUntil ?? "—"}</span>
            </li>
          ))}
        </ul>
      )}
      <Button variant="primary" size="sm" onClick={() => setOpen(true)} className="self-start">
        {existingCertificates.length > 0 ? "Reissue certificate" : "Issue certificate"}
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title="Issue accreditation certificate"
        footer={<>
          <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleIssue} disabled={!scopeText.trim() || !signatoryName.trim()} loading={submitting}>Issue certificate</Button>
        </>}>
        <div className="flex flex-col gap-3">
          <div>
            <label className="font-sans text-sm font-medium text-text" htmlFor="cert-scope">Scope of accreditation</label>
            <textarea id="cert-scope" value={scopeText} onChange={(e) => setScopeText(e.target.value)} rows={2}
              className="mt-1 w-full rounded-[6px] border border-border bg-surface px-3 py-2 font-sans text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1" />
          </div>
          <div>
            <label className="font-sans text-sm font-medium text-text" htmlFor="cert-standard">Standard / Scheme</label>
            <Input id="cert-standard" value={standardReference} onChange={(e) => setStandardReference(e.target.value)} className="mt-1" />
          </div>
          <div>
            <label className="font-sans text-sm font-medium text-text" htmlFor="cert-validity">Validity (months)</label>
            <Input id="cert-validity" type="number" value={validityMonths} onChange={(e) => setValidityMonths(Number(e.target.value) || 36)} className="mt-1" />
          </div>
          <div>
            <label className="font-sans text-sm font-medium text-text" htmlFor="cert-signatory">Authorized signatory</label>
            <Input id="cert-signatory" value={signatoryName} onChange={(e) => setSignatoryName(e.target.value)} className="mt-1" />
          </div>
          <div>
            <label className="font-sans text-sm font-medium text-text" htmlFor="cert-signatory-title">Signatory title (optional)</label>
            <Input id="cert-signatory-title" value={signatoryTitle} onChange={(e) => setSignatoryTitle(e.target.value)} className="mt-1" />
          </div>
        </div>
      </Modal>
    </div>
  );
}
