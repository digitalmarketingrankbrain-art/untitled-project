import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { FeesTable, type FeesTableRow } from "@/components/accreditation/fees-table";
import { PROGRAMS } from "@/lib/programs";
import { getProgramFees } from "@/lib/program-fees";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Fees | SAAF",
  description: "Fee structure and guidance by accreditation program.",
};

export default async function FeesPage() {
  const fees = await getProgramFees();
  const rows: FeesTableRow[] = PROGRAMS.map((p) => ({ ...p, fee: fees[p.slug] }));

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Accreditation", href: "/accreditation" }, { label: "Fees" }]}
        title="Fees"
        description="Application fee by program, shown in USD. Final fees are confirmed during application review and may vary by scope and organisation size — ongoing surveillance/renewal fees are quoted separately once a scope is accredited."
      />
      <div className="mx-auto max-w-4xl px-6 py-12">
        <FeesTable programs={rows} />
      </div>
    </>
  );
}
