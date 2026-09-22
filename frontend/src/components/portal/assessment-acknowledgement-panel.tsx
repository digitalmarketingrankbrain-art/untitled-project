"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { useToast } from "@/components/ui/toast";
import { acknowledgeAssessmentNotification } from "@/lib/portal/assessment-notification-actions";
import type { AssessmentNotificationRow } from "@/lib/portal/assessment-notification-data";

export function AssessmentAcknowledgementPanel({ notification }: { notification: AssessmentNotificationRow | undefined }) {
  const router = useRouter();
  const { toast } = useToast();
  const [signatureName, setSignatureName] = React.useState("");
  const [confirmed, setConfirmed] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  if (!notification) return null;

  if (notification.acknowledgement) {
    return (
      <Alert tone="success" title="Assessment notification acknowledged" className="mb-6">
        Signed by {notification.acknowledgement.signatureName} on {new Date(notification.acknowledgement.acknowledgedAt).toLocaleString("en-US", { timeZone: "UTC" })}.
      </Alert>
    );
  }

  async function handleSign() {
    setSubmitting(true);
    const result = await acknowledgeAssessmentNotification(notification!.id, signatureName);
    setSubmitting(false);
    if (!result.ok) return toast({ tone: "error", persistent: true, title: "Couldn't sign", description: result.error });
    toast({ tone: "success", title: "Notification acknowledged and signed" });
    router.refresh();
  }

  return (
    <div className="mb-6 rounded-lg border border-warning-text/30 bg-warning-surface p-5">
      <h2 className="font-sans text-sm font-semibold text-warning-text">Assessment notification — acknowledgement required</h2>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <p className="font-sans text-sm text-text"><span className="text-text-muted">Date:</span> {new Date(notification.assessmentDate).toLocaleDateString("en-US", { timeZone: "UTC" })}</p>
        <p className="font-sans text-sm text-text"><span className="text-text-muted">Location:</span> {notification.location}</p>
        <p className="font-sans text-sm text-text sm:col-span-2"><span className="text-text-muted">Scope:</span> {notification.scopeText}</p>
        {notification.instructions && <p className="font-sans text-sm text-text sm:col-span-2"><span className="text-text-muted">Instructions:</span> {notification.instructions}</p>}
        {notification.preparationNotes && <p className="font-sans text-sm text-text sm:col-span-2"><span className="text-text-muted">Preparation:</span> {notification.preparationNotes}</p>}
      </div>

      <label className="mt-4 flex items-start gap-2 font-sans text-sm text-text">
        <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-0.5" />
        I acknowledge and accept the assessment notification/details above.
      </label>

      <div className="mt-3">
        <label className="font-sans text-xs font-medium text-text-muted" htmlFor="sig-name">Type your full name to digitally sign</label>
        <Input id="sig-name" value={signatureName} onChange={(e) => setSignatureName(e.target.value)} className="mt-1 max-w-sm" />
      </div>

      <Button
        variant="primary"
        size="sm"
        className="mt-4"
        onClick={handleSign}
        disabled={!confirmed || !signatureName.trim()}
        loading={submitting}
      >
        Sign & Submit
      </Button>
    </div>
  );
}
