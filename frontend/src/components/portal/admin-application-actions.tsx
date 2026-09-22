"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import type { ApplicationStage } from "@/lib/portal/applicant-data";
import {
  markInitialReviewComplete,
  requestApplicationInfo,
  clearApplicationInfoRequest,
  assignAssessor,
  recordDecision,
} from "@/lib/portal/admin-actions";

type ModalKind = "none" | "info" | "assign" | "decision";

/**
 * Every status-changing action here requires a reason/rationale field —
 * Phase 10's rule, not decoration: it's what makes the audit log actually
 * answer "why" later. Record Decision is deliberately a separate, more
 * heavyweight action than the others (Phase 10/12: structurally distinct
 * from the assessor's own recommendation).
 */
function AdminApplicationActions({
  applicationId,
  stage,
  infoRequested,
  assessorOptions,
}: {
  applicationId: string;
  stage: ApplicationStage;
  infoRequested: boolean;
  assessorOptions: { id: string; name: string }[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [modal, setModal] = React.useState<ModalKind>("none");
  const [note, setNote] = React.useState("");
  const [assessorUserId, setAssessorUserId] = React.useState(assessorOptions[0]?.id ?? "");
  const [outcome, setOutcome] = React.useState<"ACCREDIT" | "DECLINE" | "REQUEST_MORE_INFO">("ACCREDIT");
  const [rationale, setRationale] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  function closeAndRefresh() {
    setModal("none");
    setNote("");
    setRationale("");
    router.refresh();
  }

  async function handleMarkReviewed() {
    setSubmitting(true);
    const result = await markInitialReviewComplete(applicationId);
    setSubmitting(false);
    if (!result.ok) return toast({ tone: "error", persistent: true, title: "Failed", description: result.error });
    toast({ tone: "success", title: "Moved to Document Review" });
    router.refresh();
  }

  async function handleRequestInfo() {
    setSubmitting(true);
    const result = await requestApplicationInfo(applicationId, note);
    setSubmitting(false);
    if (!result.ok) return toast({ tone: "error", persistent: true, title: "Failed", description: result.error });
    toast({ tone: "success", title: "Information requested" });
    closeAndRefresh();
  }

  async function handleClearInfoRequest() {
    setSubmitting(true);
    await clearApplicationInfoRequest(applicationId);
    setSubmitting(false);
    toast({ tone: "success", title: "Information request cleared" });
    router.refresh();
  }

  async function handleAssign() {
    setSubmitting(true);
    const result = await assignAssessor(applicationId, assessorUserId);
    setSubmitting(false);
    if (!result.ok) return toast({ tone: "error", persistent: true, title: "Failed", description: result.error });
    const assignedName = assessorOptions.find((a) => a.id === assessorUserId)?.name ?? "the selected assessor";
    toast({ tone: "success", title: `Assigned to ${assignedName}` });
    closeAndRefresh();
  }

  async function handleDecision() {
    setSubmitting(true);
    const result = await recordDecision(applicationId, outcome, rationale);
    setSubmitting(false);
    if (!result.ok) return toast({ tone: "error", persistent: true, title: "Failed", description: result.error });
    toast({ tone: "success", title: "Decision recorded" });
    closeAndRefresh();
  }

  return (
    <div className="flex flex-wrap gap-3">
      {stage === "INITIAL_REVIEW" && (
        <Button variant="secondary" size="sm" onClick={handleMarkReviewed} loading={submitting}>
          Mark initial review complete
        </Button>
      )}
      {infoRequested ? (
        <Button variant="secondary" size="sm" onClick={handleClearInfoRequest} loading={submitting}>
          Clear information request
        </Button>
      ) : (
        <Button variant="secondary" size="sm" onClick={() => setModal("info")}>
          Request information
        </Button>
      )}
      {(stage === "SUBMITTED" || stage === "INITIAL_REVIEW" || stage === "DOCUMENT_REVIEW") && (
        <Button variant="secondary" size="sm" onClick={() => setModal("assign")}>
          Assign assessor
        </Button>
      )}
      {stage === "ASSESSMENT" && (
        <Button variant="primary" size="sm" onClick={() => setModal("decision")}>
          Record decision
        </Button>
      )}

      <Modal open={modal === "info"} onClose={() => setModal("none")} title="Request information"
        footer={<>
          <Button variant="secondary" onClick={() => setModal("none")}>Cancel</Button>
          <Button variant="primary" onClick={handleRequestInfo} disabled={!note.trim()} loading={submitting}>Send request</Button>
        </>}>
        <label className="font-sans text-sm font-medium text-text" htmlFor="info-note">What&apos;s needed from the applicant?</label>
        <textarea id="info-note" value={note} onChange={(e) => setNote(e.target.value)} rows={4}
          className="mt-2 w-full rounded-[6px] border border-border bg-surface px-3 py-2 font-sans text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1" />
      </Modal>

      <Modal open={modal === "assign"} onClose={() => setModal("none")} title="Assign assessor"
        footer={<>
          <Button variant="secondary" onClick={() => setModal("none")}>Cancel</Button>
          <Button variant="primary" onClick={handleAssign} disabled={!assessorUserId} loading={submitting}>Assign</Button>
        </>}>
        <label className="font-sans text-sm font-medium text-text" htmlFor="assessor-select">Assessor</label>
        <Select id="assessor-select" value={assessorUserId} onChange={(e) => setAssessorUserId(e.target.value)} className="mt-2">
          {assessorOptions.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </Select>
      </Modal>

      <Modal open={modal === "decision"} onClose={() => setModal("none")} title="Record decision"
        footer={<>
          <Button variant="secondary" onClick={() => setModal("none")}>Cancel</Button>
          <Button variant="primary" onClick={handleDecision} disabled={!rationale.trim()} loading={submitting}>Record decision</Button>
        </>}>
        <p className="mb-3 font-sans text-xs text-text-muted">
          This is a distinct action from the assessor&apos;s recommendation — the deciding identity is always the signed-in admin, never the assigned assessor.
        </p>
        <label className="font-sans text-sm font-medium text-text" htmlFor="decision-outcome">Outcome</label>
        <Select id="decision-outcome" value={outcome} onChange={(e) => setOutcome(e.target.value as typeof outcome)} className="mt-2">
          <option value="ACCREDIT">Accredit</option>
          <option value="DECLINE">Decline</option>
          <option value="REQUEST_MORE_INFO">Request more information</option>
        </Select>
        <label className="mt-3 block font-sans text-sm font-medium text-text" htmlFor="decision-rationale">Rationale</label>
        <textarea id="decision-rationale" value={rationale} onChange={(e) => setRationale(e.target.value)} rows={4}
          className="mt-2 w-full rounded-[6px] border border-border bg-surface px-3 py-2 font-sans text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1" />
      </Modal>
    </div>
  );
}

export { AdminApplicationActions };
