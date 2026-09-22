import { rpc } from "@/lib/rpc-client";

/** Thin proxy over backend/src/data/cb-dashboard-data.ts — see applicant-data.ts's header comment for why. */

export interface CertificationSummary {
  total: number;
  active: number;
  suspended: number;
  withdrawn: number;
  expired: number;
  byProgram: { programName: string; active: number; suspended: number; withdrawn: number }[];
  expiringSoon: { accreditationNumber: string; programName: string; expiryDate: string }[];
}

export function getCertificationSummary(userId: string): Promise<CertificationSummary> {
  return rpc("cb-dashboard-data", "getCertificationSummary", [userId]);
}
