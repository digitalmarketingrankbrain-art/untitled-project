"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";

export default function GetInTouchPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      <div className="bg-gradient-to-b from-slate-100 via-blue-50/40 to-white text-slate-900 py-12 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <nav className="mb-4 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
            <Link href="/" className="hover:text-blue-700 transition-colors">Home</Link>
            <ChevronRight className="size-3 text-slate-400" />
            <span className="text-blue-900 font-bold">Get in Touch</span>
          </nav>

          <h1 className="text-3xl font-extrabold tracking-tight text-[#0b2341] sm:text-5xl">
            Get in Touch
          </h1>
          <p className="mt-3 text-base text-slate-600 max-w-2xl mx-auto font-normal">
            United Assessment Services Limited — Contact our team for inquiries, accreditation applications, or verification assistance.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Contact Details Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-md">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Head Office Details</h2>

              <div className="space-y-6 text-sm text-slate-700">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-blue-50 text-blue-900 border border-blue-100">
                    <MapPin className="size-5 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Registered Office</h3>
                    <p className="text-xs text-slate-600 mt-1">
                      United Assessment Services Limited (UASL)<br />
                      Company Registered in England & Wales (No. 08283067)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-blue-50 text-blue-900 border border-blue-100">
                    <Mail className="size-5 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Email Contact</h3>
                    <p className="text-xs text-slate-600 mt-1">info@uasl.uk.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-blue-50 text-blue-900 border border-blue-100">
                    <Phone className="size-5 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Operational Territory Note</h3>
                    <p className="text-xs text-slate-600 mt-1">
                      UASL has been established to provide services around the world. UASL will not provide any assessment service in UK territory. Assessment by UASL demonstrates the competence and independence of CABs in the field of assessment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-md">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Send Us a Message</h2>
              <p className="text-xs text-slate-500 mb-6">Fill out the form below and a representative will respond within 24 business hours.</p>

              {submitted ? (
                <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                  <CheckCircle2 className="size-12 text-emerald-600 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-emerald-900">Message Received!</h3>
                  <p className="text-xs text-emerald-700 mt-1">Thank you for reaching out to UASL. Our team will review your message shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                      <input type="text" required placeholder="John Doe" className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                      <input type="email" required placeholder="john@example.com" className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                    <input type="text" required placeholder="Accreditation Inquiry" className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Message</label>
                    <textarea rows={5} required placeholder="Your message..." className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600" />
                  </div>

                  <button type="submit" className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 py-3 text-xs font-bold shadow-md transition-all">
                    <Send className="size-4" />
                    <span>Submit Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
