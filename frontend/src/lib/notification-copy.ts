/**
 * Pure, no-Prisma-import copy lookup — deliberately separate from
 * notifications.ts (which imports the Prisma client) so a Client Component
 * (the notification bell) can import just this without pulling Node-only
 * Prisma code into the client bundle. Same underlying rule as the
 * server/client boundary lessons from Milestones 8/10/12, applied
 * proactively here instead of discovered via a build error.
 */
const NOTIFICATION_COPY: Record<string, { title: string; body: string }> = {
  "applicationrequest.submitted": {
    title: "New application request submitted",
    body: "A new organisation has submitted an application request awaiting your review.",
  },
  "application.submitted": {
    title: "New application submitted",
    body: "A certification body has submitted a new accreditation application for review.",
  },
  "application.approved": {
    title: "Application approved",
    body: "Your application has passed initial review — required forms and documents are now available.",
  },
  "application.information_requested": {
    title: "Information requested",
    body: "A reviewer has requested more information on your application.",
  },
  "application.decision_recorded.accredit": {
    title: "Application accredited",
    body: "Your application has been accredited.",
  },
  "application.decision_recorded.decline": {
    title: "Application decision recorded",
    body: "A decision has been recorded on your application.",
  },
  "application.decision_recorded.request_more_info": {
    title: "More information requested",
    body: "A decision-maker has requested more information before deciding on your application.",
  },
  "document.submitted": {
    title: "Document submitted",
    body: "A required document was uploaded and is awaiting review.",
  },
  "document.changes_requested": {
    title: "Document changes requested",
    body: "A reviewer requested changes to one of your submitted documents.",
  },
  "document.approved": {
    title: "Document approved",
    body: "One of your submitted documents has been approved.",
  },
  "assessorteam.submitted": {
    title: "Assessor team proposal submitted",
    body: "A certification body has submitted a proposed assessment team for review.",
  },
  "assessorteam.approved": {
    title: "Assessor team approved",
    body: "Your proposed assessment team has been approved.",
  },
  "assessorteam.changes_requested": {
    title: "Assessor team changes requested",
    body: "The AB has requested changes to your proposed assessment team.",
  },
  "assessorteam.rejected": {
    title: "Assessor team proposal rejected",
    body: "Your proposed assessment team was not approved.",
  },
  "assessment.notification_sent": {
    title: "Assessment notification received",
    body: "You've received an assessment notification that requires your acknowledgement and signature.",
  },
  "assessment.acknowledged": {
    title: "Assessment notification acknowledged",
    body: "The certification body has acknowledged and signed the assessment notification.",
  },
  "assessment.report_submitted": {
    title: "Assessment report submitted",
    body: "An assessor has submitted an assessment report for review.",
  },
  "assessment.report_released": {
    title: "Assessment report available",
    body: "Your finalized assessment report is now available to view.",
  },
  "nc.raised": {
    title: "Non-conformity raised",
    body: "A non-conformity has been raised against your organisation. A response is required.",
  },
  "nc.response_submitted": {
    title: "NC response submitted",
    body: "A certification body has submitted a response to an open non-conformity.",
  },
  "nc.accepted": {
    title: "Non-conformity response accepted",
    body: "Your response to a non-conformity has been accepted.",
  },
  "nc.rejected": {
    title: "Non-conformity — further action required",
    body: "Your response to a non-conformity needs further action.",
  },
  "nc.closed": {
    title: "Non-conformity closed",
    body: "A non-conformity on your record has been closed.",
  },
  "certificate.issued": {
    title: "Accreditation certificate issued",
    body: "Your accreditation certificate has been issued and is available to download.",
  },
};

export function getNotificationCopy(type: string) {
  return NOTIFICATION_COPY[type] ?? { title: type, body: "" };
}
