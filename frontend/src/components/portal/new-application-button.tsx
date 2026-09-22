"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { PROGRAMS } from "@/lib/programs";
import { startNewApplication } from "@/lib/portal/applicant-actions";

/** "Apply for" is a multi-select (per the AB's real application form) — the first checked scheme becomes the primary program, the rest are recorded as additionalScopeSlugs on the same application. */
function NewApplicationButton() {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [creating, setCreating] = React.useState(false);

  function toggle(slug: string) {
    setSelected((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  }

  async function handleSubmit() {
    if (selected.length === 0) return;
    setCreating(true);
    const [primary, ...rest] = selected;
    const result = await startNewApplication(primary!, rest);
    setCreating(false);
    setOpen(false);
    if (!result.ok) {
      toast({ tone: "error", persistent: true, title: "Couldn't start application", description: result.error });
      return;
    }
    router.push(`/cab/applicant/applications/${result.applicationId}`);
  }

  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        New application
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Apply for"
        footer={<>
          <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={selected.length === 0} loading={creating}>Continue</Button>
        </>}
      >
        <p className="mb-3 font-sans text-xs text-text-muted">Select one or more accreditation schemes.</p>
        <div className="flex flex-col gap-2">
          {PROGRAMS.map((p) => (
            <label
              key={p.slug}
              className="flex items-start gap-3 rounded-md border border-border px-4 py-3 hover:border-secondary"
            >
              <input
                type="checkbox"
                className="mt-0.5"
                checked={selected.includes(p.slug)}
                onChange={() => toggle(p.slug)}
                disabled={creating}
              />
              <span>
                <p className="font-sans text-sm font-medium text-text">{p.name}</p>
                <p className="mt-0.5 font-sans text-xs text-text-muted">{p.scopeDescription}</p>
              </span>
            </label>
          ))}
        </div>
      </Modal>
    </>
  );
}

export { NewApplicationButton };
