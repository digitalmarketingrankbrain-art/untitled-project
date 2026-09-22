"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";
import { useToast } from "@/components/ui/toast";
import { respondToNc } from "@/lib/portal/nc-actions";
import { NC_RESPONSE_TYPE_LABEL, type NcResponseEntryRow, type NcResponseType } from "@/lib/portal/nc-data";

const TYPE_TONE: Record<NcResponseType, "info" | "warning" | "success"> = {
  ROOT_CAUSE: "info",
  CORRECTION: "info",
  CORRECTIVE_ACTION: "warning",
  ASSESSOR_REMARK: "success",
};

interface ResponseSession {
  key: string;
  submittedByName: string;
  submittedAt: string;
  entries: NcResponseEntryRow[];
}

/** Entries submitted in the same call (same author + exact same timestamp) are grouped under one dated header — matches how the AB's own NC report groups RCA/Correction/Corrective Action together. */
function groupIntoSessions(responses: NcResponseEntryRow[]): ResponseSession[] {
  const sessions: ResponseSession[] = [];
  for (const r of responses) {
    const key = `${r.submittedByName}__${r.submittedAt}`;
    const last = sessions[sessions.length - 1];
    if (last && last.key === key) {
      last.entries.push(r);
    } else {
      sessions.push({ key, submittedByName: r.submittedByName, submittedAt: r.submittedAt, entries: [r] });
    }
  }
  return sessions;
}

export function NcResponseThread({ responses }: { responses: NcResponseEntryRow[] }) {
  if (responses.length === 0) {
    return <p className="font-sans text-sm text-text-muted">No responses submitted yet.</p>;
  }
  const sessions = groupIntoSessions(responses);
  return (
    <div className="flex flex-col gap-5">
      {sessions.map((session) => (
        <div key={session.key} className="rounded-md border border-border bg-surface p-4">
          <p className="font-sans text-xs font-medium text-text-muted">
            {session.submittedByName} — {new Date(session.submittedAt).toLocaleString("en-US", { timeZone: "UTC" })}
          </p>
          <div className="mt-3 flex flex-col gap-2.5">
            {session.entries.map((r) => (
              <Alert key={r.id} tone={TYPE_TONE[r.type]} title={NC_RESPONSE_TYPE_LABEL[r.type]}>
                <p className="whitespace-pre-wrap">{r.body}</p>
              </Alert>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function NcResponseForm({ ncId, locked }: { ncId: string; locked: boolean }) {
  const router = useRouter();
  const { toast } = useToast();
  const [type, setType] = React.useState<Exclude<NcResponseType, "ASSESSOR_REMARK">>("ROOT_CAUSE");
  const [body, setBody] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  if (locked) {
    return (
      <p className="font-sans text-sm font-medium text-success-text">
        The AB has already approved this NC&apos;s response — further changes are disabled.
      </p>
    );
  }

  async function handleSubmit() {
    setSubmitting(true);
    const result = await respondToNc(ncId, type, body);
    setSubmitting(false);
    if (!result.ok) return toast({ tone: "error", persistent: true, title: "Couldn't submit", description: result.error });
    toast({ tone: "success", title: "Response submitted" });
    setBody("");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <label className="font-sans text-xs font-medium text-text-muted" htmlFor="nc-response-type">Response type</label>
        <Select id="nc-response-type" value={type} onChange={(e) => setType(e.target.value as typeof type)} className="mt-1">
          <option value="ROOT_CAUSE">Root Cause Analysis</option>
          <option value="CORRECTION">Proposed Correction</option>
          <option value="CORRECTIVE_ACTION">Proposed Corrective Action</option>
        </Select>
      </div>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
        placeholder="Describe your response..."
        className="w-full rounded-[6px] border border-border bg-surface px-3 py-2 font-sans text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
      />
      <Button variant="primary" size="sm" onClick={handleSubmit} disabled={!body.trim()} loading={submitting} className="self-start">
        Submit response
      </Button>
    </div>
  );
}
