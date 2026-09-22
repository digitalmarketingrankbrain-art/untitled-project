"use client";

import * as React from "react";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";
import { useToast } from "@/components/ui/toast";
import { addTeamMemberAction } from "@/lib/portal/cab-info-actions";
import type { TeamMemberEntry } from "@/lib/portal/cab-info-data";

const STATUS_TONE = { ACTIVE: "success", SUSPENDED: "warning", LOCKED: "error" } as const;
const EMPTY_FORM = { name: "", email: "", title: "", membershipRole: "MEMBER" as const };

function TeamMembersTable({ members }: { members: TeamMemberEntry[] }) {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState(EMPTY_FORM);
  const [added, setAdded] = React.useState<{ email: string } | null>(null);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }) as typeof form);
  }

  function closeModal() {
    setOpen(false);
    setAdded(null);
    setForm(EMPTY_FORM);
  }

  async function handleAdd() {
    setSaving(true);
    const result = await addTeamMemberAction(form);
    setSaving(false);
    if (result.ok) {
      toast({ tone: "success", title: "Team member added." });
      setAdded({ email: form.email });
    } else {
      toast({ tone: "error", title: result.error ?? "Couldn't add team member.", persistent: true });
    }
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button size="sm" onClick={() => setOpen(true)}>
          Add Team Member
        </Button>
      </div>

      {members.length === 0 ? (
        <EmptyState title="No team members yet." description="Members added to this organisation will appear here." />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-background-portal">
              <tr>
                {["Name", "Role", "Email", "Status", "Access Level"].map((h) => (
                  <th key={h} className="border-b border-border px-4 py-3 text-left font-sans text-xs font-medium uppercase tracking-[0.02em] text-text-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3 text-text">{m.name}</td>
                  <td className="px-4 py-3 text-text">{m.title ?? "—"}</td>
                  <td className="px-4 py-3 text-text">{m.email}</td>
                  <td className="px-4 py-3">
                    <StatusBadge tone={STATUS_TONE[m.status]} label={m.status === "ACTIVE" ? "Active" : m.status === "SUSPENDED" ? "Suspended" : "Locked"} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-text">{m.membershipRole === "PRIMARY_CONTACT" ? "Primary Contact" : "Member"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={open}
        onClose={closeModal}
        title="Add Team Member"
        footer={
          added ? (
            <Button onClick={closeModal}>Done</Button>
          ) : (
            <>
              <Button variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button onClick={handleAdd} loading={saving} disabled={!form.name.trim() || !form.email.trim()}>
                Add Team Member
              </Button>
            </>
          )
        }
      >
        {added ? (
          <div className="flex flex-col gap-4">
            <Alert tone="success" title="Team member added">
              {added.email} can now sign in — login sends a one-time code to their email, no password needed.
            </Alert>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <FormField label="Full name" htmlFor="member-name" required>
              <Input id="member-name" value={form.name} onChange={(e) => set("name", e.target.value)} />
            </FormField>
            <FormField label="Email" htmlFor="member-email" required>
              <Input id="member-email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
            </FormField>
            <FormField label="Title / role" htmlFor="member-title" hint="e.g. Certification Manager, Operations Manager">
              <Input id="member-title" value={form.title} onChange={(e) => set("title", e.target.value)} />
            </FormField>
            <FormField label="Access level" htmlFor="member-access">
              <Select id="member-access" value={form.membershipRole} onChange={(e) => set("membershipRole", e.target.value)}>
                <option value="MEMBER">Member</option>
                <option value="PRIMARY_CONTACT">Primary Contact</option>
              </Select>
            </FormField>
          </div>
        )}
      </Modal>
    </div>
  );
}

export { TeamMembersTable };
