"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";
import { saveRequiredForm, removeRequiredForm } from "@/lib/portal/required-forms-actions";
import type { RequiredFormRow, RequiredFormInput } from "@/lib/portal/required-forms-data";

function emptyForm(programId: string): RequiredFormInput {
  return { programId, name: "", description: "", isMandatory: true, deadlineDays: null, applicableStage: null, isActive: true, sortOrder: 0 };
}

export function RequiredFormsPanel({ forms, programs }: { forms: RequiredFormRow[]; programs: { id: string; name: string; slug: string }[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<RequiredFormInput>(emptyForm(programs[0]?.id ?? ""));
  const [submitting, setSubmitting] = React.useState(false);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm(programs[0]?.id ?? ""));
    setModalOpen(true);
  }

  function openEdit(row: RequiredFormRow) {
    setEditingId(row.id);
    setForm({
      programId: row.programId,
      name: row.name,
      description: row.description ?? "",
      isMandatory: row.isMandatory,
      deadlineDays: row.deadlineDays,
      applicableStage: row.applicableStage,
      isActive: row.isActive,
      sortOrder: row.sortOrder,
    });
    setModalOpen(true);
  }

  async function handleSave() {
    setSubmitting(true);
    const result = await saveRequiredForm(editingId, form);
    setSubmitting(false);
    if (!result.ok) return toast({ tone: "error", persistent: true, title: "Failed", description: result.error });
    toast({ tone: "success", title: editingId ? "Form updated" : "Form created" });
    setModalOpen(false);
    router.refresh();
  }

  async function handleDeactivate(id: string) {
    const result = await removeRequiredForm(id);
    if (!result.ok) return toast({ tone: "error", persistent: true, title: "Failed", description: result.error });
    toast({ tone: "success", title: "Form deactivated" });
    router.refresh();
  }

  const columns: DataTableColumn<RequiredFormRow>[] = [
    { key: "name", header: "Form name", render: (f) => f.name },
    { key: "programName", header: "Scheme", render: (f) => f.programName },
    { key: "isMandatory", header: "Mandatory", render: (f) => (f.isMandatory ? "Yes" : "No") },
    { key: "deadlineDays", header: "Deadline (days)", mono: true, render: (f) => (f.deadlineDays != null ? String(f.deadlineDays) : "—") },
    { key: "applicableStage", header: "Stage", render: (f) => f.applicableStage ?? "Any" },
    { key: "isActive", header: "Status", render: (f) => <StatusBadge tone={f.isActive ? "success" : "neutral"} label={f.isActive ? "Active" : "Inactive"} size="sm" /> },
    {
      key: "id",
      header: "",
      render: (f) => (
        <div className="flex gap-3">
          <button onClick={() => openEdit(f)} className="font-sans text-sm text-secondary hover:underline">Edit</button>
          {f.isActive && (
            <button onClick={() => handleDeactivate(f.id)} className="font-sans text-sm text-text-muted hover:underline">Deactivate</button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button variant="primary" size="sm" onClick={openCreate}>+ New required form</Button>
      </div>
      <DataTable columns={columns} rows={forms} getRowKey={(f) => f.id} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit required form" : "New required form"}
        footer={<>
          <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave} loading={submitting}>Save</Button>
        </>}>
        <div className="flex flex-col gap-3">
          <div>
            <label className="font-sans text-sm font-medium text-text" htmlFor="rf-name">Form name</label>
            <Input id="rf-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1" />
          </div>
          <div>
            <label className="font-sans text-sm font-medium text-text" htmlFor="rf-program">Scheme</label>
            <Select id="rf-program" value={form.programId} onChange={(e) => setForm({ ...form, programId: e.target.value })} className="mt-1">
              {programs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </Select>
          </div>
          <div>
            <label className="font-sans text-sm font-medium text-text" htmlFor="rf-desc">Description</label>
            <textarea id="rf-desc" value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
              className="mt-1 w-full rounded-[6px] border border-border bg-surface px-3 py-2 font-sans text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1" />
          </div>
          <div>
            <label className="font-sans text-sm font-medium text-text" htmlFor="rf-stage">Applicable stage</label>
            <Select id="rf-stage" value={form.applicableStage ?? ""} onChange={(e) => setForm({ ...form, applicableStage: (e.target.value || null) as RequiredFormInput["applicableStage"] })} className="mt-1">
              <option value="">Any stage</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="INITIAL_REVIEW">Initial Review</option>
              <option value="DOCUMENT_REVIEW">Document Review</option>
              <option value="ASSESSMENT">Assessment</option>
              <option value="DECISION">Decision</option>
            </Select>
          </div>
          <div>
            <label className="font-sans text-sm font-medium text-text" htmlFor="rf-deadline">Deadline (days after becoming required)</label>
            <Input id="rf-deadline" type="number" value={form.deadlineDays ?? ""} onChange={(e) => setForm({ ...form, deadlineDays: e.target.value ? Number(e.target.value) : null })} className="mt-1" />
          </div>
          <label className="flex items-center gap-2 font-sans text-sm text-text">
            <input type="checkbox" checked={form.isMandatory} onChange={(e) => setForm({ ...form, isMandatory: e.target.checked })} />
            Mandatory
          </label>
          <label className="flex items-center gap-2 font-sans text-sm text-text">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
            Active
          </label>
        </div>
      </Modal>
    </div>
  );
}
