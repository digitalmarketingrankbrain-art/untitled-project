import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ResourceTable } from "@/components/resources/resource-table";
import { RESOURCES } from "@/lib/resources";

export const metadata: Metadata = {
  title: "Procedures | SAAF",
  description: "Operational procedures for applicants and assessors.",
};

export default function ProceduresPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Resources", href: "/resources" }, { label: "Procedures" }]}
        title="Procedures"
      />
      <div className="mx-auto max-w-5xl px-6 py-12">
        <ResourceTable resources={RESOURCES.filter((r) => r.type === "PROCEDURE")} />
      </div>
    </>
  );
}
