"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type SearchMode = "number" | "name";

/**
 * Autofocuses — this is the dedicated /verify page, unlike the homepage's
 * verification section which deliberately does not autofocus (Phase 5/7).
 */
function SearchForm({
  initialQuery = "",
  initialMode = "number",
}: {
  initialQuery?: string;
  initialMode?: SearchMode;
}) {
  const router = useRouter();
  const [mode, setMode] = React.useState<SearchMode>(initialMode);
  const [query, setQuery] = React.useState(initialQuery);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    params.set("mode", mode);
    router.push(`/verify?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div role="tablist" aria-label="Search by" className="inline-flex self-center rounded-md border border-border bg-surface p-1">
        {(["number", "name"] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            onClick={() => setMode(m)}
            className={cn(
              "rounded-[4px] px-4 py-1.5 font-sans text-sm font-medium transition-colors",
              mode === m ? "bg-primary text-text-inverse" : "text-text-muted hover:text-text",
            )}
          >
            {m === "number" ? "Accreditation Number" : "Organisation Name"}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-text-muted"
          strokeWidth={1.75}
        />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={mode === "number" ? "e.g. SAAF-2026-00417" : "e.g. Northfield Testing Laboratories"}
          aria-label={mode === "number" ? "Accreditation number" : "Organisation name"}
          className="h-14 pl-11 text-base"
        />
      </div>

      <Button type="submit" variant="primary" size="lg">
        Search
      </Button>
    </form>
  );
}

export { SearchForm };
