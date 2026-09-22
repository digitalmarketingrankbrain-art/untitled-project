"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ShieldCheck, CheckCircle2, Globe2, Award, Building2, ChevronRight, FileCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { SaafLogo } from "@/components/ui/saaf-logo";

const TRUST_METRICS = [
  { label: "Established Pioneer", value: "Since 1992", sub: "30+ Years of Excellence", icon: Award },
  { label: "Worldwide Coverage", value: "Global", sub: "International CAB Scope", icon: Globe2 },
  { label: "Management Systems", value: "ISO 9001/14001+", sub: "Certified Organizations", icon: Building2 },
  { label: "Public Register", value: "100% Live", sub: "Real-time Verification", icon: ShieldCheck },
];

function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleQuickVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/certifiedorganization?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/certifiedorganization");
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-blue-50/50 to-white text-slate-900 py-6 sm:py-8 lg:py-10 border-b border-slate-200">
      {/* Background Decorative Graphic */}
      <div className="pointer-events-none absolute -right-32 top-1/2 -translate-y-1/2 opacity-30 hidden lg:block">
        <div className="w-[500px] h-[500px] rounded-full border-[30px] border-blue-400/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-6 lg:gap-8 lg:grid-cols-12">
          
          {/* Left Content */}
          <div className="lg:col-span-7">
            {/* Top Pill Tag */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-blue-900">
              <span className="flex size-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider">
                United Assessment Services Limited
              </span>
            </div>

            {/* Main Title */}
            <h1 className="mt-3 font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-[#0b2341]">
              Independent Impartial <span className="text-blue-700">Assessment Body</span>
            </h1>

            {/* Subtitle / Intro Description */}
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600 max-w-2xl font-normal">
              UASL provides independent assessment of Conformity Assessment Bodies (CABs) worldwide in Management Systems (ISO 9001, ISO 14001, ISO 27001, ISO 45001), Product Certification, Personnel Certification, and Inspection.
            </p>

            {/* Verification Form Card */}
            <div className="mt-5 max-w-xl">
              <form
                onSubmit={handleQuickVerify}
                className="flex flex-col gap-1.5 rounded-xl bg-white p-1.5 shadow-lg border border-slate-200 sm:flex-row sm:items-center"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter Certificate No. or Organization Name..."
                    className="w-full rounded-lg bg-slate-50 py-2 pl-9 pr-3 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-[#0b2341] px-4 py-2 text-xs sm:text-sm font-bold text-white transition-all hover:bg-blue-900 sm:shrink-0 shadow-xs"
                >
                  <ShieldCheck className="size-4 text-amber-400" />
                  <span>Verify Here</span>
                </button>
              </form>
              <p className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
                <CheckCircle2 className="size-3.5 text-emerald-600" />
                <span>Verify certified organizations and accredited bodies instantly.</span>
              </p>
            </div>

            {/* Quick Action Links */}
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link
                href="/accredited-body"
                className="inline-flex items-center gap-1.5 rounded-lg bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 border border-slate-300 shadow-xs transition-colors"
              >
                <Building2 className="size-3.5 text-blue-700" />
                <span>Accredited Body Directory</span>
                <ArrowRight className="size-3 text-slate-500" />
              </Link>
              <Link
                href="/management-system-certification"
                className="inline-flex items-center gap-1.5 rounded-lg bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 border border-slate-300 shadow-xs transition-colors"
              >
                <FileCheck className="size-3.5 text-blue-700" />
                <span>Management System Certification</span>
                <ArrowRight className="size-3 text-slate-500" />
              </Link>
            </div>
          </div>

          {/* Right Card / Interactive Showcase */}
          <div className="lg:col-span-5">
            <div className="relative rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
              <div className="flex flex-col items-center text-center">
                <div className="mb-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <SaafLogo variant="emblem" size="md" className="h-10 sm:h-12 w-auto" lightMode={false} />
                </div>

                <h2 className="font-display text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  United Assessment Services Limited
                </h2>
                <p className="mt-0.5 text-[11px] text-blue-800 font-bold">
                  Global Independent Assessment Body
                </p>

                <div className="mt-3 w-full space-y-1.5 rounded-lg bg-slate-50 p-3 border border-slate-200 text-left text-[11px]">
                  <div className="flex justify-between items-center py-0.5 border-b border-slate-200">
                    <span className="text-slate-500">Incorporation:</span>
                    <span className="font-bold text-slate-900">England & Wales (08283067)</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5 border-b border-slate-200">
                    <span className="text-slate-500">Core Services:</span>
                    <span className="font-bold text-blue-900">CAB Assessment & Accreditation</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5 border-b border-slate-200">
                    <span className="text-slate-500">ISO Standards:</span>
                    <span className="font-bold text-slate-900">ISO 9001, 14001, 27001, 45001</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-slate-500">Verification Registry:</span>
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                      <CheckCircle2 className="size-3 text-emerald-600" /> Live & Public
                    </span>
                  </div>
                </div>

                <div className="mt-3.5 w-full">
                  <Link
                    href="/certifiedorganization"
                    className="flex items-center justify-center gap-1.5 w-full rounded-lg bg-[#0b2341] py-2 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-blue-900 transition-all"
                  >
                    <span>Search Certified Organisation</span>
                    <ChevronRight className="size-4 text-amber-400" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Trust Metrics Strip */}
        <div className="mt-6 grid grid-cols-2 gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-md sm:grid-cols-4 lg:gap-6">
          {TRUST_METRICS.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.label} className="flex items-start gap-2.5">
                <div className="rounded-lg bg-blue-50 p-2 text-blue-700 border border-blue-100 shrink-0">
                  <Icon className="size-4" />
                </div>
                <div>
                  <p className="font-display text-base sm:text-lg font-bold text-slate-900 leading-tight">{metric.value}</p>
                  <p className="text-[11px] font-bold text-blue-900">{metric.label}</p>
                  <p className="text-[10px] text-slate-500">{metric.sub}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export { Hero };
