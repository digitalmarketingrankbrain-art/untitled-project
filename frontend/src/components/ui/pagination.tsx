import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/** Numbered pagination, not infinite scroll — Phase 4: users may need to cite a specific page. */
function Pagination({ page, totalPages, onPageChange, className, ...props }: PaginationProps) {
  const pages = React.useMemo(() => {
    const items: (number | "ellipsis")[] = [];
    const windowSize = 1;
    for (let p = 1; p <= totalPages; p++) {
      if (p === 1 || p === totalPages || Math.abs(p - page) <= windowSize) {
        items.push(p);
      } else if (items[items.length - 1] !== "ellipsis") {
        items.push("ellipsis");
      }
    }
    return items;
  }, [page, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className={cn("flex items-center gap-1", className)} {...props}>
      <Button
        variant="secondary"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" strokeWidth={1.75} />
      </Button>
      {pages.map((p, i) =>
        p === "ellipsis" ? (
          <span key={`ellipsis-${i}`} className="px-2 text-sm text-text-muted">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              "flex h-8 min-w-8 items-center justify-center rounded-[6px] px-2 font-mono text-sm",
              p === page
                ? "bg-primary text-text-inverse"
                : "text-text hover:bg-background-portal",
            )}
          >
            {p}
          </button>
        ),
      )}
      <Button
        variant="secondary"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      >
        <ChevronRight className="size-4" strokeWidth={1.75} />
      </Button>
    </nav>
  );
}

export { Pagination };
