"use client";

import * as React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { Select } from "@/components/ui/select";
import { saveApplicationDetailsAction } from "@/lib/portal/application-details-actions";
import type {
  ApplicationDetails,
  OtherAccreditationEntry,
  FinancialYearEntry,
  OtherOfficeEntry,
  ScopeItemEntry,
  CertificateIssuedEntry,
} from "@/lib/portal/application-details-data";

function SectionCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <h3 className="font-sans text-sm font-semibold text-text">{title}</h3>
      {description && <p className="mt-0.5 font-sans text-xs text-text-muted">{description}</p>}
      <div className="mt-4 flex flex-col gap-4">{children}</div>
    </div>
  );
}

function EligibilityRow({
  label,
  checked,
  date,
  onCheckedChange,
  onDateChange,
}: {
  label: string;
  checked: boolean;
  date: string;
  onCheckedChange: (v: boolean) => void;
  onDateChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-border py-2 last:border-b-0">
      <label className="flex flex-1 items-center gap-2 font-sans text-sm text-text">
        <input type="checkbox" checked={checked} onChange={(e) => onCheckedChange(e.target.checked)} className="size-4" />
        {label}
      </label>
      <Input type="date" value={date} onChange={(e) => onDateChange(e.target.value)} className="w-40" disabled={!checked} />
    </div>
  );
}

