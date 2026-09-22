import { getUsersByRoleSafe, getUserOrganisationName } from "@/lib/auth/store";
import { getAllApplications } from "./applicant-data";
import { getAllAssignments, getAllCompetence } from "./assessor-data";
import { listAccreditationRecords } from "./accreditation-record-data";

export interface AssessorSummary {
  userId: string;
  name: string;
  email: string;
  activeAssignmentCount: number;
  competenceCount: number;
}

export async function getAssessorSummaries(): Promise<AssessorSummary[]> {
  const assessorUsers = await getUsersByRoleSafe("ASSESSOR");
  const [allAssignments, allCompetence] = await Promise.all([getAllAssignments(), getAllCompetence()]);
  return assessorUsers.map((u) => ({
    userId: u.id,
    name: u.name,
    email: u.email,
    activeAssignmentCount: allAssignments.filter(
      (a) => a.assessorUserId === u.id && (a.status === "IN_PROGRESS" || a.status === "ACCEPTED" || a.status === "PENDING"),
    ).length,
    competenceCount: allCompetence.filter((c) => c.assessorUserId === u.id).length,
  }));
}

export interface OrganisationSummary {
  userId: string;
  organisationName: string;
  contactName: string;
  contactEmail: string;
  applicationCount: number;
  accreditationCount: number;
}

/** Organisations are real (Prisma) as of Milestone 12; applications/accreditation records are still the in-memory placeholder stores until they're migrated too. */
export async function getOrganisations(): Promise<OrganisationSummary[]> {
  const applicantUsers = await getUsersByRoleSafe("APPLICANT");
  const applications = await getAllApplications();
  const accreditationRecords = await listAccreditationRecords();

  const summaries: OrganisationSummary[] = [];
  for (const u of applicantUsers) {
    const organisationName = await getUserOrganisationName(u.id);
    if (organisationName === "—") continue;
    summaries.push({
      userId: u.id,
      organisationName,
      contactName: u.name,
      contactEmail: u.email,
      applicationCount: applications.filter((a) => a.applicantUserId === u.id).length,
      accreditationCount: accreditationRecords.filter((r) => r.organisationName === organisationName).length,
    });
  }
  return summaries;
}

export async function getOrganisationByUserId(userId: string): Promise<OrganisationSummary | undefined> {
  const organisations = await getOrganisations();
  return organisations.find((o) => o.userId === userId);
}

export async function getUserOrgName(userId: string): Promise<string> {
  return getUserOrganisationName(userId);
}
