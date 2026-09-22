import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { Reveal } from "@/components/ui/reveal";
import { NEWS_ITEMS } from "@/lib/news";

function NoticesSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <Reveal className="flex items-end justify-between">
        <div>
          <p className="flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-accent">
            <span className="h-px w-8 bg-accent" aria-hidden="true" />
            Latest News &amp; Perspectives
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-text sm:text-4xl">
            Updates and insights from SAAF.
          </h2>
        </div>
        <Link href="/news" className="font-sans text-sm font-semibold text-secondary hover:underline">
          View all notices →
        </Link>
      </Reveal>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {NEWS_ITEMS.map((item, i) => (
          <Reveal key={item.slug} delayMs={i * 40}>
            <Link
              href={`/news/${item.slug}`}
              className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-5 transition duration-150 hover:-translate-y-0.5 hover:border-secondary hover:shadow-[0_2px_12px_rgba(13,43,32,0.08)]"
            >
              <div className="flex items-center justify-between gap-2">
                <time className="font-mono text-xs text-text-muted">{item.publishedAt}</time>
                {item.category === "STATUS_CHANGE" ? (
                  <StatusBadge tone="warning" label="Status change" size="sm" />
                ) : (
                  <StatusBadge tone="info" label="Routine" size="sm" />
                )}
              </div>
              <p className="font-sans text-sm font-semibold text-text">{item.title}</p>
              <p className="font-sans text-xs text-text-muted">{item.excerpt}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export { NoticesSection };
