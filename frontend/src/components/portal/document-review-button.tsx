"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { reviewDocument } from "@/lib/portal/document-review-actions";

export function DocumentReviewButton({ versionId, applicationId }: { versionId: string; applicationId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [comment, setComment] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  async function handleDecision(decision: "APPROVED" | "NEEDS_REVISION") {
    setSubmitting(true);
    const result = await reviewDocument(versionId, decision, comment, applicationId);
    setSubmitting(false);
    if (!result.ok) return toast({ tone: "error", persistent: true, title: "Failed", description: result.error });
    toast({ tone: "success", title: decision === "APPROVED" ? "Document approved" : "Changes requested" });
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>Review</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Review document"
        footer={<>
          <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="ghost" onClick={() => handleDecision("NEEDS_REVISION")} disabled={!comment.trim()} loading={submitting}>Request changes</Button>
          <Button variant="primary" onClick={() => handleDecision("APPROVED")} loading={submitting}>Approve</Button>
        </>}>
        <label className="font-sans text-sm font-medium text-text" htmlFor="doc-review-comment">Comment (required to request changes)</label>
        <textarea id="doc-review-comment" value={comment} onChange={(e) => setComment(e.target.value)} rows={4}
          className="mt-2 w-full rounded-[6px] border border-border bg-surface px-3 py-2 font-sans text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1" />
      </Modal>
    </>
  );
}
