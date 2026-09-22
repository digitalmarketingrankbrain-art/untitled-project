"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { addNcAssessorRemark, acceptNc, rejectNc, closeNc } from "@/lib/portal/nc-actions";
import type { NonConformityDetail } from "@/lib/portal/nc-data";

type ModalKind = "none" | "remark" | "accept" | "reject" | "close";

export function AdminNcReviewActions({ nc }: { nc: NonConformityDetail }) {
  const router = useRouter();
  const { toast } = useToast();
  const [modal, setModal] = React.useState<ModalKind>("none");
  const [note, setNote] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  function closeAndRefresh() {
    setModal("none");
    setNote("");
    router.refresh();
  }

  async function run(action: () => Promise<{ ok: boolean; error?: string }>, successTitle: string) {
    setSubmitting(true);
    const result = await action();
    setSubmitting(false);
    if (!result.ok) return toast({ tone: "error", persistent: true, title: "Failed", description: result.error });
    toast({ tone: "success", title: successTitle });
    closeAndRefresh();
  }

  if (nc.status === "CLOSED") return null;

  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="secondary" size="sm" onClick={() => setModal("remark")}>Add assessor remark</Button>
      {(nc.status === "RESPONSE_SUBMITTED" || nc.status === "UNDER_REVIEW") && (
        <>
          <Button variant="primary" size="sm" onClick={() => setModal("accept")}>Accept response</Button>
          <Button variant="ghost" size="sm" onClick={() => setModal("reject")}>Request further action</Button>
        </>
      )}
      {nc.status === "ACCEPTED" && (
        <Button variant="primary" size="sm" onClick={() => setModal("close")}>Close NC</Button>
      )}

      <Modal open={modal === "remark"} onClose={() => setModal("none")} title="Add assessor remark"
        footer={<><Button variant="secondary" onClick={() => setModal("none")}>Cancel</Button>
          <Button variant="primary" onClick={() => run(() => addNcAssessorRemark(nc.id, note), "Remark added")} disabled={!note.trim()} loading={submitting}>Add</Button></>}>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4}
          className="w-full rounded-[6px] border border-border bg-surface px-3 py-2 font-sans text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1" />
      </Modal>

      <Modal open={modal === "accept"} onClose={() => setModal("none")} title="Accept NC response"
        footer={<><Button variant="secondary" onClick={() => setModal("none")}>Cancel</Button>
          <Button variant="primary" onClick={() => run(() => acceptNc(nc.id, note), "Response accepted")} loading={submitting}>Accept</Button></>}>
        <p className="mb-3 font-sans text-xs text-text-muted">Accepting locks the NC — the CB won&apos;t be able to submit further responses.</p>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Optional note"
          className="w-full rounded-[6px] border border-border bg-surface px-3 py-2 font-sans text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1" />
      </Modal>

      <Modal open={modal === "reject"} onClose={() => setModal("none")} title="Request further action"
        footer={<><Button variant="secondary" onClick={() => setModal("none")}>Cancel</Button>
          <Button variant="primary" onClick={() => run(() => rejectNc(nc.id, note), "Further action requested")} disabled={!note.trim()} loading={submitting}>Send</Button></>}>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} placeholder="What needs to change?"
          className="w-full rounded-[6px] border border-border bg-surface px-3 py-2 font-sans text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1" />
      </Modal>

      <Modal open={modal === "close"} onClose={() => setModal("none")} title="Close NC"
        footer={<><Button variant="secondary" onClick={() => setModal("none")}>Cancel</Button>
          <Button variant="primary" onClick={() => run(() => closeNc(nc.id, note), "NC closed")} loading={submitting}>Close</Button></>}>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Optional closing note"
          className="w-full rounded-[6px] border border-border bg-surface px-3 py-2 font-sans text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1" />
      </Modal>
    </div>
  );
}
