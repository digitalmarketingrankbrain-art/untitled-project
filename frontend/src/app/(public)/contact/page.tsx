import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { ContactForm } from "@/components/contact/contact-form";
import { MapPin, Mail, Phone, Clock, ShieldCheck, FileCheck2, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | SAAF Accreditation",
  description: "Get in touch with South Asia Accreditation Foundation (SAAF) Secretariat.",
};

export default function ContactPage() {
  return (
    <div className="bg-slate-50/60 pb-16">
      <PageHeader
        breadcrumbs={[{ label: "Contact Us" }]}
        title="Contact Us"
        description="Have a question about accreditation standards, CAB applications, or verification? Fill out the form below or reach our Secretariat team."
      />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
            
            {/* Left Column: Form Section */}
            <div className="p-6 sm:p-8 lg:col-span-7">
              <div className="border-b border-slate-100 pb-4 mb-6">
                <h2 className="font-display text-xl font-extrabold text-slate-900 flex items-center justify-between">
                  <span>Contact Us</span>
                  <span className="text-xs font-normal text-slate-500">* Required Fields</span>
                </h2>
              </div>

              <ContactForm />
            </div>

            {/* Right Column: Official Contact Details Card */}
            <div className="p-6 sm:p-8 lg:col-span-5 bg-slate-50/60 flex flex-col justify-between space-y-8">
              <div className="space-y-6">
                <div className="border-b border-slate-200 pb-4">
                  <h3 className="font-display text-base font-bold text-slate-900">
                    SAAF Secretariat Info
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Official Accreditation Foundation Contact Channels</p>
                </div>

                {/* Address Block */}
                <div className="flex items-start gap-3.5">
                  <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 border border-blue-100 shrink-0 mt-0.5">
                    <MapPin className="size-5" />
                  </div>
                  <div className="text-xs text-slate-700 leading-relaxed">
                    <p className="font-bold text-slate-900 text-sm">United Accreditation Foundation / SAAF</p>
                    <p>1060 Laskin Road, Suite 12B/13B</p>
                    <p>Virginia Beach VA 23451</p>
                    <p className="font-medium text-slate-900">USA &amp; South Asia Secretariat</p>
                  </div>
                </div>

                {/* Email Block */}
                <div className="flex items-start gap-3.5">
                  <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 border border-blue-100 shrink-0 mt-0.5">
                    <Mail className="size-5" />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-slate-900">Official Email</p>
                    <a href="mailto:info@uafaccreditation.org" className="text-blue-600 hover:underline font-medium block mt-0.5">
                      info@uafaccreditation.org
                    </a>
                    <a href="mailto:info@saaf-accreditation.org" className="text-blue-600 hover:underline font-medium block">
                      info@saaf-accreditation.org
                    </a>
                  </div>
                </div>

                {/* Phone Block */}
                <div className="flex items-start gap-3.5">
                  <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 border border-blue-100 shrink-0 mt-0.5">
                    <Phone className="size-5" />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-slate-900">Helpline / Phone</p>
                    <a href="tel:+17572285581" className="text-slate-800 font-mono font-bold block mt-0.5 hover:text-blue-600">
                      +1-757-228-5581
                    </a>
                    <span className="text-[11px] text-slate-500">Mon - Fri (09:00 - 17:00 UTC)</span>
                  </div>
                </div>

                {/* Hours & Response */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <Clock className="size-4 text-blue-600" /> Response Time Commitment
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    General enquiries are typically responded to within <strong>24 business hours</strong>. Formal application requests receive an assigned Accreditation Officer within 48 hours.
                  </p>
                </div>
              </div>

              {/* Quick Navigation Links */}
              <div className="pt-4 border-t border-slate-200 space-y-2.5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Quick Links</p>
                <div className="flex flex-col gap-2 text-xs">
                  <Link href="/verify" className="flex items-center justify-between rounded-lg bg-white p-2.5 border border-slate-200 font-semibold text-slate-800 hover:border-blue-500 hover:text-blue-600">
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="size-4 text-blue-600" /> Public Verification Register
                    </span>
                    <ExternalLink className="size-3 text-slate-400" />
                  </Link>
                  <Link href="/apply" className="flex items-center justify-between rounded-lg bg-white p-2.5 border border-slate-200 font-semibold text-slate-800 hover:border-blue-500 hover:text-blue-600">
                    <span className="flex items-center gap-2">
                      <FileCheck2 className="size-4 text-blue-600" /> Apply for Accreditation
                    </span>
                    <ExternalLink className="size-3 text-slate-400" />
                  </Link>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
