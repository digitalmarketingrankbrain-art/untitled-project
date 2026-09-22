import type { StatusTone } from "@/components/ui/status-badge";
import type { ApplicationRequestStatus } from "./application-requests-data";

/**
 * Plain constants (no "use client"): the admin list is a client component but the detail page is a
 * server component, and a server component can't read non-component exports from a client module.
 */
export const REQUEST_STATUS_TONE: Record<ApplicationRequestStatus, StatusTone> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "error",
};

export const REQUEST_STATUS_LABEL: Record<ApplicationRequestStatus, string> = {
  PENDING: "Pending review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

/** What an organisation can apply for on the public form (ids match the form's checkboxes). */
export const APPLY_FOR_LABEL: Record<string, string> = {
  ms: "Management Systems",
  ib: "Inspection Bodies",
  pcb: "Personnel Certification Bodies",
  tl: "Testing Laboratories",
  vvb: "Validation and Verification Bodies",
  prod: "Product Certification Bodies",
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-09-21T11:32:10Z" -> "21 Sep 2026". Hand-rolled so the server and browser always render the same text. */
export function formatShortDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}
