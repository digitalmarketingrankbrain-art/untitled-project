import Link from "next/link";
import { auth } from "@/auth";
import { BadgeCheck, Plus } from "lucide-react";
import { Tabs } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/ui/status-badge";
import { findUserById, getUserOrganisationId } from "@/lib/auth/store";
import {
  getCabDetails,
  getAppliedSchemes,
  getAwardedSchemes,
  getLocations,
  getCountryLists,
  getAssignedAssessors,
} from "@/lib/portal/cab-info-data";
import { getInvoicesForUser } from "@/lib/portal/applicant-data";
import { getAssessmentsForUser } from "@/lib/portal/cb-assessments-data";
import { getNonConformitiesForUser } from "@/lib/portal/nc-data";
import { getDocumentsForOwner } from "@/lib/portal/document-data";
import { getReferenceDocuments } from "@/lib/portal/reference-documents";
import { CabOverview } from "@/components/portal/cab-overview";
import { CabInfoTabs } from "@/components/portal/cab-info-tabs";
import { InvoicesTable } from "@/components/portal/invoices-table";
import { CbAssessmentsTable } from "@/components/portal/cb-assessments-table";
import { NcTable } from "@/components/portal/nc-table";
import { AssessorMembersTable } from "@/components/portal/assessor-members-table";
import { CbDocumentsTabs, type OrgDocumentEntry } from "@/components/portal/cb-documents-tabs";

export default async function ProfilePage() {
  const session = await auth();
  const userId = session!.user.id;

  const [user, organisationId, details, appliedSchemes, awardedSchemes, locations, countryLists, assignedAssessors, invoices, assessments, nonConformities, referenceDocuments] =
    await Promise.all([
      findUserById(userId),
      getUserOrganisationId(userId),
      getCabDetails(userId),
      getAppliedSchemes(userId),
      getAwardedSchemes(userId),
      getLocations(userId),
      getCountryLists(userId),
      getAssignedAssessors(userId),
      getInvoicesForUser(userId),
      getAssessmentsForUser(userId),
      getNonConformitiesForUser(userId),
      getReferenceDocuments(),
    ]);

  const orgDocumentRows = organisationId ? await getDocumentsForOwner("ORGANISATION", organisationId) : [];
  const orgDocuments: OrgDocumentEntry[] = orgDocumentRows
    .filter((d) => d.currentVersion)
    .map((d) => ({
      id: d.id,
      filename: d.currentVersion!.filename,
      sizeBytes: d.currentVersion!.sizeBytes,
      uploadedAt: d.currentVersion!.uploadedAt.slice(0, 10),
      currentVersionId: d.currentVersion!.id,
    }));

  const isApproved = awardedSchemes.length > 0;

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Profile Hero Header Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 h-32 w-64 bg-gradient-to-bl from-blue-50/80 via-indigo-50/40 to-transparent pointer-events-none rounded-tr-2xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-800 font-display text-xl font-bold text-white shadow-md shadow-blue-900/10">
              {details.displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-display text-2xl font-bold text-slate-900">{details.displayName}</h1>
                {isApproved && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200/80">
                    <BadgeCheck className="size-4 text-emerald-600" />
                    Verified CAB
                  </span>
                )}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
                <span>{user?.email}</span>
                <span>•</span>
                <span className="font-mono text-slate-700 font-semibold">CAB ID: {details.cabNumber}</span>
                <span>•</span>
                <span>{details.country || "Global"}</span>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <StatusBadge
                  tone={isApproved ? "success" : "info"}
                  label={isApproved ? "Approved Accreditation" : "Pending Approval"}
                  size="sm"
                />
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {organisationId && (
              <a
                href={`/api/agreement/${organisationId}`}
                download
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-xs sm:text-sm font-bold text-text hover:bg-background transition-all active:scale-95"
              >
                Agreement for Accreditation
              </a>
            )}
            <Link
              href="/cab/applicant/profile/add-certificate"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-900/10 hover:from-emerald-700 hover:to-teal-800 transition-all active:scale-95 border border-emerald-500/30"
            >
              <Plus className="size-4" /> Add Certification
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Tabs
          queryParam="tab"
          items={[
            {
              value: "overview",
              label: "Overview",
              content: (
                <CabOverview
                  details={details}
                  appliedSchemes={appliedSchemes}
                  awardedSchemes={awardedSchemes}
                  appliedCountries={countryLists.applied}
                  approvedCountries={countryLists.approved}
                />
              ),
            },
            {
              value: "documents",
              label: "Documents",
              content: <CbDocumentsTabs orgDocuments={orgDocuments} referenceDocuments={referenceDocuments} />,
            },
            {
              value: "cab-info",
              label: "CAB Info",
              content: (
                <CabInfoTabs
                  details={details}
                  locations={locations}
                  appliedCountries={countryLists.applied}
                  approvedCountries={countryLists.approved}
                />
              ),
            },
            {
              value: "invoices",
              label: "Invoices",
              content: <InvoicesTable invoices={invoices} />,
            },
            {
              value: "assessments",
              label: "Assessments",
              content: <CbAssessmentsTable items={assessments} basePath="/cab/applicant/profile/assessments" />,
            },
            {
              value: "nc",
              label: "NC",
              content: <NcTable items={nonConformities} basePath="/cab/applicant/profile/nc" />,
            },
            {
              value: "assessor-members",
              label: "Assessor Members",
              content: <AssessorMembersTable assessors={assignedAssessors} />,
            },
          ]}
        />
      </div>
    </div>
  );
}