export function ApplicationDetailsForm({
  applicationId,
  initialDetails,
  locked,
}: {
  applicationId: string;
  initialDetails: ApplicationDetails;
  locked: boolean;
}) {
  const { toast } = useToast();
  const [details, setDetails] = React.useState<ApplicationDetails>(initialDetails);
  const [saving, setSaving] = React.useState(false);

  function update<K extends keyof ApplicationDetails>(key: K, value: ApplicationDetails[K]) {
    setDetails((prev) => ({ ...prev, [key]: value }));
  }

  function addOtherAccreditation() {
    update("otherAccreditations", [...details.otherAccreditations, { bodyName: "", scheme: "", scope: "", accreditationNo: "" }]);
  }
  function updateOtherAccreditation(i: number, patch: Partial<OtherAccreditationEntry>) {
    update(
      "otherAccreditations",
      details.otherAccreditations.map((r, idx) => (idx === i ? { ...r, ...patch } : r)),
    );
  }
  function removeOtherAccreditation(i: number) {
    update("otherAccreditations", details.otherAccreditations.filter((_, idx) => idx !== i));
  }

  function addOtherOffice() {
    update("otherOffices", [
      ...details.otherOffices,
      { type: "BRANCH", name: "", address: "", activities: "", resources: "", certificatesCount: "" },
    ]);
  }
  function updateOtherOffice(i: number, patch: Partial<OtherOfficeEntry>) {
    update(
      "otherOffices",
      details.otherOffices.map((r, idx) => (idx === i ? { ...r, ...patch } : r)),
    );
  }
  function removeOtherOffice(i: number) {
    update("otherOffices", details.otherOffices.filter((_, idx) => idx !== i));
  }

  function addScopeItem() {
    update("scopeItems", [...details.scopeItems, { iafCode: "", description: "", class: "" }]);
  }
  function updateScopeItem(i: number, patch: Partial<ScopeItemEntry>) {
    update(
      "scopeItems",
      details.scopeItems.map((r, idx) => (idx === i ? { ...r, ...patch } : r)),
    );
  }
  function removeScopeItem(i: number) {
    update("scopeItems", details.scopeItems.filter((_, idx) => idx !== i));
  }

  function addCertificateIssued() {
    update("certificatesIssued", [...details.certificatesIssued, { iafScope: "", orgCount: "", orgNames: "" }]);
  }
  function updateCertificateIssued(i: number, patch: Partial<CertificateIssuedEntry>) {
    update(
      "certificatesIssued",
      details.certificatesIssued.map((r, idx) => (idx === i ? { ...r, ...patch } : r)),
    );
  }
  function removeCertificateIssued(i: number) {
    update("certificatesIssued", details.certificatesIssued.filter((_, idx) => idx !== i));
  }

  function updateEnclosure(i: number, patch: Partial<ApplicationDetails["enclosures"][number]>) {
    update(
      "enclosures",
      details.enclosures.map((r, idx) => (idx === i ? { ...r, ...patch } : r)),
    );
  }

  function addFinancialYear() {
    update("financials", [...details.financials, { year: "", income: "", expenditure: "" }]);
  }
  function updateFinancialYear(i: number, patch: Partial<FinancialYearEntry>) {
    update(
      "financials",
      details.financials.map((r, idx) => (idx === i ? { ...r, ...patch } : r)),
    );
  }
  function removeFinancialYear(i: number) {
    update("financials", details.financials.filter((_, idx) => idx !== i));
  }

  async function handleSave() {
    setSaving(true);
    const result = await saveApplicationDetailsAction(applicationId, details);
    setSaving(false);
    if (result.ok) toast({ tone: "success", title: "Application details saved." });
    else toast({ tone: "error", persistent: true, title: "Couldn't save", description: result.error });
  }

  return (
    <fieldset disabled={locked} className="flex flex-col gap-6 disabled:opacity-70">
      {locked && (
        <p className="font-sans text-sm font-medium text-text-muted">
          This application has been submitted — these details are now read-only.
        </p>
      )}

      <SectionCard title="Applicant Body" description="Legal status of the applying organisation.">
        <FormField label="Legal entity status" htmlFor="legalEntityStatus">
          <Input
            id="legalEntityStatus"
            value={details.legalEntityStatus}
            onChange={(e) => update("legalEntityStatus", e.target.value)}
            placeholder="e.g. Private limited company, registered under..."
          />
        </FormField>
      </SectionCard>

      <SectionCard title="Chief of Applicant Body" description="The senior-most person accountable for this application.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Name & designation" htmlFor="chiefName">
            <Input id="chiefName" value={details.chief.name} onChange={(e) => update("chief", { ...details.chief, name: e.target.value })} />
          </FormField>
          <FormField label="Designation" htmlFor="chiefDesignation">
            <Input id="chiefDesignation" value={details.chief.designation} onChange={(e) => update("chief", { ...details.chief, designation: e.target.value })} />
          </FormField>
          <FormField label="Landline" htmlFor="chiefLandline">
            <Input id="chiefLandline" value={details.chief.landline} onChange={(e) => update("chief", { ...details.chief, landline: e.target.value })} />
          </FormField>
          <FormField label="Mobile" htmlFor="chiefMobile">
            <Input id="chiefMobile" value={details.chief.mobile} onChange={(e) => update("chief", { ...details.chief, mobile: e.target.value })} />
          </FormField>
          <FormField label="Email" htmlFor="chiefEmail">
            <Input id="chiefEmail" type="email" value={details.chief.email} onChange={(e) => update("chief", { ...details.chief, email: e.target.value })} />
          </FormField>
          <FormField label="Website" htmlFor="chiefWebsite">
            <Input id="chiefWebsite" value={details.chief.website} onChange={(e) => update("chief", { ...details.chief, website: e.target.value })} />
          </FormField>
        </div>
      </SectionCard>

      <SectionCard title="Contact Persons" description="Day-to-day points of contact for this application.">
        {(["contact1", "contact2"] as const).map((key, i) => (
          <div key={key} className="grid grid-cols-1 gap-4 border-b border-border pb-4 last:border-b-0 last:pb-0 sm:grid-cols-2">
            <p className="font-sans text-xs font-semibold text-text-muted sm:col-span-2">Contact {i + 1}</p>
            <FormField label="Name" htmlFor={`${key}Name`}>
              <Input id={`${key}Name`} value={details[key].name} onChange={(e) => update(key, { ...details[key], name: e.target.value })} />
            </FormField>
            <FormField label="Designation" htmlFor={`${key}Designation`}>
              <Input id={`${key}Designation`} value={details[key].designation} onChange={(e) => update(key, { ...details[key], designation: e.target.value })} />
            </FormField>
            <FormField label="Mobile" htmlFor={`${key}Mobile`}>
              <Input id={`${key}Mobile`} value={details[key].mobile} onChange={(e) => update(key, { ...details[key], mobile: e.target.value })} />
            </FormField>
            <FormField label="Email" htmlFor={`${key}Email`}>
              <Input id={`${key}Email`} type="email" value={details[key].email} onChange={(e) => update(key, { ...details[key], email: e.target.value })} />
            </FormField>
          </div>
        ))}
      </SectionCard>

      <SectionCard title="Other Offices" description="Branch offices, subcontractors, or other business associates, if any.">
        {details.otherOffices.length === 0 && <p className="font-sans text-xs text-text-muted">None added.</p>}
        {details.otherOffices.map((row, i) => (
          <div key={i} className="flex flex-col gap-3 border-b border-border pb-4 last:border-b-0 last:pb-0">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[160px_1fr_auto]">
              <Select value={row.type} onChange={(e) => updateOtherOffice(i, { type: e.target.value as OtherOfficeEntry["type"] })}>
                <option value="BRANCH">Branch office</option>
                <option value="SUBCONTRACTOR">Subcontractor</option>
                <option value="ASSOCIATE">Business associate</option>
              </Select>
              <Input placeholder="Name" value={row.name} onChange={(e) => updateOtherOffice(i, { name: e.target.value })} />
              <Button type="button" variant="destructive-outline" size="sm" onClick={() => removeOtherOffice(i)} aria-label="Remove row">
                <Trash2 className="size-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Input placeholder="Address / contact details" value={row.address} onChange={(e) => updateOtherOffice(i, { address: e.target.value })} />
              <Input placeholder="Activities performed" value={row.activities} onChange={(e) => updateOtherOffice(i, { activities: e.target.value })} />
              <Input placeholder="Resources (auditors/others)" value={row.resources} onChange={(e) => updateOtherOffice(i, { resources: e.target.value })} />
            </div>
            <Input
              placeholder="No. of certificates operating under this office"
              value={row.certificatesCount}
              onChange={(e) => updateOtherOffice(i, { certificatesCount: e.target.value })}
              className="sm:w-72"
            />
          </div>
        ))}
        <Button type="button" variant="secondary" size="sm" onClick={addOtherOffice} className="self-start">
          <Plus className="size-4" /> Add office
        </Button>
      </SectionCard>

      <SectionCard title="Scope of Accreditation Applied For" description="IAF codes and descriptions for the scopes being applied for.">
        {details.scopeItems.length === 0 && <p className="font-sans text-xs text-text-muted">None added.</p>}
        {details.scopeItems.map((row, i) => (
          <div key={i} className="grid grid-cols-1 gap-3 border-b border-border pb-4 last:border-b-0 last:pb-0 sm:grid-cols-[120px_1fr_120px_auto]">
            <Input placeholder="IAF code" value={row.iafCode} onChange={(e) => updateScopeItem(i, { iafCode: e.target.value })} />
            <Input placeholder="Description" value={row.description} onChange={(e) => updateScopeItem(i, { description: e.target.value })} />
            <Input placeholder="Class" value={row.class} onChange={(e) => updateScopeItem(i, { class: e.target.value })} />
            <Button type="button" variant="destructive-outline" size="sm" onClick={() => removeScopeItem(i)} aria-label="Remove row">
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="secondary" size="sm" onClick={addScopeItem} className="self-start">
          <Plus className="size-4" /> Add scope item
        </Button>
      </SectionCard>

      <SectionCard title="Accreditation by Other Bodies" description="Any accreditation already held with another accreditation body, if applicable.">
        {details.otherAccreditations.length === 0 && (
          <p className="font-sans text-xs text-text-muted">None added.</p>
        )}
        {details.otherAccreditations.map((row, i) => (
          <div key={i} className="grid grid-cols-1 gap-3 border-b border-border pb-4 last:border-b-0 last:pb-0 sm:grid-cols-[1fr_1fr_1fr_1fr_auto]">
            <Input placeholder="Accreditation body name" value={row.bodyName} onChange={(e) => updateOtherAccreditation(i, { bodyName: e.target.value })} />
            <Input placeholder="Scheme" value={row.scheme} onChange={(e) => updateOtherAccreditation(i, { scheme: e.target.value })} />
            <Input placeholder="Scope" value={row.scope} onChange={(e) => updateOtherAccreditation(i, { scope: e.target.value })} />
            <Input placeholder="Accreditation number" value={row.accreditationNo} onChange={(e) => updateOtherAccreditation(i, { accreditationNo: e.target.value })} />
            <Button type="button" variant="destructive-outline" size="sm" onClick={() => removeOtherAccreditation(i)} aria-label="Remove row">
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="secondary" size="sm" onClick={addOtherAccreditation} className="self-start">
          <Plus className="size-4" /> Add row
        </Button>
      </SectionCard>

      <SectionCard title="Auditors & Staff" description="Headcount available to conduct certification activities.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField label="Full-time auditors" htmlFor="fullTimeAuditors">
            <Input id="fullTimeAuditors" type="number" min={0} value={details.auditors.fullTime} onChange={(e) => update("auditors", { ...details.auditors, fullTime: e.target.value })} />
          </FormField>
          <FormField label="Contract auditors" htmlFor="contractAuditors">
            <Input id="contractAuditors" type="number" min={0} value={details.auditors.contract} onChange={(e) => update("auditors", { ...details.auditors, contract: e.target.value })} />
          </FormField>
          <FormField label="Technical experts" htmlFor="technicalExperts">
            <Input id="technicalExperts" type="number" min={0} value={details.auditors.technicalExperts} onChange={(e) => update("auditors", { ...details.auditors, technicalExperts: e.target.value })} />
          </FormField>
        </div>
      </SectionCard>

      <SectionCard title="Certificates Issued" description="Certificates already issued against each scope, if any.">
        {details.certificatesIssued.length === 0 && <p className="font-sans text-xs text-text-muted">None added.</p>}
        {details.certificatesIssued.map((row, i) => (
          <div key={i} className="grid grid-cols-1 gap-3 border-b border-border pb-4 last:border-b-0 last:pb-0 sm:grid-cols-[1fr_120px_1fr_auto]">
            <Input placeholder="IAF scope" value={row.iafScope} onChange={(e) => updateCertificateIssued(i, { iafScope: e.target.value })} />
            <Input placeholder="No. of orgs" value={row.orgCount} onChange={(e) => updateCertificateIssued(i, { orgCount: e.target.value })} />
            <Input placeholder="Organisation names" value={row.orgNames} onChange={(e) => updateCertificateIssued(i, { orgNames: e.target.value })} />
            <Button type="button" variant="destructive-outline" size="sm" onClick={() => removeCertificateIssued(i)} aria-label="Remove row">
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="secondary" size="sm" onClick={addCertificateIssued} className="self-start">
          <Plus className="size-4" /> Add row
        </Button>
      </SectionCard>

      <SectionCard title="Financial Details" description="Income, expenditure for the last financial years.">
        {details.financials.length === 0 && <p className="font-sans text-xs text-text-muted">None added.</p>}
        {details.financials.map((row, i) => (
          <div key={i} className="grid grid-cols-1 gap-3 border-b border-border pb-4 last:border-b-0 last:pb-0 sm:grid-cols-[1fr_1fr_1fr_auto]">
            <Input placeholder="Financial year, e.g. FY24-25" value={row.year} onChange={(e) => updateFinancialYear(i, { year: e.target.value })} />
            <Input placeholder="Income" value={row.income} onChange={(e) => updateFinancialYear(i, { income: e.target.value })} />
            <Input placeholder="Expenditure" value={row.expenditure} onChange={(e) => updateFinancialYear(i, { expenditure: e.target.value })} />
            <Button type="button" variant="destructive-outline" size="sm" onClick={() => removeFinancialYear(i)} aria-label="Remove row">
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="secondary" size="sm" onClick={addFinancialYear} className="self-start">
          <Plus className="size-4" /> Add year
        </Button>
      </SectionCard>

      <SectionCard title="Minimum Eligibility" description="Confirm the following before this application can be assessed.">
        <EligibilityRow
          label="Management system implemented for a minimum of six months"
          checked={details.eligibility.qms6Months}
          date={details.eligibility.qms6MonthsDate}
          onCheckedChange={(v) => update("eligibility", { ...details.eligibility, qms6Months: v })}
          onDateChange={(v) => update("eligibility", { ...details.eligibility, qms6MonthsDate: v })}
        />
        <EligibilityRow
          label="One complete management review cycle completed"
          checked={details.eligibility.managementReview}
          date={details.eligibility.managementReviewDate}
          onCheckedChange={(v) => update("eligibility", { ...details.eligibility, managementReview: v })}
          onDateChange={(v) => update("eligibility", { ...details.eligibility, managementReviewDate: v })}
        />
        <EligibilityRow
          label="One complete internal audit cycle completed"
          checked={details.eligibility.internalAudit}
          date={details.eligibility.internalAuditDate}
          onCheckedChange={(v) => update("eligibility", { ...details.eligibility, internalAudit: v })}
          onDateChange={(v) => update("eligibility", { ...details.eligibility, internalAuditDate: v })}
        />
        <EligibilityRow
          label="At least one impartiality committee meeting held"
          checked={details.eligibility.impartialityMeeting}
          date={details.eligibility.impartialityMeetingDate}
          onCheckedChange={(v) => update("eligibility", { ...details.eligibility, impartialityMeeting: v })}
          onDateChange={(v) => update("eligibility", { ...details.eligibility, impartialityMeetingDate: v })}
        />
        <label className="flex items-center gap-2 py-2 font-sans text-sm text-text">
          <input
            type="checkbox"
            checked={details.eligibility.twoCertifications}
            onChange={(e) => update("eligibility", { ...details.eligibility, twoCertifications: e.target.checked })}
            className="size-4"
          />
          Two certifications completed, including the certification decision
        </label>
      </SectionCard>

      <SectionCard title="Enclosures" description="Confirm what's being submitted alongside this application.">
        {details.enclosures.map((item, i) => (
          <div key={item.label} className="flex flex-wrap items-center gap-3 border-b border-border py-2 last:border-b-0">
            <label className="flex flex-1 items-center gap-2 font-sans text-sm text-text">
              <input
                type="checkbox"
                checked={item.provided}
                onChange={(e) => updateEnclosure(i, { provided: e.target.checked })}
                className="size-4"
              />
              {item.label}
            </label>
            <Input
              placeholder="Annex # (optional)"
              value={item.annexRef}
              onChange={(e) => updateEnclosure(i, { annexRef: e.target.value })}
              className="w-40"
              disabled={!item.provided}
            />
          </div>
        ))}
      </SectionCard>

      <SectionCard title="Declaration">
        <label className="flex items-start gap-2 font-sans text-sm text-text">
          <input
            type="checkbox"
            checked={details.declarationAccepted}
            onChange={(e) => update("declarationAccepted", e.target.checked)}
            className="mt-0.5 size-4"
          />
          <span>
            I confirm the information given in this application is true, that the accreditation criteria and procedures have been
            read and understood, and that the applicant body has adequate resources to conduct certification in accordance with
            the accreditation criteria and other guidance documents.
          </span>
        </label>
      </SectionCard>

      {!locked && (
        <Button type="button" variant="primary" onClick={handleSave} loading={saving} className="self-start">
          Save application details
        </Button>
      )}
    </fieldset>
  );
}
