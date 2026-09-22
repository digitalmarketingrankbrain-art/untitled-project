import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ResourceTable } from "@/components/resources/resource-table";
import { RESOURCES } from "@/lib/resources";

export const metadata: Metadata = {
  title: "Resources | SAAF",
  description: "Policies, procedures, and forms — published and available to anyone.",
};

export default function ResourcesIndexPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Resources" }]}
        title="Resources"
        description="Policies, procedures, and application documents are published and available to anyone — applicants, accredited organisations, and the public."
      />
      <div className="mx-auto max-w-5xl px-6 py-12">
        <ResourceTable resources={RESOURCES} />
      </div>
    </>
  );
}
