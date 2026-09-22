"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccordionItem {
  id: string;
  question: string;
  answer: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

function Accordion({ items, className }: AccordionProps) {
  const [openId, setOpenId] = React.useState<string | null>(null);

  return (
    <div className={cn("divide-y divide-border border-y border-border", className)}>
      {items.map((item) => {
        const isOpen = item.id === openId;
        return (
          <div key={item.id}>
            <h3>
              <button
                aria-expanded={isOpen}
                aria-controls={`accordion-panel-${item.id}`}
                id={`accordion-trigger-${item.id}`}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex w-full items-center justify-between gap-4 py-4 text-left font-sans text-sm font-medium text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {item.question}
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 text-text-muted transition-transform",
                    isOpen && "rotate-180",
                  )}
                  strokeWidth={1.75}
                />
              </button>
            </h3>
            {isOpen && (
              <div
                id={`accordion-panel-${item.id}`}
                role="region"
                aria-labelledby={`accordion-trigger-${item.id}`}
                className="pb-4 font-sans text-sm text-text-muted"
              >
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export { Accordion };
