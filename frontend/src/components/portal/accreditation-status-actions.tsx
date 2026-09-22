"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import type { VerificationStatus } from "@/lib/verification-records";
import { changeAccreditationStatus } from "@/lib/portal/admin-actions";

const ACTIONS: { target: VerificationStatus; label: string; variant: "destructive" | "destructive-outline" | "secondary" }[] = [
  { target: "SUSPENDED", label: "Suspend", variant: "destructive-outline" },
  { target: "WITHDRAWN", label: "Withdraw", variant: "destructive" },
  { target: "CANCELLED", label: "Cancel", variant: "destructive" },
];

/**
 * Every status-changing action requires a reason — Phase 10 Section 0.
 * Change propagates immediately to the public /verify page since that
 * route is force-dynamic with no long-TTL cache (Phase 7/11).
 */
function AccreditationStatusActions({ reference, currentStatus }: { reference: string; currentStatus: VerificationStatus }) {
  const router = useRouter();
  const { toast } = useToast();
  const [target, setTarget] = React.useState<VerificationStatus | null>(null);
  const [reason, setReason] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  async function handleConfirm() {
    if (!target) return;
    setSubmitting(true);
    const result = await changeAccreditationStatus(reference, target, reason);
    setSubmitting(false);
    if (!result.ok) {
      toast({ tone: "error", persistent: true, title: "Couldn't update status", description: result.error });
      return;
    }
    toast({ tone: "success", title: `Status changed to ${target}` });
    setTarget(null);
    setReason("");
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-3">
      {ACTIONS.filter((a) => a.target !== currentStatus).map((a) => (
        <Button key={a.target} variant={a.variant} size="sm" onClick={() => setTarget(a.target)}>
          {a.label}
        </Button>
      ))}
      <Modal
        open={target !== null}
        onClose={() => setTarget(null)}
        title={`Change status to ${target}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleConfirm} disabled={!reason.trim()} loading={submitting}>
              Confirm
            </Button>
          </>
        }
      >
        <label htmlFor="status-reason" className="font-sans text-sm font-medium text-text">
          Reason (required — recorded in the audit log)
        </label>
        <textarea
          id="status-reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          className="mt-2 w-full rounded-[6px] border border-border bg-surface px-3 py-2 font-sans text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
        />
      </Modal>
    </div>
  );
}

export { AccreditationStatusActions };
