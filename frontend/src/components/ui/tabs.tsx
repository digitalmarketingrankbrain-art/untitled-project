"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export interface TabItem {
  value: string;
  label: string;
  content: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultValue?: string;
  className?: string;
  /** When set, the tab whose value matches this URL query param (e.g. ?tab=invoices) opens initially — lets other pages deep-link to a specific tab. */
  queryParam?: string;
}

/**
 * `useSearchParams` is only invoked (via `QuerySync` below, inside its own
 * Suspense boundary) when `queryParam` is actually passed — most `Tabs`
 * usages don't set it, and keeping the hook out of their render path avoids
 * forcing every page that uses Tabs to add a Suspense boundary just to stay
 * statically prerenderable.
 */
function QuerySync({
  queryParam,
  values,
  defaultValue,
  onResolve,
}: {
  queryParam: string;
  values: string[];
  defaultValue: string;
  onResolve: (value: string) => void;
}) {
  const searchParams = useSearchParams();
  const fromQuery = searchParams.get(queryParam);
  React.useEffect(() => {
    onResolve(fromQuery && values.includes(fromQuery) ? fromQuery : defaultValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromQuery]);
  return null;
}

/** Plain underline-style tabs, not pill/button tabs — Phase 4. */
function Tabs({ items, defaultValue, className, queryParam }: TabsProps) {
  const resolvedDefault = defaultValue ?? items[0]?.value ?? "";
  const [active, setActive] = React.useState(resolvedDefault);

  return (
    <div className={className}>
      {queryParam && (
        <React.Suspense fallback={null}>
          <QuerySync
            queryParam={queryParam}
            values={items.map((i) => i.value)}
            defaultValue={resolvedDefault}
            onResolve={setActive}
          />
        </React.Suspense>
      )}
      <div role="tablist" className="flex flex-wrap gap-1 rounded-xl border border-slate-200/80 bg-slate-50 p-1.5 shadow-[0_3px_12px_rgba(7,26,47,.04)]">
        {items.map((item) => {
          const isActive = item.value === active;
          return (
            <button
              key={item.value}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(item.value)}
              className={cn(
                "rounded-lg px-3.5 py-1.5 font-sans text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer select-none",
                isActive
                  ? "bg-[#071a2f] text-white shadow-sm"
                  : "text-slate-600 hover:text-teal-800 hover:bg-teal-50",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <div className="pt-6">
        {items.find((item) => item.value === active)?.content}
      </div>
    </div>
  );
}

export { Tabs };
