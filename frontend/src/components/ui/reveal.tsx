"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface RevealProps extends React.HTMLAttributes<HTMLElement> {
  /** Stagger offset in ms, for revealing items in a grid one after another. */
  delayMs?: number;
  /** Rendered element. Use "li" inside an <ol>/<ul> to keep list semantics. */
  as?: "div" | "li";
}

/**
 * Ensures smooth entrance animations while guaranteeing 100% visibility fallback on all screens.
 */
function Reveal({ className, delayMs = 0, style, as = "div", ...props }: RevealProps) {
  const ref = React.useRef<HTMLElement>(null);
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.01, rootMargin: "100px 0px" },
    );
    observer.observe(el);

    // Guarantee visibility fallback after 200ms
    const timer = setTimeout(() => setVisible(true), 200);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  const Tag = as;

  return (
    <Tag
      ref={ref as React.Ref<never>}
      data-visible={visible}
      className={cn("reveal", className)}
      style={delayMs ? { transitionDelay: `${delayMs}ms`, ...style } : style}
      {...props}
    />
  );
}

export { Reveal };
