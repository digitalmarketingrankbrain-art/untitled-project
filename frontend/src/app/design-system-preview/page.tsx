"use client";

import * as React from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge, VERIFICATION_STATUS } from "@/components/ui/status-badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { FormField } from "@/components/ui/form-field";
import { Alert } from "@/components/ui/alert";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Modal } from "@/components/ui/modal";
import { Tabs } from "@/components/ui/tabs";
import { Accordion } from "@/components/ui/accordion";
import { useToast } from "@/components/ui/toast";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";

interface DemoRow {
  id: string;
  reference: string;
  organisation: string;
  status: "ACTIVE" | "SUSPENDED" | "WITHDRAWN" | "EXPIRED";
  effectiveDate: string;
}

const demoRows: DemoRow[] = [
  { id: "1", reference: "SAAF-2026-00417", organisation: "Northfield Testing Laboratories", status: "ACTIVE", effectiveDate: "2026-01-14" },
  { id: "2", reference: "SAAF-2025-00298", organisation: "Prairie Inspection Services", status: "SUSPENDED", effectiveDate: "2025-06-02" },
  { id: "3", reference: "SAAF-2023-00091", organisation: "Coastal Certification Group", status: "WITHDRAWN", effectiveDate: "2023-11-20" },
];

const columns: DataTableColumn<DemoRow>[] = [
  { key: "reference", header: "Reference", render: (r) => r.reference, mono: true },
  { key: "organisation", header: "Organisation", render: (r) => r.organisation },
  {
    key: "status",
    header: "Status",
    render: (r) => {
      const s = VERIFICATION_STATUS[r.status];
      return <StatusBadge tone={s.tone} label={s.label} size="sm" />;
    },
  },
  { key: "effectiveDate", header: "Effective", render: (r) => r.effectiveDate, mono: true, align: "right" },
];

function ToastDemo() {
  const { toast } = useToast();
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="secondary"
        onClick={() =>
          toast({ tone: "success", title: "Draft saved", description: "Saved just now." })
        }
      >
        Trigger success toast
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast({
            tone: "error",
            title: "Submission failed",
            description: "Your existing information has not been removed. Please try again.",
            persistent: true,
          })
        }
      >
        Trigger persistent error toast
      </Button>
    </div>
  );
}

