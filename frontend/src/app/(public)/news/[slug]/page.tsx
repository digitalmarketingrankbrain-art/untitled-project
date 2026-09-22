import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { NEWS_ITEMS } from "@/lib/news";

export function generateStaticParams() {
  return NEWS_ITEMS.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = NEWS_ITEMS.find((n) => n.slug === slug);
  if (!item) return {};
  return { title: `${item.title} | SAAF`, description: item.excerpt };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = NEWS_ITEMS.find((n) => n.slug === slug);
  if (!item) notFound();

  return (
    <PageHeader
      breadcrumbs={[{ label: "News & Notices", href: "/news" }, { label: item.title }]}
      title={item.title}
      meta={item.publishedAt}
    >
      <div className="mt-3">
        {item.category === "STATUS_CHANGE" ? (
          <StatusBadge tone="warning" label="Status change" size="sm" />
        ) : (
          <StatusBadge tone="info" label="Routine" size="sm" />
        )}
      </div>
      <p className="mt-6 max-w-2xl font-sans text-base text-text">{item.excerpt}</p>
    </PageHeader>
  );
}
