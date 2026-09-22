import { rpc } from "@/lib/rpc-client";

const MODULE = "invoice-pdf";

export function getInvoicePdf(
  invoiceId: string,
): Promise<{ buffer: Buffer; filename: string; organisationId: string } | undefined> {
  return rpc(MODULE, "getInvoicePdf", [invoiceId]);
}
