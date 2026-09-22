"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { saveScopeExtensionDraftAction, submitScopeExtensionAction } from "@/lib/portal/scope-extension-actions";
import type { CabDetails, SchemeEntry } from "@/lib/portal/cab-info-data";
import type { Program } from "@/lib/programs";

const STEPS = ["Terms & Conditions", "CAB Information", "Existing Accreditation", "Awarded Scope(s)", "Apply for Scope(s)", "Review"] as const;

interface ExistingAccreditationInfo {
  hasOther: boolean;
  issuingBody: string;
  licenseNumber: string;
}

export interface ScopeExtensionWizardProps {
  cabDetails: CabDetails;
  awardedSchemes: SchemeEntry[];
  availablePrograms: Program[];
  initialApplicationId?: string;
  initialReferenceNumber?: string;
  initialSelectedSlugs: string[];
  initialExistingAccreditation: ExistingAccreditationInfo;
}

function ScopeExtensionWizard({
  cabDetails,
  awardedSchemes,
  availablePrograms,
  initialApplicationId,
  initialReferenceNumber,
  initialSelectedSlugs,
  initialExistingAccreditation,
}: ScopeExtensionWizardProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [step, setStep] = React.useState(0);
  const [agreed, setAgreed] = React.useState(false);
  const [existingAccreditation, setExistingAccreditation] = React.useState<ExistingAccreditationInfo>(initialExistingAccreditation);
  const [selectedSlugs, setSelectedSlugs] = React.useState<Set<string>>(new Set(initialSelectedSlugs));
  const [applicationId, setApplicationId] = React.useState(initialApplicationId);
  const [referenceNumber, setReferenceNumber] = React.useState(initialReferenceNumber);
  const [saving, setSaving] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState<{ id: string; referenceNumber: string } | null>(null);

  function toggleScope(slug: string) {
    setSelectedSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  function buildInput() {
    const slugs = Array.from(selectedSlugs);
    return {
      primaryProgramSlug: slugs[0] ?? "",
      additionalScopeSlugs: slugs.slice(1),
      draftData: { existingAccreditation, agreedToTerms: agreed },
    };
  }

  async function handleSaveDraft() {
    if (selectedSlugs.size === 0) {
      toast({ tone: "warning", title: "Select at least one scheme before saving a draft." });
      return;
    }
    setSaving(true);
    const result = await saveScopeExtensionDraftAction(buildInput(), applicationId);
    setSaving(false);
    if (result.ok) {
      setApplicationId(result.id);
      setReferenceNumber(result.referenceNumber);
      toast({ tone: "success", title: "Draft saved.", description: `Reference ${result.referenceNumber}` });
    } else {
      toast({ tone: "error", title: result.error ?? "Couldn't save draft.", persistent: true });
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    const result = await submitScopeExtensionAction(buildInput(), applicationId);
    setSubmitting(false);
    if (result.ok) {
      setSubmitted({ id: result.id, referenceNumber: result.referenceNumber });
    } else {
      toast({ tone: "error", title: result.error ?? "Couldn't submit application.", persistent: true });
    }
  }

  const canProceed = [
    agreed,
    true, // CAB Information is read-only context
    existingAccreditation.hasOther ? existingAccreditation.issuingBody.trim().length > 0 : true,
    true, // Awarded Scope(s) is read-only context
    selectedSlugs.size > 0,
    true,
  ][step];

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg rounded-lg border border-border bg-surface p-8 text-center">
        <CheckCircle2 className="mx-auto size-10 text-success-text" strokeWidth={1.5} />
        <h2 className="mt-4 font-display text-xl font-semibold text-text">Application submitted</h2>
        <p className="mt-2 font-sans text-sm text-text-muted">
          Your Scope Extension application has been submitted for review.
        </p>
        <p className="mt-4 font-mono text-sm text-text">{submitted.referenceNumber}</p>
        <Button className="mt-6" onClick={() => router.push(`/cab/applicant/applications/${submitted.id}`)}>
          View Application
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Step indicator */}
      <div role="tablist" className="flex flex-wrap gap-1 border-b border-border">
        {STEPS.map((label, i) => (
          <button
            key={label}
            role="tab"
            aria-selected={step === i}
            onClick={() => i < step && setStep(i)}
            disabled={i > step}
            className={cn(
              "flex items-center gap-2 border-b-2 px-3 py-3 font-sans text-sm font-medium transition-colors",
              step === i ? "border-accent text-text" : i < step ? "border-transparent text-text-muted hover:text-text" : "border-transparent text-text-muted/50",
            )}
          >
            <span
              className={cn(
                "flex size-5 items-center justify-center rounded-full text-xs",
                i < step ? "bg-success-surface text-success-text" : i === step ? "bg-accent text-white" : "bg-border/40 text-text-muted",
              )}
            >
              {i < step ? <Check className="size-3" strokeWidth={2.5} /> : i + 1}
            </span>
            {label}
          </button>
        ))}
      </div>

      <div className="py-6">
        {step === 0 && (
          <div>
            <h2 className="font-sans text-lg font-semibold text-text">Terms & Conditions</h2>
            <div className="mt-4 max-h-80 overflow-y-auto rounded-lg border border-border p-4 font-sans text-sm text-text-muted">
              <p className="mb-3">By submitting this Scope Extension application, you confirm and agree that:</p>
              <ol className="list-decimal space-y-2 pl-5">
                <li>All information provided in this application is true, complete, and accurate to the best of your knowledge.</li>
                <li>You will cooperate with SAAF to enable review of documentation and, where applicable, an on-site or witness assessment.</li>
                <li>You will comply with SAAF&apos;s accreditation requirements and relevant scheme-specific guidance documents for each scope requested.</li>
                <li>You confirm your organisation has certified at least one client under each management system scheme requested, where applicable.</li>
                <li>You understand that fees associated with this application are described in SAAF&apos;s published Fee Structure and are non-refundable once assessment work has begun.</li>
                <li>You will notify SAAF promptly of any material change to your organisation&apos;s structure, ownership, or certified client base that could affect this application.</li>
                <li>Accreditation, once granted, applies only to the specific scopes for which it was awarded and must not be represented otherwise.</li>
              </ol>
            </div>
            <label className="mt-4 flex items-start gap-2 font-sans text-sm text-text">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5" />
              I have read and agree to the Terms & Conditions above.
            </label>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="font-sans text-lg font-semibold text-text">CAB Information</h2>
            <p className="mt-1 font-sans text-sm text-text-muted">
              This is the information currently on file for your organisation.{" "}
              <Link href="/cab/applicant/profile?tab=cab-info" className="text-secondary hover:underline">
                Edit in CAB Info →
              </Link>
            </p>
            <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2 rounded-lg border border-border p-4 sm:grid-cols-2">
              {[
                ["Company", cabDetails.displayName],
                ["CAB ID", cabDetails.cabNumber],
                ["Website", cabDetails.website],
                ["Director", cabDetails.director],
                ["Certification Manager", cabDetails.certificationManager],
                ["Contact Email", cabDetails.contactEmail],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between border-b border-border py-1.5 sm:border-b-0">
                  <span className="font-sans text-sm text-text-muted">{label}</span>
                  <span className="font-sans text-sm text-text">{value || "—"}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="font-sans text-lg font-semibold text-text">Existing Accreditation</h2>
            <p className="mt-1 font-sans text-sm text-text-muted">
              Information in case of existing accreditation by another IAF MLA Accreditation Body.
            </p>
            <div className="mt-4 flex flex-col gap-4">
              <div className="flex gap-6 font-sans text-sm text-text">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="hasOther"
                    checked={existingAccreditation.hasOther}
                    onChange={() => setExistingAccreditation((a) => ({ ...a, hasOther: true }))}
                  />
                  Yes
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="hasOther"
                    checked={!existingAccreditation.hasOther}
                    onChange={() => setExistingAccreditation((a) => ({ ...a, hasOther: false }))}
                  />
                  No
                </label>
              </div>
              {existingAccreditation.hasOther && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField label="Issuing accreditation body" htmlFor="issuingBody" required>
                    <Input
                      id="issuingBody"
                      value={existingAccreditation.issuingBody}
                      onChange={(e) => setExistingAccreditation((a) => ({ ...a, issuingBody: e.target.value }))}
                    />
                  </FormField>
                  <FormField label="License / registration number" htmlFor="licenseNumber">
                    <Input
                      id="licenseNumber"
                      value={existingAccreditation.licenseNumber}
                      onChange={(e) => setExistingAccreditation((a) => ({ ...a, licenseNumber: e.target.value }))}
                    />
                  </FormField>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="font-sans text-lg font-semibold text-text">Awarded Scope(s)</h2>
            <p className="mt-1 font-sans text-sm text-text-muted">Schemes your organisation is currently accredited for.</p>
            <div className="mt-4 rounded-lg border border-border">
              {awardedSchemes.length === 0 ? (
                <p className="px-4 py-6 text-center font-sans text-sm text-text-muted">No Awarded Schemes</p>
              ) : (
                <ul className="divide-y divide-border">
                  {awardedSchemes.map((s) => (
                    <li key={s.slug} className="px-4 py-3 font-sans text-sm text-text">
                      {s.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="font-sans text-lg font-semibold text-text">Apply for Scope(s)</h2>
            <p className="mt-1 font-sans text-sm text-text-muted">Select the scheme(s) you are requesting an extension to.</p>
            <div className="mt-4 flex flex-col gap-2">
              {availablePrograms.map((p) => {
                const isSelected = selectedSlugs.has(p.slug);
                return (
                  <button
                    key={p.slug}
                    type="button"
                    onClick={() => toggleScope(p.slug)}
                    className={cn(
                      "flex items-start gap-3 rounded-lg border px-4 py-3 text-left transition-colors",
                      isSelected ? "border-accent bg-background-portal" : "border-border hover:border-secondary",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-[4px] border",
                        isSelected ? "border-accent bg-accent text-white" : "border-border",
                      )}
                    >
                      {isSelected && <Check className="size-3" strokeWidth={2.5} />}
                    </span>
                    <span>
                      <span className="block font-sans text-sm font-medium text-text">{p.name}</span>
                      <span className="block font-sans text-xs text-text-muted">{p.scopeDescription}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h2 className="font-sans text-lg font-semibold text-text">Review</h2>
            <div className="mt-4 flex flex-col gap-4">
              <div className="rounded-lg border border-border p-4">
                <h3 className="font-sans text-sm font-semibold text-text">Scope(s) Requested</h3>
                <ul className="mt-2 flex flex-col gap-1">
                  {Array.from(selectedSlugs).map((slug) => {
                    const p = availablePrograms.find((prog) => prog.slug === slug);
                    return (
                      <li key={slug} className="font-sans text-sm text-text">
                        {p?.name ?? slug}
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="rounded-lg border border-border p-4">
                <h3 className="font-sans text-sm font-semibold text-text">Existing Accreditation</h3>
                <p className="mt-2 font-sans text-sm text-text">
                  {existingAccreditation.hasOther
                    ? `Yes — ${existingAccreditation.issuingBody}${existingAccreditation.licenseNumber ? ` (${existingAccreditation.licenseNumber})` : ""}`
                    : "No other current accreditation declared."}
                </p>
              </div>
              {referenceNumber && (
                <p className="font-mono text-xs text-text-muted">Draft reference: {referenceNumber}</p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-border pt-6">
        <Button variant="secondary" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
          Previous
        </Button>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={handleSaveDraft} loading={saving}>
            Save Draft
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))} disabled={!canProceed}>
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} loading={submitting} disabled={selectedSlugs.size === 0}>
              Submit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export { ScopeExtensionWizard };
