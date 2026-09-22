import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { NEWS_ITEMS } from "@/lib/news";

export const metadata: Metadata = {
  title: "News & Notices | SAAF",
  description: "Announcements, policy updates, and accreditation status changes.",
};

export default function NewsIndexPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "News & Notices" }]}
        title="News & Notices"
        description="Includes routine updates and accreditation status changes, such as suspensions and withdrawals — published, not hidden."
      />
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="flex flex-col divide-y divide-border">
          {NEWS_ITEMS.map((item) => (
            <Link key={item.slug} href={`/news/${item.slug}`} className="flex flex-col gap-2 py-5 hover:bg-background-portal">
              <div className="flex items-center gap-3">
                <time className="font-mono text-xs text-text-muted">{item.publishedAt}</time>
                {item.category === "STATUS_CHANGE" ? (
                  <StatusBadge tone="warning" label="Status change" size="sm" />
                ) : (
                  <StatusBadge tone="info" label="Routine" size="sm" />
                )}
              </div>
              <p className="font-sans text-base font-semibold text-text">{item.title}</p>
              <p className="font-sans text-sm text-text-muted">{item.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
