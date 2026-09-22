import Link from "next/link";
import { ArrowRight, FileCheck2, Layers, Search, UserCheck } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

const ITEMS = [
  {
    number: "01",
    icon: FileCheck2,
    label: "Apply for Accreditation",
    description: "Submit application for testing, calibration, or inspection scope",
    href: "/apply",
    accentBg: "bg-blue-50 text-blue-700",
  },
  {
    number: "02",
    icon: Layers,
    label: "Accreditation Programs",
    description: "Explore ISO 17025, ISO 17020 & ISO 17021 evaluation schemes",
    href: "/accreditation/programs",
    accentBg: "bg-amber-50 text-amber-700",
  },
  {
    number: "03",
    icon: Search,
    label: "Verify Certificate Register",
    description: "Real-time tamper-proof verification of accredited entities",
    href: "/verify",
    accentBg: "bg-emerald-50 text-emerald-700",
  },
  {
    number: "04",
    icon: UserCheck,
    label: "Become an SAAF Assessor",
    description: "Join South Asia's premier technical assessment expert panel",
    href: "/assessors/become-an-assessor",
    accentBg: "bg-purple-50 text-purple-700",
  },
];

function TrustStrip() {
  return (
    <section className="border-b border-slate-200/80 bg-slate-50/80 py-10">
      <Reveal className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-6 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Direct Access Portals
            </p>
            <h2 className="font-display text-xl font-extrabold text-slate-900">
              Institutional Pathways & Public Services
            </h2>
          </div>
          <span className="text-xs font-medium text-slate-500">
            Official South Asia Accreditation Foundation Services
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-900/5"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-extrabold text-slate-400">
                      {item.number}
                    </span>
                    <div className={`rounded-xl p-2.5 ${item.accentBg} transition-transform group-hover:scale-110`}>
                      <Icon className="size-5" />
                    </div>
                  </div>
                  <h3 className="mt-4 font-display text-base font-bold text-slate-900 group-hover:text-blue-700">
                    {item.label}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-blue-700 group-hover:translate-x-1 transition-transform">
                  <span>Access Now</span>
                  <ArrowRight className="size-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}

export { TrustStrip };