export default function DesignSystemPreview() {
  const [page, setPage] = React.useState(1);
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-12 px-6 py-16">
      <div>
        <p className="font-sans text-xs uppercase tracking-[0.02em] text-accent">
          Milestone 2 — internal preview, not public-facing
        </p>
        <h1 className="font-display text-3xl font-semibold text-text">Design System Preview</h1>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.02em] text-text-muted">Buttons</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">Verify an Accreditation</Button>
          <Button variant="secondary">Explore Programs</Button>
          <Button variant="tertiary">Read the full process</Button>
          <Button variant="destructive">Withdraw</Button>
          <Button variant="destructive-outline">Suspend</Button>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.02em] text-text-muted">Status Badges</h2>
        <div className="flex flex-wrap gap-3">
          {Object.entries(VERIFICATION_STATUS).map(([key, val]) => (
            <StatusBadge key={key} tone={val.tone} label={val.label} />
          ))}
          <StatusBadge tone="neutral" label="No matching record found" />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.02em] text-text-muted">Cards</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card interactive>
            <CardHeader>
              <CardTitle>Testing &amp; Calibration Laboratories</CardTitle>
              <CardDescription>Scope covers physical, chemical, and dimensional testing.</CardDescription>
            </CardHeader>
            <CardContent>Assessed against ISO/IEC 17025-aligned criteria.</CardContent>
            <CardFooter>
              <Button variant="tertiary" size="sm">View program →</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Static card (no hover)</CardTitle>
              <CardDescription>Flat by default — no shadow at rest.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.02em] text-text-muted">Form Fields</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Organisation name" htmlFor="org-name" required hint="As it appears on your registration.">
            <Input id="org-name" placeholder="Northfield Testing Laboratories" />
          </FormField>
          <FormField label="Accreditation number" htmlFor="acc-num" error="This field is required.">
            <Input id="acc-num" invalid placeholder="SAAF-2026-00417" />
          </FormField>
          <FormField label="Program" htmlFor="program">
            <Select id="program" defaultValue="">
              <option value="" disabled>Select a program</option>
              <option value="testing-labs">Testing &amp; Calibration Laboratories</option>
              <option value="inspection">Inspection Bodies</option>
            </Select>
          </FormField>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.02em] text-text-muted">Alerts</h2>
        <div className="flex flex-col gap-3">
          <Alert tone="success" title="Application submitted">Your application SAAF-2026-00417 was submitted for review.</Alert>
          <Alert tone="warning" title="Action needed">A reviewer has requested an updated Quality Manual.</Alert>
          <Alert tone="error" title="We couldn't save your changes">Your existing information has not been removed. Please try again.</Alert>
          <Alert tone="info" title="Last reviewed">This governance page was last reviewed on 14 Jan 2026.</Alert>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.02em] text-text-muted">Breadcrumbs &amp; Pagination</h2>
        <Breadcrumbs
          items={[
            { label: "Accreditation", href: "/accreditation" },
            { label: "Programs", href: "/accreditation/programs" },
            { label: "Testing & Calibration Laboratories" },
          ]}
        />
        <Pagination page={page} totalPages={7} onPageChange={setPage} />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.02em] text-text-muted">Empty &amp; Error States</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <EmptyState
            title="No accreditation records matched your search."
            description="Check the spelling or accreditation number, or try searching by organisation name instead."
            action={<Button variant="secondary" size="sm">Search again</Button>}
          />
          <ErrorState
            title="We couldn't complete this search right now."
            description="Your search wasn't lost — try again in a moment, or contact us if this keeps happening."
            onRetry={() => {}}
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.02em] text-text-muted">Modal</h2>
        <Button variant="secondary" onClick={() => setModalOpen(true)}>Open modal</Button>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Confirm withdrawal"
          footer={
            <>
              <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={() => setModalOpen(false)}>Withdraw accreditation</Button>
            </>
          }
        >
          This action requires a reason and will be recorded in the audit log.
        </Modal>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.02em] text-text-muted">Tabs</h2>
        <Tabs
          items={[
            { value: "overview", label: "Overview", content: <p className="text-sm text-text-muted">Overview content.</p> },
            { value: "documents", label: "Documents", content: <p className="text-sm text-text-muted">Documents content.</p> },
            { value: "messages", label: "Messages", content: <p className="text-sm text-text-muted">Messages content.</p> },
          ]}
        />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.02em] text-text-muted">Accordion (FAQ)</h2>
        <Accordion
          items={[
            { id: "q1", question: "How long does accreditation take?", answer: "Timelines vary by program — see the full process page." },
            { id: "q2", question: "What happens if I don't pass assessment?", answer: "You'll receive findings and may request a re-assessment." },
          ]}
        />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.02em] text-text-muted">Toasts</h2>
        <ToastDemo />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.02em] text-text-muted">Data Table</h2>
        <DataTable columns={columns} rows={demoRows} getRowKey={(r) => r.id} />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.02em] text-text-muted">Type &amp; Colour Reference</h2>
        <div className="flex flex-col gap-1">
          <p className="font-display text-4xl font-semibold text-text">Display / H1 — Source Serif 4</p>
          <p className="font-sans text-2xl font-semibold text-text">H2 — Inter</p>
          <p className="font-sans text-base text-text">Body — Inter</p>
          <p className="font-mono text-sm text-text">SAAF-2026-00417 — Inter, tabular figures (reference data)</p>
        </div>
        <div className="flex items-center gap-2 text-text-muted">
          <FileText className="size-4" strokeWidth={1.5} />
          <span className="font-sans text-sm">Line-icon set (lucide-react, 1.5–1.75px stroke)</span>
        </div>
      </section>
    </main>
  );
}
