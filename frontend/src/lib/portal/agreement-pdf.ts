import { rpc } from "@/lib/rpc-client";

const MODULE = "agreement-pdf";

export function getAgreementPdf(organisationId: string): Promise<{ buffer: Buffer; filename: string } | undefined> {
  return rpc(MODULE, "getAgreementPdf", [organisationId]);
}
