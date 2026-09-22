"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import {
  approveApplicationRequestAction,
  rejectApplicationRequestAction,
} from "@/lib/portal/application-request-actions";

type ModalKind = "none" | "approve" | "reject";

/** Approve creates the applicant's account and emails them; Reject requires a reason that is emailed to them. */
function AdminApplicationRequestReview({ requestId, email }: { requestId: string; email: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [modal, setModal] = React.useState<ModalKind>("none");
  const [reason, setReason] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  function report(result: Awaited<ReturnType<typeof approveApplicationRequestAction>>, done: string) {
    if (!result.ok) return toast({ tone: "error", persistent: true, title: "Failed", description: result.error });
    if (result.mailSent) return toast({ tone: "success", title: done, description: `Email sent to ${email}.` });
    toast({
      tone: "warning",
      persistent: true,
      title: `${done}, but the email was NOT sent`,
      description: result.mailError ?? "Email delivery failed. Please contact the applicant directly.",
    });
  }

  async function handleApprove() {
    setSubmitting(true);
    const result = await approveApplicationRequestAction(requestId);
    setSubmitting(false);
    setModal("none");
    report(result, "Application approved");
    if (result.ok) router.refresh();
  }

  async function handleReject() {
    setSubmitting(true);
    const result = await rejectApplicationRequestAction(requestId, reason);
    setSubmitting(false);
    if (!result.ok) return toast({ tone: "error", persistent: true, title: "Failed", description: result.error });
    setModal("none");
    setReason("");
    report(result, "Application rejected");
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="primary" onClick={() => setModal("approve")}>
        Approve
      </Button>
      <Button variant="secondary" onClick={() => setModal("reject")}>
        Reject
      </Button>

      <Modal
        open={modal === "approve"}
        onClose={() => setModal("none")}
        title="Approve this application?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModal("none")}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleApprove} loading={submitting}>
              Approve and send email
            </Button>
          </>
        }
      >
        <p className="font-sans text-sm text-text">
          This creates a Certification Body account for <strong>{email}</strong> and emails them that they can now sign in
          with this address.
        </p>
      </Modal>

      <Modal
        open={modal === "reject"}
        onClose={() => setModal("none")}
        title="Reject this application"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModal("none")}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleReject} disabled={reason.trim().length < 5} loading={submitting}>
              Reject and send email
            </Button>
          </>
        }
      >
        <label className="font-sans text-sm font-medium text-text" htmlFor="reject-reason">
          Reason for rejection (emailed to the applicant)
        </label>
        <textarea
          id="reject-reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={5}
          className="mt-2 w-full rounded-[6px] border border-border bg-surface px-3 py-2 font-sans text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
        />
      </Modal>
    </div>
  );
}

export { AdminApplicationRequestReview };
