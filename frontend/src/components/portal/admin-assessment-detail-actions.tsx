"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";
import { useToast } from "@/components/ui/toast";
import { sendNotification } from "@/lib/portal/assessment-notification-actions";
import { startReportReview, finalizeReport } from "@/lib/portal/report-review-actions";
import type { AssessmentNotificationRow } from "@/lib/portal/assessment-notification-data";
import type { AssessmentReportStatus } from "@/lib/portal/assessor-data";

export function SendNotificationButton({ assignmentId }: { assignmentId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [assessmentDate, setAssessmentDate] = React.useState("");
  const [assessmentType, setAssessmentType] = React.useState<"WITNESS_ASSESSMENT" | "OFFICE_ASSESSMENT" | "DOCUMENT_REVIEW">("OFFICE_ASSESSMENT");
  const [location, setLocation] = React.useState("");
  const [scopeText, setScopeText] = React.useState("");
  const [instructions, setInstructions] = React.useState("");
  const [preparationNotes, setPreparationNotes] = React.useState("");
  const [deadline, setDeadline] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  async function handleSend() {
    setSubmitting(true);
    const result = await sendNotification({
      assignmentId,
      assessmentDate,
      assessmentType,
      location,
      scopeText,
      instructions: instructions || undefined,
      preparationNotes: preparationNotes || undefined,
      acknowledgementDeadline: deadline || undefined,
    });
    setSubmitting(false);
    if (!result.ok) return toast({ tone: "error", persistent: true, title: "Failed", description: result.error });
    toast({ tone: "success", title: "Assessment notification sent" });
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <Button variant="primary" size="sm" onClick={() => setOpen(true)}>Send assessment notification</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Send assessment notification"
        footer={<>
          <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSend} disabled={!assessmentDate || !location.trim() || !scopeText.trim()} loading={submitting}>Send</Button>
        </>}>
        <div className="flex flex-col gap-3">
          <div>
            <label className="font-sans text-sm font-medium text-text" htmlFor="an-date">Assessment date</label>
            <Input id="an-date" type="date" value={assessmentDate} onChange={(e) => setAssessmentDate(e.target.value)} className="mt-1" />
          </div>
          <div>
            <label className="font-sans text-sm font-medium text-text" htmlFor="an-type">Assessment type</label>
            <Select id="an-type" value={assessmentType} onChange={(e) => setAssessmentType(e.target.value as typeof assessmentType)} className="mt-1">
              <option value="OFFICE_ASSESSMENT">Office Assessment</option>
              <option value="WITNESS_ASSESSMENT">Witness Assessment</option>
              <option value="DOCUMENT_REVIEW">Document Review</option>
            </Select>
          </div>
          <div>
            <label className="font-sans text-sm font-medium text-text" htmlFor="an-location">Location</label>
            <Input id="an-location" value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1" />
          </div>
          <div>
            <label className="font-sans text-sm font-medium text-text" htmlFor="an-scope">Scope</label>
            <textarea id="an-scope" value={scopeText} onChange={(e) => setScopeText(e.target.value)} rows={2}
              className="mt-1 w-full rounded-[6px] border border-border bg-surface px-3 py-2 font-sans text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1" />
          </div>
          <div>
            <label className="font-sans text-sm font-medium text-text" htmlFor="an-instructions">Instructions</label>
            <textarea id="an-instructions" value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={2}
              className="mt-1 w-full rounded-[6px] border border-border bg-surface px-3 py-2 font-sans text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1" />
          </div>
          <div>
            <label className="font-sans text-sm font-medium text-text" htmlFor="an-prep">Required preparation</label>
            <textarea id="an-prep" value={preparationNotes} onChange={(e) => setPreparationNotes(e.target.value)} rows={2}
              className="mt-1 w-full rounded-[6px] border border-border bg-surface px-3 py-2 font-sans text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1" />
          </div>
          <div>
            <label className="font-sans text-sm font-medium text-text" htmlFor="an-deadline">Acknowledgement deadline</label>
            <Input id="an-deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="mt-1" />
          </div>
        </div>
      </Modal>
    </>
  );
}

export function NotificationStatusCard({ notification }: { notification: AssessmentNotificationRow | undefined }) {
  if (!notification) {
    return <p className="font-sans text-sm text-text-muted">No assessment notification has been sent yet.</p>;
  }
  return (
    <div className="rounded-md border border-border bg-surface p-4">
      <p className="font-sans text-sm text-text">
        v{notification.version} · {new Date(notification.assessmentDate).toLocaleDateString("en-US", { timeZone: "UTC" })} · {notification.location}
      </p>
      <p className="font-sans text-xs text-text-muted">{notification.scopeText}</p>
      {notification.acknowledgement ? (
        <Alert tone="success" title="Acknowledged" className="mt-3">
          Signed by {notification.acknowledgement.signatureName} on {new Date(notification.acknowledgement.acknowledgedAt).toLocaleString("en-US", { timeZone: "UTC" })}
        </Alert>
      ) : (
        <Alert tone="warning" title="Awaiting acknowledgement" className="mt-3">
          The certification body hasn&apos;t acknowledged and signed this notification yet.
        </Alert>
      )}
    </div>
  );
}

export function ReportReviewActions({ assignmentId, reportStatus }: { assignmentId: string; reportStatus: AssessmentReportStatus }) {
  const router = useRouter();
  const { toast } = useToast();
  const [submitting, setSubmitting] = React.useState(false);

  async function handleUnderReview() {
    setSubmitting(true);
    const result = await startReportReview(assignmentId);
    setSubmitting(false);
    if (!result.ok) return toast({ tone: "error", persistent: true, title: "Failed", description: result.error });
    toast({ tone: "success", title: "Report marked under review" });
    router.refresh();
  }

  async function handleFinalize() {
    setSubmitting(true);
    const result = await finalizeReport(assignmentId);
    setSubmitting(false);
    if (!result.ok) return toast({ tone: "error", persistent: true, title: "Failed", description: result.error });
    toast({ tone: "success", title: "Report finalized and released to the CB" });
    router.refresh();
  }

  if (reportStatus === "FINALIZED") {
    return <Alert tone="success" title="Report finalized">This report has been released to the certification body.</Alert>;
  }
  if (reportStatus === "DRAFT") {
    return <p className="font-sans text-sm text-text-muted">Waiting for the assessor to submit the report.</p>;
  }

  return (
    <div className="flex flex-wrap gap-3">
      {reportStatus === "SUBMITTED" && (
        <Button variant="secondary" size="sm" onClick={handleUnderReview} loading={submitting}>Mark under review</Button>
      )}
      <Button variant="primary" size="sm" onClick={handleFinalize} loading={submitting}>Finalize report</Button>
    </div>
  );
}
