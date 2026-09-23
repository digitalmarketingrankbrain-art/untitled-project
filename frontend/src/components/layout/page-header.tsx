import { Breadcrumbs, type Breadcrumb } from "@/components/ui/breadcrumbs";

export interface PageHeaderProps {
  breadcrumbs: Breadcrumb[];
  title: string;
  description?: string;
  meta?: string;
  children?: React.ReactNode;
}

/** Shared header block for internal public pages — breadcrumbs, title, intro, optional CTA row. */
function PageHeader({ breadcrumbs, title, description, meta, children }: PageHeaderProps) {
  return (
    <div className="border-b border-slate-200/80 bg-white/90 backdrop-blur-xs">
      <div className="mx-auto max-w-5xl px-6 py-8 sm:py-10">
        <Breadcrumbs items={breadcrumbs} />
        {meta && (
          <p className="mt-3 font-sans text-xs font-semibold uppercase tracking-wider text-sky-700">{meta}</p>
        )}
        <h1 className="mt-2 font-sans text-2xl font-bold tracking-tight text-slate-900 sm:text-3.5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2.5 max-w-3xl font-sans text-base text-slate-600 leading-relaxed">
            {description}
          </p>
        )}
        {children && <div className="mt-5">{children}</div>}
      </div>
    </div>
  );
}

export { PageHeader };
