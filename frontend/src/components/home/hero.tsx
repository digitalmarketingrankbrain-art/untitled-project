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
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0b2341] via-[#0f2942] to-[#1e3a8a] text-white py-16 lg:py-24">
      {/* Background Decorative Graphic */}
      <div className="pointer-events-none absolute -right-32 top-1/2 -translate-y-1/2 opacity-20 hidden lg:block">
        <div className="w-[600px] h-[600px] rounded-full border-[40px] border-amber-400/30 blur-2xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          
          {/* Left Content */}
          <div className="lg:col-span-7">
            {/* Top Pill Tag */}
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-1.5 text-amber-300 backdrop-blur-md">
              <span className="flex size-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider">
                United Assessment Services Limited
              </span>
            </div>

            {/* Main Title */}
            <h1 className="mt-5 font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-white">
              Independent Impartial <span className="text-amber-400">Assessment Body</span>
            </h1>

            {/* Subtitle / Intro Description */}
            <p className="mt-5 text-base sm:text-lg leading-relaxed text-slate-200 max-w-2xl font-normal">
              UASL provides independent assessment of Conformity Assessment Bodies (CABs) worldwide in Management Systems (ISO 9001, ISO 14001, ISO 27001, ISO 45001), Product Certification, Personnel Certification, and Inspection.
            </p>

            {/* Verification Form Card */}
            <div className="mt-8 max-w-xl">
              <form
                onSubmit={handleQuickVerify}
                className="flex flex-col gap-2 rounded-xl bg-white/95 p-2 shadow-2xl backdrop-blur-md sm:flex-row sm:items-center border border-amber-400/30"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter Certificate No. or Organization Name..."
                    className="w-full rounded-lg bg-slate-100/80 py-3 pl-10 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-6 py-3 text-sm font-bold text-slate-950 transition-all hover:bg-amber-400 sm:shrink-0 shadow-md"
                >
                  <ShieldCheck className="size-4" />
                  <span>Verify Here</span>
                </button>
              </form>
              <p className="mt-3 flex items-center gap-2 text-xs text-amber-200 font-medium">
                <CheckCircle2 className="size-4 text-amber-400" />
                <span>Verify certified organizations and accredited bodies instantly.</span>
              </p>
            </div>

            {/* Quick Action Links */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/accredited-body"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-900/80 hover:bg-blue-800 px-4 py-2.5 text-xs font-bold text-white border border-blue-700/60 transition-colors"
              >
                <Building2 className="size-4 text-amber-400" />
                <span>Accredited Body Directory</span>
                <ArrowRight className="size-3.5" />
              </Link>
              <Link
                href="/management-system-certification"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-900/80 hover:bg-blue-800 px-4 py-2.5 text-xs font-bold text-white border border-blue-700/60 transition-colors"
              >
                <FileCheck className="size-4 text-amber-400" />
                <span>Management System Certification</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Card / Interactive Showcase */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl border border-blue-700/50 bg-[#0f2942]/90 p-6 shadow-2xl backdrop-blur-lg">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-4 rounded-2xl bg-slate-950/60 border border-amber-400/30">
                  <SaafLogo variant="emblem" size="xl" className="h-16 w-auto" />
                </div>

                <h2 className="font-display text-xl font-bold text-white">
                  United Assessment Services Limited
                </h2>
                <p className="mt-1 text-xs text-amber-400 font-semibold">
                  Global Independent Assessment Body
                </p>

                <div className="mt-6 w-full space-y-3 rounded-xl bg-slate-950/50 p-4 border border-slate-800 text-left text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-slate-800">
                    <span className="text-slate-400">Incorporation:</span>
                    <span className="font-bold text-slate-100">England & Wales (08283067)</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-800">
                    <span className="text-slate-400">Core Services:</span>
                    <span className="font-bold text-amber-300">CAB Assessment & Accreditation</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-800">
                    <span className="text-slate-400">ISO Standards:</span>
                    <span className="font-bold text-slate-100">ISO 9001, 14001, 27001, 45001</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-400">Verification Registry:</span>
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-400">
                      <CheckCircle2 className="size-3.5" /> Live & Public
                    </span>
                  </div>
                </div>

                <div className="mt-6 w-full">
                  <Link
                    href="/certifiedorganization"
                    className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 text-sm font-bold text-slate-950 shadow-md hover:from-amber-400 hover:to-amber-500 transition-all"
                  >
                    <span>Search Certified Organisation</span>
                    <ChevronRight className="size-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Trust Metrics Strip */}
        <div className="mt-14 grid grid-cols-2 gap-4 rounded-2xl border border-blue-900/80 bg-[#0b2341]/80 p-5 shadow-xl sm:grid-cols-4 lg:gap-8 backdrop-blur-md">
          {TRUST_METRICS.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.label} className="flex items-start gap-3.5">
                <div className="rounded-xl bg-amber-400/20 p-2.5 text-amber-400 border border-amber-400/30">
                  <Icon className="size-5" />
                </div>
                <div>
                  <p className="font-display text-xl sm:text-2xl font-bold text-white">{metric.value}</p>
                  <p className="text-xs font-bold text-amber-300">{metric.label}</p>
                  <p className="text-[11px] text-slate-300">{metric.sub}</p>
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
