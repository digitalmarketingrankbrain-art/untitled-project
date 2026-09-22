"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { acceptAssignment, declineAssignment } from "@/lib/portal/assessor-actions";

/**
 * Accept/Decline is first-class on a pending assignment, not buried —
 * Phase 9. Decline requires a reason, visible to admin only, which closes
 * the loop for admin and creates a record supporting the impartiality/
 * conflict-of-interest disclosure principle from Phase 6 Governance.
 */
function AssignmentAcceptDecline({ assignmentId }: { assignmentId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [declineOpen, setDeclineOpen] = React.useState(false);
  const [reason, setReason] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  async function handleAccept() {
    setSubmitting(true);
    const result = await acceptAssignment(assignmentId);
    setSubmitting(false);
    if (!result.ok) {
      toast({ tone: "error", persistent: true, title: "Couldn't accept", description: result.error });
      return;
    }
    toast({ tone: "success", title: "Assignment accepted" });
    router.refresh();
  }

  async function handleDecline() {
    setSubmitting(true);
    const result = await declineAssignment(assignmentId, reason);
    setSubmitting(false);
    if (!result.ok) {
      toast({ tone: "error", persistent: true, title: "Couldn't decline", description: result.error });
      return;
    }
    setDeclineOpen(false);
    toast({ tone: "success", title: "Assignment declined" });
    router.refresh();
  }

  return (
    <div className="flex gap-3">
      <Button variant="primary" onClick={handleAccept} loading={submitting}>
        Accept assignment
      </Button>
      <Button variant="destructive-outline" onClick={() => setDeclineOpen(true)} loading={submitting}>
        Decline
      </Button>
      <Modal
        open={declineOpen}
        onClose={() => setDeclineOpen(false)}
        title="Decline assignment"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeclineOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDecline} disabled={!reason.trim()} loading={submitting}>
              Decline assignment
            </Button>
          </>
        }
      >
        <label htmlFor="declineReason" className="font-sans text-sm font-medium text-text">
          Reason (visible to admin only)
        </label>
        <textarea
          id="declineReason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          className="mt-2 w-full rounded-[6px] border border-border bg-surface px-3 py-2 font-sans text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
          placeholder="e.g. conflict of interest, capacity, competence mismatch"
        />
      </Modal>
    </div>
  );
}

export { AssignmentAcceptDecline };
