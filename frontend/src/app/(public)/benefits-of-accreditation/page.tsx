import React from "react";
import Link from "next/link";
import { ChevronRight, CheckCircle2, TrendingUp, ShieldCheck, Globe } from "lucide-react";

export default function BenefitsOfAccreditationPage() {
  const benefits = [
    { title: "For Businesses & Manufacturers", desc: "Reduces risk of product failure, ensures regulatory compliance, and unlocks global markets through recognized standards." },
    { title: "For Certification Bodies (CABs)", desc: "Establishes independent validation of technical competence, enhances market reputation, and ensures operational rigor." },
    { title: "For Regulators & Governments", desc: "Provides reliable benchmark for approving safety, health, and environmental compliance without costly state inspections." },
    { title: "For End Consumers", desc: "Delivers peace of mind that certified products and services meet stringent safety and quality requirements." },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      <div className="bg-[#0b2341] text-white py-12 border-b border-blue-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <nav className="mb-4 flex items-center justify-center gap-2 text-xs text-slate-300 font-medium">
            <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
            <ChevronRight className="size-3 text-slate-400" />
            <span className="text-amber-400 font-semibold">Benefits of Accreditation</span>
          </nav>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">Benefits of Accreditation</h1>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((b) => (
            <div key={b.title} className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
              <CheckCircle2 className="size-8 text-amber-500 mb-3" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">{b.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
