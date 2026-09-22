"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown, ShieldCheck, Globe, MapPin } from "lucide-react";

import { cn } from "@/lib/utils";
import { FOOTER_GROUPS } from "@/lib/nav";
import { SaafLogo } from "@/components/ui/saaf-logo";

function Footer() {
  const [openGroup, setOpenGroup] = React.useState<string | null>(null);

  return (
    <footer className="border-t border-slate-200 bg-slate-50 text-slate-700">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Brand Column */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <div className="mb-4">
                <SaafLogo variant="horizontal" size="md" lightMode={false} />
              </div>
              <p className="text-xs leading-relaxed text-slate-600 font-normal">
                UASL is an independent, impartial assessment body responsible for providing assessment of conformity assessment bodies (CABs) in the fields of Management System Certification (ISO 9001, ISO 14001, ISO 27001 etc.), Product Certification, Personnel Certification, Inspection, and Rating.
              </p>
            </div>

            <div className="mt-6 space-y-2 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <MapPin className="size-4 shrink-0 text-blue-700 mt-0.5" />
                <span>UASL is a company registered in England and Wales (No. 08283067).</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="size-4 shrink-0 text-blue-700" />
                <span>Global Assessment & Accreditation Services</span>
              </div>
            </div>

            {/* ISO Standard Compliance Badge */}
            <div className="mt-4 flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white p-3 shadow-xs">
              <ShieldCheck className="size-5 shrink-0 text-blue-700" />
              <span className="text-[11px] font-semibold text-slate-800 leading-tight">
                Demonstrating competence and independence of CABs worldwide since 1992.
              </span>
            </div>
          </div>

          {/* Links Columns Grid */}
          <div className="hidden grid-cols-2 md:grid-cols-4 gap-6 lg:col-span-8 sm:grid">
            {FOOTER_GROUPS.map((group) => (
              <div key={group.label} className="flex flex-col">
                <p className="mb-3 text-[11px] font-extrabold uppercase tracking-wider text-blue-950 border-b border-slate-200 pb-2">
                  {group.label}
                </p>
                <ul className="flex flex-col gap-2">
                  {group.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="text-[12px] font-medium text-slate-600 transition-colors hover:text-blue-800 leading-tight block"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Mobile Accordion */}
          <div className="flex flex-col divide-y divide-slate-200 border-y border-slate-200 lg:hidden">
            {FOOTER_GROUPS.map((group) => {
              const isOpen = openGroup === group.label;
              return (
                <div key={group.label}>
                  <button
                    aria-expanded={isOpen}
                    onClick={() => setOpenGroup(isOpen ? null : group.label)}
                    className="flex w-full items-center justify-between py-3 text-xs font-bold text-slate-800"
                  >
                    <span>{group.label}</span>
                    <ChevronDown
                      className={cn("size-3.5 text-blue-700 transition-transform", isOpen && "rotate-180")}
                    />
                  </button>
                  {isOpen && (
                    <ul className="flex flex-col gap-2 pb-3 pl-2">
                      {group.links.map((link) => (
                        <li key={link.href + link.label}>
                          <Link
                            href={link.href}
                            className="text-xs text-slate-600 hover:text-blue-800"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legal & Copyright Bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 text-[11px] text-slate-500 sm:flex-row">
          <p className="font-normal" suppressHydrationWarning>
            Copyright © {new Date().getFullYear()} UASL – United Assessment Services Limited. All Rights Reserved.
          </p>
          <div className="flex flex-wrap items-center gap-3 font-medium">
            <Link href="/legal/terms-of-use" className="hover:text-blue-800 transition-colors">Terms of Use</Link>
            <span className="text-slate-300">|</span>
            <Link href="/legal/cookie-policy" className="hover:text-blue-800 transition-colors">Cookie Policy</Link>
            <span className="text-slate-300">|</span>
            <Link href="/legal/privacy-policy" className="hover:text-blue-800 transition-colors">Privacy Policy</Link>
            <span className="text-slate-300">|</span>
            <Link href="/legal/disclaimer" className="hover:text-blue-800 transition-colors">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
