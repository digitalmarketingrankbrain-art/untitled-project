import type { StatusTone } from "@/components/ui/status-badge";
import type { CbAssessmentStatus, CbAssessmentSummary } from "./cb-assessments-data";

/**
 * Framework-agnostic (no "use client") so both the server-rendered
 * assessment detail page and the client CbAssessmentsTable can import it
 * safely — see invoice-status.ts for the same fix applied to the same class
 * of bug (a plain data export from a "use client" module isn't reliably
 * usable from a Server Component in the RSC model).
 */
export const STATUS_TONE: Record<CbAssessmentStatus, StatusTone> = {
  SCHEDULED: "info",
  IN_PROGRESS: "warning",
  PENDING_REVIEW: "warning",
  COMPLETED: "success",
  CANCELLED: "neutral",
};

export const STATUS_LABEL: Record<CbAssessmentStatus, string> = {
  SCHEDULED: "Scheduled",
  IN_PROGRESS: "In Progress",
  PENDING_REVIEW: "Pending Review",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export const TYPE_LABEL: Record<CbAssessmentSummary["assessmentType"], string> = {
  WITNESS_ASSESSMENT: "Witness Assessment",
  OFFICE_ASSESSMENT: "Office Assessment",
  DOCUMENT_REVIEW: "Document Review",
};
