"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Building2, FileCheck, ShieldCheck } from "lucide-react";

export function UaslHomeCards() {
  const cards = [
    {
      title: "Management System",
      description:
        "UASL offers assessment for management system certification schemes around the world (ISO 9001, ISO 14001, ISO 27001, ISO 45001, etc.).",
      linkText: "Read more",
      href: "/management-system-certification",
      icon: FileCheck,
      badge: "ISO Standards",
    },
    {
      title: "Accredited Body",
      description:
        "If you wish to check out the name of Assessed Body to verify the assessment criteria, technical scope, and accreditation status.",
      linkText: "Read more",
      href: "/accredited-body",
      icon: Building2,
      badge: "Public Register",
    },
    {
      title: "Certified Organisation",
      description:
        "If you wish to check out the current status of a certified organization assessed by UASL accredited bodies, verify instantly here.",
      linkText: "Check Here",
      href: "/certifiedorganization",
      icon: ShieldCheck,
      badge: "Live Lookup",
    },
  ];

  return (
    <section className="bg-slate-50/80 py-8 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md transition-all duration-200 hover:border-blue-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="rounded-lg bg-blue-50 p-2.5 text-[#0b2341] border border-blue-100">
                      <Icon className="size-5 text-blue-700" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                      {card.badge}
                    </span>
                  </div>

                  <h2 className="font-display text-lg font-extrabold text-[#0b2341]">
                    {card.title}
                  </h2>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 font-normal">
                    {card.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <Link
                    href={card.href}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0b2341] hover:text-blue-700 transition-colors group"
                  >
                    <span>{card.linkText}</span>
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
