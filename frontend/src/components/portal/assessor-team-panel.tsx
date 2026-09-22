"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { Alert } from "@/components/ui/alert";
import { useToast } from "@/components/ui/toast";
import { saveTeamMembers, submitTeamProposal } from "@/lib/portal/assessor-team-actions";
import { PROPOSAL_STATUS_LABEL, type AssessorTeamProposalDetail, type AssessorTeamMemberInput } from "@/lib/portal/assessor-team-data";

const STATUS_TONE: Record<AssessorTeamProposalDetail["status"], "success" | "warning" | "info" | "neutral" | "error"> = {
  DRAFT: "neutral",
  SUBMITTED: "info",
  UNDER_REVIEW: "info",
  APPROVED: "success",
  CHANGES_REQUESTED: "warning",
  REJECTED: "error",
};

function emptyMember(): AssessorTeamMemberInput {
  return { name: "", role: "", expertise: "", qualification: "", experienceYears: undefined, availabilityNote: "" };
}

export function AssessorTeamPanel({ applicationId, proposal }: { applicationId: string; proposal: AssessorTeamProposalDetail }) {
  const router = useRouter();
  const { toast } = useToast();
  const editable = proposal.status === "DRAFT" || proposal.status === "CHANGES_REQUESTED";
  const [members, setMembers] = React.useState<AssessorTeamMemberInput[]>(
    proposal.members.length > 0 ? proposal.members.map((m) => ({ ...m })) : [emptyMember()],
  );
  const [saving, setSaving] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  function updateMember(index: number, patch: Partial<AssessorTeamMemberInput>) {
    setMembers((prev) => prev.map((m, i) => (i === index ? { ...m, ...patch } : m)));
  }

  async function handleSave() {
    setSaving(true);
    const result = await saveTeamMembers(proposal.id, members.filter((m) => m.name.trim() && m.role.trim()));
    setSaving(false);
    if (!result.ok) return toast({ tone: "error", persistent: true, title: "Couldn't save", description: result.error });
    toast({ tone: "success", title: "Draft saved" });
    router.refresh();
  }

  async function handleSubmit() {
    setSubmitting(true);
    await handleSave();
    const result = await submitTeamProposal(proposal.id, applicationId);
    setSubmitting(false);
    if (!result.ok) return toast({ tone: "error", persistent: true, title: "Couldn't submit", description: result.error });
    toast({ tone: "success", title: "Assessor team submitted for review" });
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge tone={STATUS_TONE[proposal.status]} label={PROPOSAL_STATUS_LABEL[proposal.status]} />
        {proposal.submittedAt && <span className="font-sans text-xs text-text-muted">Submitted {proposal.submittedAt}</span>}
      </div>

      {proposal.status === "CHANGES_REQUESTED" && proposal.reviewNote && (
        <Alert tone="warning" title="Changes requested">{proposal.reviewNote}</Alert>
      )}
      {proposal.status === "REJECTED" && proposal.reviewNote && (
        <Alert tone="error" title="Proposal rejected">{proposal.reviewNote}</Alert>
      )}
      {proposal.status === "APPROVED" && (
        <Alert tone="success" title="Team approved">
          Your proposed assessment team was approved{proposal.reviewedByName ? ` by ${proposal.reviewedByName}` : ""}.
        </Alert>
      )}

      {editable ? (
        <div className="flex flex-col gap-4">
          {members.map((m, i) => (
            <div key={i} className="grid grid-cols-1 gap-3 rounded-md border border-border bg-surface p-4 sm:grid-cols-2">
              <div>
                <label className="font-sans text-xs font-medium text-text-muted">Name</label>
                <Input value={m.name} onChange={(e) => updateMember(i, { name: e.target.value })} placeholder="Assessor full name" className="mt-1" />
              </div>
              <div>
                <label className="font-sans text-xs font-medium text-text-muted">Role</label>
                <Input value={m.role} onChange={(e) => updateMember(i, { role: e.target.value })} placeholder="Team Leader / Technical Expert" className="mt-1" />
              </div>
              <div>
                <label className="font-sans text-xs font-medium text-text-muted">Expertise</label>
                <Input value={m.expertise ?? ""} onChange={(e) => updateMember(i, { expertise: e.target.value })} className="mt-1" />
              </div>
              <div>
                <label className="font-sans text-xs font-medium text-text-muted">Qualification</label>
                <Input value={m.qualification ?? ""} onChange={(e) => updateMember(i, { qualification: e.target.value })} className="mt-1" />
              </div>
              <div>
                <label className="font-sans text-xs font-medium text-text-muted">Years of experience</label>
                <Input
                  type="number"
                  value={m.experienceYears ?? ""}
                  onChange={(e) => updateMember(i, { experienceYears: e.target.value ? Number(e.target.value) : undefined })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="font-sans text-xs font-medium text-text-muted">Availability</label>
                <Input value={m.availabilityNote ?? ""} onChange={(e) => updateMember(i, { availabilityNote: e.target.value })} className="mt-1" />
              </div>
              <div className="sm:col-span-2">
                <Button variant="ghost" size="sm" onClick={() => setMembers((prev) => prev.filter((_, idx) => idx !== i))} disabled={members.length === 1}>
                  Remove
                </Button>
              </div>
            </div>
          ))}
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" size="sm" onClick={() => setMembers((prev) => [...prev, emptyMember()])}>
              + Add team member
            </Button>
            <Button variant="secondary" size="sm" onClick={handleSave} loading={saving}>
              Save draft
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSubmit}
              loading={submitting}
              disabled={!members.some((m) => m.name.trim() && m.role.trim())}
            >
              Submit for review
            </Button>
          </div>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {proposal.members.map((m) => (
            <li key={m.id} className="rounded-md border border-border bg-surface px-4 py-3">
              <p className="font-sans text-sm font-medium text-text">{m.name} — {m.role}</p>
              <p className="font-sans text-xs text-text-muted">
                {[m.expertise, m.qualification, m.experienceYears ? `${m.experienceYears} yrs experience` : null].filter(Boolean).join(" · ")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
