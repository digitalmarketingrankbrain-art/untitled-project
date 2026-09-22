import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { FileDown } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { RESOURCES, type Resource } from "@/lib/resources";

const TYPE_LABEL: Record<Resource["type"], string> = {
  POLICY: "Policy",
  PROCEDURE: "Procedure",
  FORM: "Form",
};

export function generateStaticParams() {
  return RESOURCES.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resource = RESOURCES.find((r) => r.slug === slug);
  if (!resource) return {};
  return { title: `${resource.title} | SAAF`, description: resource.description };
}

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resource = RESOURCES.find((r) => r.slug === slug);
  if (!resource) notFound();

  return (
    <PageHeader
      breadcrumbs={[{ label: "Resources", href: "/resources" }, { label: resource.title }]}
      title={resource.title}
      meta={`${TYPE_LABEL[resource.type]} · Version ${resource.version} · Effective ${resource.effectiveDate}`}
      description={resource.description}
    >
      <Button variant="primary" className="mt-6" disabled>
        <FileDown className="size-4" strokeWidth={1.75} />
        Download PDF
      </Button>
      <p className="mt-2 font-sans text-xs text-text-muted">
        The downloadable document isn&apos;t published yet — check back soon, or{" "}
        <a href="/contact" className="text-secondary hover:underline">
          contact us
        </a>{" "}
        for a copy in the meantime.
      </p>
    </PageHeader>
  );
}
