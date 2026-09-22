"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, Award, Globe, ArrowRight } from "lucide-react";

export function UaslAboutSection() {
  const scopes = [
    "Management System Certification (ISO 9001, ISO 14001, ISO 27001 etc.)",
    "Product Certification",
    "Personnel Certification",
    "Inspection",
    "Rating",
  ];

  return (
    <section className="bg-white py-16 text-slate-900 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
          
          {/* Main About Content */}
          <div className="lg:col-span-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-900 border border-blue-200 mb-4">
              <Globe className="size-3.5 text-blue-700" />
              <span>About UASL</span>
            </div>

            <h2 className="font-display text-2xl font-extrabold text-[#0b2341] sm:text-4xl leading-tight">
              United Assessment Services Limited (UASL)
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-slate-700 font-normal">
              UASL is an independent, impartial assessment body responsible for providing assessment of conformity assessment bodies (CABs) in the fields of:
            </p>

            {/* Scope Bullet List */}
            <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {scopes.map((item) => (
                <li key={item} className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-[#0b2341]">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 space-y-4 text-xs leading-relaxed text-slate-600 font-normal">
              <p>
                We have been contributing since 1992 in the field of Management System Certification, Personal Certification, and Product Certification services. UASL has been established to provide services to all around the world and would be inviting applications worldwide. UASL will not provide any assessment service in UK territory. Hence Assessment by UASL demonstrates the competence and independence of these CABs in the field of assessment. UASL accredits CABs who in turn certify other organizations.
              </p>
              <p>
                UASL has been a persistent pioneer in the field of assessment, well known and respected for its combination of innovative and user-friendly business acumen and its respect for the vigorous maintenance of integrity and impartiality that is the hallmark of the quality assurance profession.
              </p>
              <p>
                UASL has pioneered conformity assessment body (CAB), through its performance. Our assessment reporting permits us to monitor the performance of CABs year on year and provides us the ability to determine, in detail, the manner in which CABs are attaining the levels of excellence we demand.
              </p>
              <p>
                Assessment by an independent authority means that when you choose a certification body to review your activities you are choosing someone who has been reviewed against defined standards. You will know that they have their own documented operating system and procedures for looking after your interests. You know that assessment by UASL has provided a level of assurance and recourse that is not normally available to business. All organizations certificated by UASL accredited organizations may be independently verified and their current certification status checked at{" "}
                <Link href="/certifiedorganization" className="font-bold text-blue-700 underline hover:text-blue-900">
                  Certified Organisation
                </Link>.
              </p>
            </div>
          </div>

          {/* Right Highlights & Quick Verification Box */}
          <div className="lg:col-span-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                <div className="rounded-xl bg-blue-100 p-3 text-blue-800">
                  <ShieldCheck className="size-6 text-blue-700" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Registered Authority</h3>
                  <p className="text-[11px] text-slate-500">England & Wales (No. 08283067)</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <Award className="size-4 text-amber-600 shrink-0" />
                  <span>30+ Years of Conformity Excellence</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="size-4 text-blue-700 shrink-0" />
                  <span>Worldwide Assessment Reach</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span>100% Impartial Peer Audits</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/certifiedorganization"
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#0b2341] py-3 text-xs font-bold text-white shadow-sm hover:bg-blue-900 transition-colors"
                >
                  <span>Verify Certified Organisation</span>
                  <ArrowRight className="size-3.5 text-amber-400" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
