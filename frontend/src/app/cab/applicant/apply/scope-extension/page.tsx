import { auth } from "@/auth";
import { getCabDetails, getAwardedSchemes } from "@/lib/portal/cab-info-data";
import { getDraftScopeExtensionSummary, getScopeExtensionApplicationsForUser } from "@/lib/portal/applicant-data";
import { PROGRAMS } from "@/lib/programs";
import { ScopeExtensionWizard } from "@/components/portal/scope-extension-wizard";
import { ScopeExtensionHistory } from "@/components/portal/scope-extension-history";

export default async function ScopeExtensionPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [cabDetails, awardedSchemes, draft, history] = await Promise.all([
    getCabDetails(userId),
    getAwardedSchemes(userId),
    getDraftScopeExtensionSummary(userId),
    getScopeExtensionApplicationsForUser(userId),
  ]);

  const awardedSlugs = new Set(awardedSchemes.map((s) => s.slug));
  const availablePrograms = PROGRAMS.filter((p) => !awardedSlugs.has(p.slug));

  const initialSelectedSlugs = draft ? [draft.primaryProgramSlug, ...draft.additionalScopeSlugs] : [];
  const draftAccreditation = (draft?.draftData.existingAccreditation as
    | { hasOther: boolean; issuingBody: string; licenseNumber: string }
    | undefined) ?? { hasOther: false, issuingBody: "", licenseNumber: "" };

  return (
    <div className="px-6 py-8">
      <h1 className="font-display text-2xl font-semibold text-text">Scope Extension</h1>
      <p className="mt-1 font-sans text-sm text-text-muted">Apply to extend your accreditation to additional schemes.</p>

      <div className="mt-6">
        <ScopeExtensionHistory items={history} />
      </div>

      <div className="rounded-lg border border-border bg-surface p-6">
        <ScopeExtensionWizard
          cabDetails={cabDetails}
          awardedSchemes={awardedSchemes}
          availablePrograms={availablePrograms}
          initialApplicationId={draft?.id}
          initialReferenceNumber={draft?.referenceNumber}
          initialSelectedSlugs={initialSelectedSlugs}
          initialExistingAccreditation={draftAccreditation}
        />
      </div>
    </div>
  );
}
