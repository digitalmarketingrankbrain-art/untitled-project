import type { StatusTone } from "@/components/ui/status-badge";
import type { Invoice } from "./applicant-data";

/**
 * Framework-agnostic (no "use client") so both the server-rendered invoice
 * detail page and the client InvoicesTable can import it safely — a plain
 * data export from a "use client" module isn't reliably usable from a
 * Server Component in the RSC model (only component exports get proper
 * client-reference treatment), which caused a real runtime bug here.
 */
export const INVOICE_STATUS_STYLE: Record<Invoice["status"], { tone: StatusTone; label: string }> = {
  DRAFT: { tone: "neutral", label: "Draft" },
  ISSUED: { tone: "info", label: "Due" },
  PAID: { tone: "success", label: "Paid" },
  OVERDUE: { tone: "error", label: "Overdue" },
  VOID: { tone: "neutral", label: "Void" },
};
