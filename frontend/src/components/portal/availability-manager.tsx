"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import type { AvailabilityBlackout } from "@/lib/portal/assessor-data";
import { addAvailabilityBlackout, removeAvailabilityBlackout } from "@/lib/portal/assessor-actions";

/**
 * List view rather than a calendar grid — Phase 9 explicitly calls for a
 * list alternative "for accessibility/keyboard users who find a calendar
 * grid harder to operate." Admin reads this when proposing assignments but
 * cannot edit it (enforced by the assessor-scoped Server Action, not shown
 * to admin at all in this milestone).
 */
function AvailabilityManager({ blackouts }: { blackouts: AvailabilityBlackout[] }) {
  const router = useRouter();
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [note, setNote] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await addAvailabilityBlackout(startDate, endDate, note);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setStartDate("");
    setEndDate("");
    setNote("");
    router.refresh();
  }

  async function handleRemove(id: string) {
    await removeAvailabilityBlackout(id);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface p-4">
        <FormField label="Unavailable from" htmlFor="startDate" required>
          <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        </FormField>
        <FormField label="Until" htmlFor="endDate" required>
          <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
        </FormField>
        <FormField label="Note (optional)" htmlFor="note">
          <Input id="note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Annual leave" />
        </FormField>
        <Button type="submit" variant="secondary" loading={submitting}>
          Add blackout date
        </Button>
      </form>
      {error && <p className="font-sans text-sm text-error-text">{error}</p>}

      {blackouts.length === 0 ? (
        <EmptyState title="No blackout dates set." description="Add unavailable periods so admin doesn't propose assignments during that time." />
      ) : (
        <ul className="flex flex-col gap-2">
          {blackouts.map((b) => (
            <li key={b.id} className="flex items-center justify-between rounded-md border border-border bg-surface px-4 py-3">
              <div>
                <p className="font-mono text-sm text-text">{b.startDate} → {b.endDate}</p>
                {b.note && <p className="font-sans text-xs text-text-muted">{b.note}</p>}
              </div>
              <button
                onClick={() => handleRemove(b.id)}
                aria-label="Remove blackout date"
                className="text-text-muted hover:text-error-text"
              >
                <X className="size-4" strokeWidth={1.75} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export { AvailabilityManager };
