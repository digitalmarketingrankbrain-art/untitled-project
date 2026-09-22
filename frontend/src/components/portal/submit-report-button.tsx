"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { submitReport } from "@/lib/portal/assessor-actions";

/**
 * Submission is a distinct, deliberate action separate from ongoing
 * checklist autosave — Phase 9: it triggers the applicant's Decision
 * stage, so it shouldn't happen accidentally.
 */
function SubmitReportButton({ assignmentId }: { assignmentId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [confirming, setConfirming] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  async function handleSubmit() {
    setSubmitting(true);
    const result = await submitReport(assignmentId);
    setSubmitting(false);
    setConfirming(false);
    if (!result.ok) {
      toast({ tone: "error", persistent: true, title: "Couldn't submit report", description: result.error });
      return;
    }
    toast({ tone: "success", title: "Report submitted" });
    router.refresh();
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-3">
        <span className="font-sans text-sm text-text-muted">Submit this report? This can&apos;t be undone.</span>
        <Button variant="destructive" size="sm" onClick={handleSubmit} loading={submitting}>
          {submitting ? "Submitting…" : "Confirm submit"}
        </Button>
        <Button variant="secondary" size="sm" onClick={() => setConfirming(false)}>Cancel</Button>
      </div>
    );
  }

  return (
    <Button variant="primary" onClick={() => setConfirming(true)}>
      Submit report
    </Button>
  );
}

export { SubmitReportButton };
