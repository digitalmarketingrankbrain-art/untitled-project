"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { uploadFindingEvidence, raiseNcFromFinding, saveReportContent } from "@/lib/portal/assessor-actions";

export function EvidenceUploadField({ assignmentId, criterionId }: { assignmentId: string; criterionId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [uploading, setUploading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const result = await uploadFindingEvidence(assignmentId, criterionId, file);
    setUploading(false);
    if (!result.ok) return toast({ tone: "error", persistent: true, title: "Upload failed", description: result.error });
    toast({ tone: "success", title: "Evidence uploaded" });
    if (inputRef.current) inputRef.current.value = "";
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <input ref={inputRef} type="file" onChange={handleFile} disabled={uploading} className="font-sans text-xs text-text-muted" />
      {uploading && <span className="font-sans text-xs text-text-muted">Uploading…</span>}
    </div>
  );
}

export function RaiseNcButton({
  assignmentId,
  criterionId,
  requirementText,
}: {
  assignmentId: string;
  criterionId: string;
  requirementText: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [standardReference, setStandardReference] = React.useState("");
  const [dueDate, setDueDate] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  async function handleRaise() {
    setSubmitting(true);
    const result = await raiseNcFromFinding(assignmentId, criterionId, standardReference, requirementText, dueDate);
    setSubmitting(false);
    if (!result.ok) return toast({ tone: "error", persistent: true, title: "Couldn't raise NC", description: result.error });
    toast({ tone: "success", title: `NC ${result.ncNumber} raised` });
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>Raise NC</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Raise non-conformity"
        footer={<>
          <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleRaise} disabled={!standardReference.trim()} loading={submitting}>Raise NC</Button>
        </>}>
        <label className="font-sans text-sm font-medium text-text" htmlFor="nc-standard">Standard / Clause reference</label>
        <Input id="nc-standard" value={standardReference} onChange={(e) => setStandardReference(e.target.value)} placeholder="e.g. ISO/IEC 17021-1:2015 clause 9.1.2.3" className="mt-2" />
        <label className="mt-3 block font-sans text-sm font-medium text-text" htmlFor="nc-due">Due date (optional)</label>
        <Input id="nc-due" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="mt-2" />
      </Modal>
    </>
  );
}

export function ReportContentEditor({
  assignmentId,
  initialSummary,
  initialRecommendation,
  readOnly,
}: {
  assignmentId: string;
  initialSummary: string;
  initialRecommendation: string;
  readOnly: boolean;
}) {
  const { toast } = useToast();
  const [summary, setSummary] = React.useState(initialSummary);
  const [recommendation, setRecommendation] = React.useState(initialRecommendation);
  const [saving, setSaving] = React.useState(false);

  async function handleSave() {
    setSaving(true);
    const result = await saveReportContent(assignmentId, summary, recommendation);
    setSaving(false);
    if (!result.ok) return toast({ tone: "error", persistent: true, title: "Couldn't save", description: result.error });
    toast({ tone: "success", title: "Report saved" });
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="font-sans text-sm font-medium text-text" htmlFor="report-summary">Assessment summary</label>
        <textarea
          id="report-summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          disabled={readOnly}
          rows={5}
          className="mt-2 w-full rounded-[6px] border border-border bg-surface px-3 py-2 font-sans text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:opacity-60"
        />
      </div>
      <div>
        <label className="font-sans text-sm font-medium text-text" htmlFor="report-recommendation">Recommendation / final comments</label>
        <textarea
          id="report-recommendation"
          value={recommendation}
          onChange={(e) => setRecommendation(e.target.value)}
          disabled={readOnly}
          rows={4}
          className="mt-2 w-full rounded-[6px] border border-border bg-surface px-3 py-2 font-sans text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:opacity-60"
        />
      </div>
      {!readOnly && (
        <Button variant="secondary" size="sm" onClick={handleSave} loading={saving} className="self-start">
          Save report draft
        </Button>
      )}
    </div>
  );
}
