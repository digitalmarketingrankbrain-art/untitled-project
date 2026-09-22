"use client";

import * as React from "react";
import { Search, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { COUNTRIES } from "@/lib/countries";
import { saveAppliedCountries } from "@/lib/portal/cab-info-actions";

/**
 * Replaces the reference UI's unsearchable wall of 190+ pre-checked
 * checkboxes (Phase 1's own callout) with a searchable multi-select —
 * only Applied Countries are CB-editable; Approved is admin-controlled.
 */
function CountryPicker({ initialSelected }: { initialSelected: string[] }) {
  const { toast } = useToast();
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState<Set<string>>(new Set(initialSelected));
  const [saving, setSaving] = React.useState(false);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter((c) => c.name.toLowerCase().includes(q));
  }, [query]);

  function toggle(code: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  }

  async function handleSave() {
    setSaving(true);
    const result = await saveAppliedCountries(Array.from(selected));
    setSaving(false);
    if (result.ok) {
      toast({ tone: "success", title: "Applied countries saved." });
    } else {
      toast({ tone: "error", title: "Couldn't save changes.", persistent: true });
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="relative max-w-xs flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" strokeWidth={1.75} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search countries…"
            className="h-10 w-full rounded-[6px] border border-border bg-surface pl-9 pr-3 font-sans text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
          />
        </div>
        <span className="whitespace-nowrap font-sans text-sm text-text-muted">{selected.size} selected</span>
        <Button size="sm" onClick={handleSave} loading={saving}>
          Save
        </Button>
      </div>

      <div className="grid max-h-96 grid-cols-1 gap-1 overflow-y-auto rounded-lg border border-border p-2 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
          <p className="col-span-full px-2 py-4 text-center font-sans text-sm text-text-muted">No countries match “{query}”.</p>
        ) : (
          filtered.map((c) => {
            const isSelected = selected.has(c.code);
            return (
              <button
                key={c.code}
                type="button"
                onClick={() => toggle(c.code)}
                className="flex items-center gap-2 rounded-[6px] px-2 py-1.5 text-left font-sans text-sm text-text hover:bg-background-portal"
              >
                <span
                  className={
                    "flex size-4 shrink-0 items-center justify-center rounded-[4px] border " +
                    (isSelected ? "border-accent bg-accent text-white" : "border-border")
                  }
                >
                  {isSelected && <Check className="size-3" strokeWidth={2.5} />}
                </span>
                {c.name}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

export { CountryPicker };
