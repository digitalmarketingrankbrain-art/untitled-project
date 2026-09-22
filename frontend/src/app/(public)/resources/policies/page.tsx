import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ResourceTable } from "@/components/resources/resource-table";
import { RESOURCES } from "@/lib/resources";

export const metadata: Metadata = {
  title: "Policies | SAAF",
  description: "Governing policies, versioned and dated.",
};

export default function PoliciesPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Resources", href: "/resources" }, { label: "Policies" }]}
        title="Policies"
      />
      <div className="mx-auto max-w-5xl px-6 py-12">
        <ResourceTable resources={RESOURCES.filter((r) => r.type === "POLICY")} />
      </div>
    </>
  );
}
