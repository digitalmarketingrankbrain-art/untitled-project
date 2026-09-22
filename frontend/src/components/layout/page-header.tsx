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
    <div className="border-b border-slate-200/60 bg-white">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <Breadcrumbs items={breadcrumbs} />
        {meta && (
          <p className="mt-3 font-sans text-xs text-slate-500">{meta}</p>
        )}
        <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl font-sans text-sm text-slate-600 leading-relaxed">
            {description}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}

export { PageHeader };
