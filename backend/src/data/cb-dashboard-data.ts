import { prisma } from "../prisma";
import { getUserOrganisationId } from "./auth-store";

export interface CertificationSummary {
  total: number;
  active: number;
  suspended: number;
  withdrawn: number;
  expired: number;
  byProgram: { programName: string; active: number; suspended: number; withdrawn: number }[];
  expiringSoon: { accreditationNumber: string; programName: string; expiryDate: string }[];
}

function fmtDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export async function getCertificationSummary(userId: string): Promise<CertificationSummary> {
  const organisationId = await getUserOrganisationId(userId);
  const empty: CertificationSummary = { total: 0, active: 0, suspended: 0, withdrawn: 0, expired: 0, byProgram: [], expiringSoon: [] };
  if (!organisationId) return empty;

  const records = await prisma.accreditationRecord.findMany({
    where: { organisationId },
    include: { program: true },
  });

  const byProgramMap = new Map<string, { programName: string; active: number; suspended: number; withdrawn: number }>();
  let active = 0, suspended = 0, withdrawn = 0, expired = 0;

  for (const r of records) {
    if (r.status === "ACTIVE") active++;
    else if (r.status === "SUSPENDED") suspended++;
    else if (r.status === "WITHDRAWN") withdrawn++;
    else if (r.status === "EXPIRED") expired++;

    const entry = byProgramMap.get(r.programId) ?? { programName: r.program.name, active: 0, suspended: 0, withdrawn: 0 };
    if (r.status === "ACTIVE") entry.active++;
    else if (r.status === "SUSPENDED") entry.suspended++;
    else if (r.status === "WITHDRAWN") entry.withdrawn++;
    byProgramMap.set(r.programId, entry);
  }

  const sixMonthsOut = new Date();
  sixMonthsOut.setMonth(sixMonthsOut.getMonth() + 6);
  const expiringSoon = records
    .filter((r) => r.expiryDate && r.expiryDate <= sixMonthsOut && r.expiryDate >= new Date())
    .sort((a, b) => a.expiryDate!.getTime() - b.expiryDate!.getTime())
    .map((r) => ({ accreditationNumber: r.accreditationNumber, programName: r.program.name, expiryDate: fmtDate(r.expiryDate!) }));

  return {
    total: records.length,
    active,
    suspended,
    withdrawn,
    expired,
    byProgram: Array.from(byProgramMap.values()),
    expiringSoon,
  };
}
