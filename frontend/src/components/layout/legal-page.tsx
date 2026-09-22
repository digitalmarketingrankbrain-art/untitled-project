import { FileClock } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Alert } from "@/components/ui/alert";

export interface LegalSection {
  heading: string;
}

/**
 * Structural placeholder for legal pages — the real body text requires legal
 * review (Phase 6) and isn't written yet. Shows the intended section
 * structure (itself a transparency signal — visitors can see the scope of
 * what the policy will cover) plus one clear, dignified notice, rather than
 * a fabricated date or a "[PLACEHOLDER]" tag repeated under every heading —
 * see trust-strip.tsx for why a visible placeholder tag undermines the
 * credibility this page exists to build in the first place.
 */
function LegalPage({
  title,
  breadcrumbLabel,
  sections,
}: {
  title: string;
  breadcrumbLabel: string;
  sections: LegalSection[];
}) {
  return (
    <PageHeader breadcrumbs={[{ label: breadcrumbLabel }]} title={title}>
      <Alert tone="info" title="This policy is being finalized" className="mt-6">
        <div className="flex items-start gap-2">
          <FileClock className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
          <span>
            The full text of this policy is currently under legal review and will be published here
            once finalized. The sections below show what it will cover. In the meantime, please{" "}
            <a href="/contact" className="underline hover:no-underline">
              contact us
            </a>{" "}
            with any questions.
          </span>
        </div>
      </Alert>
      <div className="mt-8 flex flex-col gap-4">
        {sections.map((section) => (
          <div key={section.heading} className="rounded-md border border-border bg-surface px-4 py-3">
            <h2 className="font-sans text-sm font-semibold text-text">{section.heading}</h2>
          </div>
        ))}
      </div>
    </PageHeader>
  );
}

export { LegalPage };
