import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ResourceTable } from "@/components/resources/resource-table";
import { RESOURCES } from "@/lib/resources";

export const metadata: Metadata = {
  title: "Forms | SAAF",
  description: "Application documents and templates.",
};

export default function FormsPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Resources", href: "/resources" }, { label: "Forms" }]}
        title="Forms"
      />
      <div className="mx-auto max-w-5xl px-6 py-12">
        <ResourceTable resources={RESOURCES.filter((r) => r.type === "FORM")} />
      </div>
    </>
  );
}
