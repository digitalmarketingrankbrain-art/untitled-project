import Link from "next/link";
import { ScrollText, ClipboardList, FileStack, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

const LINKS = [
  { icon: ScrollText, label: "Governing Policies", desc: "Versioned & dated accreditation policies", href: "/resources/policies" },
  { icon: ClipboardList, label: "Assessment Procedures", desc: "Step-by-step guidance for applicants", href: "/resources/procedures" },
  { icon: FileStack, label: "Application Forms", desc: "Official downloadable document templates", href: "/resources/forms" },
];

function TransparencySection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-900">
            Open Access Institutional Transparency
          </div>
          <h2 className="mt-4 font-display text-3xl font-extrabold text-slate-900 sm:text-4xl lg:text-5xl">
            Complete Public Availability of Rules & Criteria
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            SAAF publishes all governing policies, fee schedules, operational procedures, and appeal workflows openly to ensure impartial, equal treatment for every conformity assessment body.
          </p>
        </Reveal>

        <Reveal delayMs={80} className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/70 p-6 transition-all hover:border-blue-500/50 hover:bg-white hover:shadow-xl"
              >
                <div>
                  <div className="rounded-xl bg-blue-100/80 p-3 text-blue-800 w-fit">
                    <Icon className="size-6" strokeWidth={1.75} />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-slate-900 group-hover:text-blue-800">
                    {link.label}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {link.desc}
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1 text-xs font-bold text-blue-700 group-hover:translate-x-1 transition-transform">
                  <span>View Documents</span>
                  <ArrowRight className="size-3.5" />
                </div>
              </Link>
            );
          })}
        </Reveal>

        <div className="mt-8">
          <Link
            href="/resources"
            className={cn(buttonVariants({ variant: "secondary" }), "font-bold text-slate-800 border-slate-300 hover:bg-slate-100")}
          >
            Browse SAAF Resource Library
          </Link>
        </div>
      </div>
    </section>
  );
}

export { TransparencySection };
