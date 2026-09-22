"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, ShieldCheck, QrCode, CheckCircle2, FileText, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

function VerificationSection() {
  const router = useRouter();
  const [query, setQuery] = React.useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/verify${query ? `?q=${encodeURIComponent(query)}` : ""}`);
  }

  return (
    <section className="relative overflow-hidden border-y border-slate-200 bg-white py-16 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          
          {/* Left Side: Verification Description & Live Form */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-900">
              <ShieldCheck className="size-3.5 text-blue-600" />
              SAAF Public Verification Register
            </div>

            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Verify Any SAAF Accreditation Claim Instantly
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              To eliminate counterfeit certificates and unauthorized reliance, SAAF provides a public real-time register. Anyone can search an accreditation number or organization name to verify active scope, validity dates, and evaluation status.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2 sm:flex-row">
              <div className="relative flex-1">
                <Search
                  className="pointer-events-none absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-slate-400"
                  strokeWidth={2}
                />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Try 'ACC-2026-9041' or 'Apex Testing Lab'..."
                  aria-label="Accreditation number or organisation name"
                  className="h-11 border-0 bg-white pl-10 pr-4 font-medium text-slate-900 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-blue-600 rounded-lg"
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                className="h-11 bg-blue-600 text-white font-semibold hover:bg-blue-700 px-6 sm:shrink-0 rounded-lg shadow-none"
              >
                <ShieldCheck className="size-4" />
                <span>Verify Now</span>
              </Button>
            </form>

            <div className="mt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-emerald-600" />
                No login required
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="size-3.5 text-blue-600" />
                Cryptographically signed hashes
              </span>
              <span className="flex items-center gap-1.5">
                <FileText className="size-3.5 text-slate-400" />
                PDF verification receipt
              </span>
            </div>
          </div>

          {/* Right Side: Mock Verification Certificate & QR Stamp */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl border border-slate-200 bg-slate-50/80 p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <QrCode className="size-4.5 text-blue-600" />
                  <span className="text-xs font-bold text-slate-900">
                    Live Status Monitor
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-ping" />
                  STATUS: ACTIVE
                </span>
              </div>

              <div className="mt-4 space-y-2.5 font-mono text-xs">
                <div className="rounded-xl bg-white p-3 border border-slate-200">
                  <p className="text-[10px] text-slate-400 uppercase font-sans font-semibold">CAB ORGANISATION</p>
                  <p className="font-bold text-slate-900 text-sm font-sans mt-0.5">National Metrology &amp; Testing Services</p>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="rounded-xl bg-white p-3 border border-slate-200">
                    <p className="text-[10px] text-slate-400 uppercase font-sans font-semibold">ACCREDITATION NO.</p>
                    <p className="font-bold text-blue-700 mt-0.5">ACC-2026-9041</p>
                  </div>
                  <div className="rounded-xl bg-white p-3 border border-slate-200">
                    <p className="text-[10px] text-slate-400 uppercase font-sans font-semibold">STANDARD</p>
                    <p className="font-bold text-slate-900 mt-0.5">ISO/IEC 17025:2017</p>
                  </div>
                </div>
                <div className="rounded-xl bg-white p-3 border border-slate-200 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-sans font-semibold">VALIDITY PERIOD</p>
                    <p className="font-bold text-slate-900 mt-0.5 font-sans">2024-01-15 to 2027-01-14</p>
                  </div>
                  <CheckCircle2 className="size-5 text-emerald-600" />
                </div>
              </div>
            </div>
          </div>

        </Reveal>
      </div>
    </section>
  );
}

export { VerificationSection };
