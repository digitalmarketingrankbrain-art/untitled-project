"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { approveTeamProposal, requestTeamChanges, rejectTeamProposal, linkTeamMemberToAssessor } from "@/lib/portal/assessor-team-actions";
import type { AssessorTeamProposalDetail } from "@/lib/portal/assessor-team-data";

type ModalKind = "none" | "approve" | "changes" | "reject";

export function AssessorLinkPicker({
  memberId,
  proposalId,
  currentLinkedId,
  assessors,
}: {
  memberId: string;
  proposalId: string;
  currentLinkedId: string | null;
  assessors: { id: string; name: string; email: string }[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [value, setValue] = React.useState(currentLinkedId ?? "");
  const [saving, setSaving] = React.useState(false);

  async function handleChange(next: string) {
    setValue(next);
    setSaving(true);
    const result = await linkTeamMemberToAssessor(memberId, next || null, proposalId);
    setSaving(false);
    if (!result.ok) return toast({ tone: "error", persistent: true, title: "Failed", description: result.error });
    router.refresh();
  }

  return (
    <Select value={value} onChange={(e) => handleChange(e.target.value)} disabled={saving} className="mt-1 max-w-xs">
      <option value="">Not linked — no assignment will be created</option>
      {assessors.map((a) => (
        <option key={a.id} value={a.id}>{a.name} ({a.email})</option>
      ))}
    </Select>
  );
}

export function AdminAssessorTeamReview({ proposal }: { proposal: AssessorTeamProposalDetail }) {
  const router = useRouter();
  const { toast } = useToast();
  const [modal, setModal] = React.useState<ModalKind>("none");
  const [note, setNote] = React.useState("");
  const [dueDate, setDueDate] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  function closeAndRefresh() {
    setModal("none");
    setNote("");
    router.refresh();
  }

  async function handleApprove() {
    setSubmitting(true);
    const result = await approveTeamProposal(proposal.id, dueDate, note);
    setSubmitting(false);
    if (!result.ok) return toast({ tone: "error", persistent: true, title: "Failed", description: result.error });
    toast({ tone: "success", title: `Approved — ${result.assignmentsCreated} assignment(s) created` });
    closeAndRefresh();
  }

  async function handleChanges() {
    setSubmitting(true);
    const result = await requestTeamChanges(proposal.id, note);
    setSubmitting(false);
    if (!result.ok) return toast({ tone: "error", persistent: true, title: "Failed", description: result.error });
    toast({ tone: "success", title: "Changes requested" });
    closeAndRefresh();
  }

  async function handleReject() {
    setSubmitting(true);
    const result = await rejectTeamProposal(proposal.id, note);
    setSubmitting(false);
    if (!result.ok) return toast({ tone: "error", persistent: true, title: "Failed", description: result.error });
    toast({ tone: "success", title: "Proposal rejected" });
    closeAndRefresh();
  }

  if (proposal.status !== "SUBMITTED") {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="primary" size="sm" onClick={() => setModal("approve")}>Approve</Button>
      <Button variant="secondary" size="sm" onClick={() => setModal("changes")}>Request changes</Button>
      <Button variant="ghost" size="sm" onClick={() => setModal("reject")}>Reject</Button>

      <Modal open={modal === "approve"} onClose={() => setModal("none")} title="Approve assessor team"
        footer={<>
          <Button variant="secondary" onClick={() => setModal("none")}>Cancel</Button>
          <Button variant="primary" onClick={handleApprove} disabled={!dueDate} loading={submitting}>Approve</Button>
        </>}>
        <p className="mb-3 font-sans text-xs text-text-muted">
          Approving creates a real assignment for each proposed member already linked to an assessor account.
          Members without a linked account are recorded but won&apos;t get a working assignment yet.
        </p>
        <label className="font-sans text-sm font-medium text-text" htmlFor="due-date">Assessment due date</label>
        <Input id="due-date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="mt-2" />
        <label className="mt-3 block font-sans text-sm font-medium text-text" htmlFor="approve-note">Note (optional)</label>
        <textarea id="approve-note" value={note} onChange={(e) => setNote(e.target.value)} rows={3}
          className="mt-2 w-full rounded-[6px] border border-border bg-surface px-3 py-2 font-sans text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1" />
      </Modal>

      <Modal open={modal === "changes"} onClose={() => setModal("none")} title="Request changes"
        footer={<>
          <Button variant="secondary" onClick={() => setModal("none")}>Cancel</Button>
          <Button variant="primary" onClick={handleChanges} disabled={!note.trim()} loading={submitting}>Send</Button>
        </>}>
        <label className="font-sans text-sm font-medium text-text" htmlFor="changes-note">What needs to change?</label>
        <textarea id="changes-note" value={note} onChange={(e) => setNote(e.target.value)} rows={4}
          className="mt-2 w-full rounded-[6px] border border-border bg-surface px-3 py-2 font-sans text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1" />
      </Modal>

      <Modal open={modal === "reject"} onClose={() => setModal("none")} title="Reject proposal"
        footer={<>
          <Button variant="secondary" onClick={() => setModal("none")}>Cancel</Button>
          <Button variant="primary" onClick={handleReject} disabled={!note.trim()} loading={submitting}>Reject</Button>
        </>}>
        <label className="font-sans text-sm font-medium text-text" htmlFor="reject-note">Reason</label>
        <textarea id="reject-note" value={note} onChange={(e) => setNote(e.target.value)} rows={4}
          className="mt-2 w-full rounded-[6px] border border-border bg-surface px-3 py-2 font-sans text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1" />
      </Modal>
    </div>
  );
}
