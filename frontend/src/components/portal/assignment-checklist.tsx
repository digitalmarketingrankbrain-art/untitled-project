"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FINDING_STATUS_CODE, type AssessmentCriterion, type Finding, type FindingStatus } from "@/lib/portal/assessor-data";
import { saveFinding } from "@/lib/portal/assessor-actions";

const STATUS_TONE: Record<FindingStatus, string> = {
  UNANSWERED: "border-border text-text-muted",
  CONFORMS: "border-success-text text-success-text",
  NON_CONFORMANCE: "border-error-text text-error-text",
  OBSERVATION: "border-info-text text-info-text",
  OPPORTUNITY_FOR_IMPROVEMENT: "border-warning-text text-warning-text",
  NOT_APPLICABLE: "border-border text-text-muted",
};

function ChecklistRow({
  assignmentId,
  criterion,
  finding,
}: {
  assignmentId: string;
  criterion: AssessmentCriterion;
  finding?: Finding;
}) {
  const router = useRouter();
  const [status, setStatus] = React.useState<FindingStatus>(finding?.status ?? "UNANSWERED");
  const [notes, setNotes] = React.useState(finding?.notes ?? "");
  const [severity, setSeverity] = React.useState<"MINOR" | "MAJOR" | "">(finding?.severity ?? "");
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  async function handleSave() {
    setSaving(true);
    await saveFinding(assignmentId, criterion.id, status, notes, severity || null);
    setSaving(false);
    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="grid grid-cols-1 gap-3 border-b border-border p-4 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_260px]">
      <div>
        <p className="font-sans text-sm text-text">{criterion.requirementText}</p>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="Finding / evidence / notes"
          className="mt-2 w-full rounded-[6px] border border-border bg-surface px-3 py-2 font-sans text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-md border font-mono text-xs font-bold",
              STATUS_TONE[status],
            )}
          >
            {FINDING_STATUS_CODE[status]}
          </span>
          <div className="flex-1">
            <Select value={status} onChange={(e) => setStatus(e.target.value as FindingStatus)}>
              <option value="UNANSWERED">Not yet assessed</option>
              <option value="CONFORMS">C — Conforms</option>
              <option value="NON_CONFORMANCE">NC — Non-conformance</option>
              <option value="OBSERVATION">O — Observation</option>
              <option value="OPPORTUNITY_FOR_IMPROVEMENT">OFI — Opportunity for improvement</option>
              <option value="NOT_APPLICABLE">N/A — Not applicable</option>
            </Select>
          </div>
        </div>
        {status === "NON_CONFORMANCE" && (
          <Select value={severity} onChange={(e) => setSeverity(e.target.value as "MINOR" | "MAJOR" | "")}>
            <option value="">Select severity</option>
            <option value="MINOR">Minor</option>
            <option value="MAJOR">Major</option>
          </Select>
        )}
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
          {saved && <span className="font-sans text-xs text-success-text">Saved</span>}
        </div>
      </div>
    </div>
  );
}

function CategoryGroup({
  category,
  criteria,
  assignmentId,
  findings,
}: {
  category: string;
  criteria: AssessmentCriterion[];
  assignmentId: string;
  findings: Record<string, Finding>;
}) {
  const answeredCount = criteria.filter((c) => findings[c.id]?.status && findings[c.id]?.status !== "UNANSWERED").length;
  return (
    <details className="group rounded-lg border border-border bg-surface" open>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-lg bg-info-surface px-4 py-3">
        <span className="font-sans text-sm font-semibold text-info-text">{category}</span>
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-info-text/30 bg-surface px-2.5 py-0.5 font-mono text-xs text-info-text">
            {answeredCount}/{criteria.length} rows
          </span>
          <ChevronDown className="size-4 text-info-text transition-transform group-open:rotate-180" />
        </div>
      </summary>
      <div>
        {criteria.map((c) => (
          <ChecklistRow key={c.id} assignmentId={assignmentId} criterion={c} finding={findings[c.id]} />
        ))}
      </div>
    </details>
  );
}

function AssignmentChecklist({
  assignmentId,
  criteria,
  findings,
}: {
  assignmentId: string;
  criteria: AssessmentCriterion[];
  findings: Record<string, Finding>;
}) {
  const groups = React.useMemo(() => {
    const byCategory = new Map<string, AssessmentCriterion[]>();
    for (const c of criteria) {
      const key = c.category || "General";
      if (!byCategory.has(key)) byCategory.set(key, []);
      byCategory.get(key)!.push(c);
    }
    return Array.from(byCategory.entries());
  }, [criteria]);

  if (criteria.length === 0) {
    return <p className="font-sans text-sm text-text-muted">Accept this assignment to load the assessment checklist.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {groups.map(([category, items]) => (
        <CategoryGroup key={category} category={category} criteria={items} assignmentId={assignmentId} findings={findings} />
      ))}
    </div>
  );
}

export { AssignmentChecklist };
