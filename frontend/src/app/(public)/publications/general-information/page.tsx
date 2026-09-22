"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Info, Award, Workflow, FileCheck, DollarSign, Image as ImageIcon, Scale, MessageSquare, CheckCircle2, Download, Mail, MapPin } from "lucide-react";

export default function GeneralInformationPage() {
  const [activeTab, setActiveTab] = React.useState("information");

  return (
    <div className="bg-slate-50/50 min-h-screen pb-16">
      {/* Header Banner */}
      <div className="border-b border-slate-200 bg-white py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <nav className="mb-4 flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Link href="/" className="hover:text-slate-800 transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3 text-slate-400" />
            <Link href="/publications" className="hover:text-slate-800 transition-colors">
              Publications
            </Link>
            <ChevronRight className="size-3 text-slate-400" />
            <span className="text-blue-600 font-semibold">General Information</span>
          </nav>

          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/60 px-3 py-1 text-xs font-semibold text-blue-700 mb-2">
            <ShieldCheck className="size-3.5 text-blue-600" />
            <span>Official Institutional Information</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            General Information & Scheme Guidelines
          </h1>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Navigation Sidebar / Tabs */}
          <div className="lg:col-span-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sticky top-20">
              <p className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-2">
                Information Sections
              </p>
              <div className="flex flex-col gap-1">
                {[
                  { id: "information", title: "Information", icon: Info },
                  { id: "schemes", title: "Accreditation Schemes", icon: Award },
                  { id: "process", title: "Accreditation Process", icon: Workflow },
                  { id: "requirements", title: "Accreditation Requirements", icon: FileCheck },
                  { id: "fee", title: "Accreditation Fee", icon: DollarSign },
                  { id: "symbol", title: "Use Of Accreditation Symbol", icon: ImageIcon },
                  { id: "rights-obligations", title: "Rights And Obligations Of CABs", icon: Scale },
                  { id: "complaints-appeals", title: "Complaints, Appeals And Feedback", icon: MessageSquare },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all text-left ${
                        isActive
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className={`size-4 ${isActive ? "text-white" : "text-blue-600"}`} />
                        {item.title}
                      </span>
                      <ChevronRight className={`size-3.5 ${isActive ? "text-white" : "text-slate-400"}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tab Details Content */}
          <div className="lg:col-span-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              {/* TAB 1: INFORMATION */}
              {activeTab === "information" && (
                <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <Info className="size-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-slate-900">General Information</h2>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base mb-2">
                      Information about the authority under which the accreditation body operates:
                    </h3>
                    <p>
                      South Asia Accreditation Foundation (SAAF) is a not-for-profit organization. It operates in accordance with relevant international standards and requirements and maintains integrity and impartiality while taking into account national and public interest. South Asia Accreditation Foundation (SAAF) operates under the authority of its board of directors as a registered legal entity and is managed by honorary members (directors) including the president, secretary, vice president and treasurer.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base mb-2">
                      A description of SAAF’s rights and duties:
                    </h3>
                    <p>
                      South Asia Accreditation Foundation (SAAF) provides accreditation to certification bodies for various management system schemes as per ISO/IEC 17021-1 including, Personnel certification bodies as per ISO/IEC 17024, Inspection bodies as per ISO/IEC 17020, Testing and Calibration Laboratories as per ISO/IEC 17025, Product certification Bodies as per ISO/IEC 17065 and Validation and verification Schemes as per ISO/IEC 17029. The SAAF schemes of accreditations for Medical imaging centers as per ISO 15189 is under revision and will be available for accreditation shortly.
                    </p>
                    <p className="mt-2">
                      SAAF accreditation schemes are based on assessment of CAB competence as per its criteria and in accordance with SAAF and international standards and guidelines as per SAAF duties and responsibilities as defined in accreditation agreement and SAAF procedures. The policies and procedures for accreditation by the Board are non-discriminatory and are implemented uniformly to all the applicants. The SAAF Services are available in South Asia and other countries complying with applicable international cross-frontier policies. SAAF Board complies with the relevant national and international standards through a system established on the lines of applicable standards and guides.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base mb-2">
                      General information about the means by which SAAF obtains financial support:
                    </h3>
                    <p>
                      The operational expenses of SAAF and its Boards are generated through the accreditation services offered by charging uniform fee from conformity assessment bodies.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base mb-2">
                      Information about SAAF activities, other than accreditation:
                    </h3>
                    <p>
                      South Asia Accreditation Foundation (SAAF) is not involved in any other activities, other than accreditation.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base mb-2">
                      Information about international recognition arrangements in which SAAF is involved:
                    </h3>
                    <p>
                      The South Asia Accreditation Foundation (SAAF) is aligned with the International Accreditation Forum (IAF) frameworks and the Regional Accreditation Group of the Asia Pacific Accreditation Cooperation (APAC).
                    </p>
                    <p className="mt-2">
                      SAAF is a founder member of the National Accreditation Assessment Forum (NAAF) and holds a Director position on the NAAF Board.
                    </p>
                    <p className="mt-2">
                      Effective 1 January 2026, the International Accreditation Forum (IAF) and the International Laboratory Accreditation Cooperation (ILAC) merged to form Global Accreditation Cooperation Inc. (Global ACI). SAAF actively participates in Global ACI and regional cooperation to support the development and harmonization of international accreditation practices.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <h3 className="font-bold text-slate-900 text-base mb-3">
                      SAAF-APAC MRA & SAAF-IAF MLA Status:
                    </h3>
                    <p className="text-xs text-slate-500 mb-3">
                      SAAF is a signatory of Multilateral / Mutual Recognition Arrangements for:
                    </p>

                    <div className="grid sm:grid-cols-2 gap-2 text-xs font-medium">
                      {[
                        "Quality Management Systems (QMS) (ISO/IEC 17021-3 / ISO 9001)",
                        "Environmental Management Systems (EMS) (ISO/IEC 17021-2 / ISO 14001)",
                        "Occupational Health & Safety (OHSMS) (ISO/IEC 17021-10 / ISO 45001)",
                        "Food Safety Management Systems (FSMS) (ISO 22003-1 / ISO 22000)",
                        "Information Security Systems (ISMS) (ISO 27006 / ISO 27001)",
                        "Medical Device Quality (MDQMS) (ISO 13485)",
                        "Anti-Bribery Management Systems (ABMS) (ISO 37001)",
                        "Compliance Management Systems (CMS) (ISO 37301)",
                        "Energy Management Systems (EnMS) (ISO 50003 / ISO 50001)",
                        "Certifications – Persons (ISO/IEC 17024)",
                        "Inspection Bodies (ISO/IEC 17020)",
                        "Testing Laboratories (ISO/IEC 17025)",
                      ].map((item) => (
                        <div key={item} className="flex items-start gap-2 rounded-lg bg-slate-50 p-2 border border-slate-100">
                          <CheckCircle2 className="size-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ACCREDITATION SCHEMES */}
              {activeTab === "schemes" && (
                <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <Award className="size-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-slate-900">Accreditation Schemes</h2>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base mb-3">
                      1. Management System Accreditation Schemes (ISO/IEC 17021-1)
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-2 text-xs">
                      {[
                        "Environment Management System Scheme (ISO 14001)",
                        "Quality Management System Scheme (ISO 9001)",
                        "Food Safety Management System Scheme (ISO 22000)",
                        "Information Security Management System Scheme (ISO 27001)",
                        "Information Technology Service Management Scheme (ISO 20000-1)",
                        "Medical Devices Quality Management System Scheme (ISO 13485)",
                        "Business Continuity Management System Scheme (ISO 22301)",
                        "Energy Management System Scheme (ISO 50001)",
                        "Road Traffic Safety Management System Scheme (ISO 39001)",
                        "Supply Chain Security Management System Scheme (ISO 28000)",
                        "Asset Management System Scheme (ISO 55001)",
                        "Occupational Health & Safety Management Scheme (ISO 45001)",
                        "Anti-Bribery Management System Scheme (ISO 37001)",
                        "Event Sustainability Management System Scheme (ISO 20121)",
                        "Facility Management (FM) Management Scheme (ISO 41001)",
                        "Ship Recycling Management System Scheme (ISO 30000)",
                        "Privacy Information Management System Scheme (ISO 27701)",
                        "Educational Organizations Management Scheme (ISO 21001)",
                        "Compliance Management System Scheme (ISO 37301)",
                        "Artificial Intelligence Management System Scheme (ISO/IEC 42001)",
                        "Private Security Operations Management Scheme (ISO 18788)",
                        "Healthcare Organization Management System Scheme",
                        "Trustworthy Digital Repositories Management Scheme",
                        "Food Safety System Certification FSSC 22000",
                      ].map((scheme) => (
                        <div key={scheme} className="flex items-center gap-2 rounded-lg bg-blue-50/50 px-3 py-2 border border-blue-100/70 font-medium text-slate-800">
                          <span className="size-1.5 rounded-full bg-blue-600 shrink-0" />
                          <span>{scheme}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base mb-2">
                      2. Other Institutional Accreditation Schemes
                    </h3>
                    <ul className="space-y-2 text-xs sm:text-sm font-medium">
                      <li className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                        <strong className="text-slate-900">Personnel Certification:</strong> As per ISO/IEC 17024 and applicable mandatory documents.
                      </li>
                      <li className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                        <strong className="text-slate-900">Inspection Bodies:</strong> As per ISO/IEC 17020 and applicable mandatory documents.
                      </li>
                      <li className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                        <strong className="text-slate-900">Testing Laboratories:</strong> As per ISO/IEC 17025 and applicable mandatory documents.
                      </li>
                      <li className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                        <strong className="text-slate-900">Product Certification:</strong> As per ISO/IEC 17065 and applicable mandatory documents.
                      </li>
                      <li className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                        <strong className="text-slate-900">Validation & Verification Bodies:</strong> As per ISO/IEC 17029 (Organization Verification, Project V&V, Greenhouse Gas Programmes).
                      </li>
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <h3 className="font-bold text-slate-900 text-base mb-3">
                      Accreditation Schemes Under Revision & Development
                    </h3>
                    <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-slate-700">
                      <li>Calibration laboratories as per ISO/IEC 17025 (in process of development).</li>
                      <li>Medical Imaging Centers as per ISO 15189 (revised scheme under development).</li>
                      <li>Medical Laboratories as per ISO 15189 (revised scheme under development).</li>
                      <li>ISO 46001 - Water Efficiency Management Systems.</li>
                      <li>ISO 30401 - Knowledge Management Systems (Developed and ready for launch).</li>
                      <li>ISO 44001 - Collaborative Business Relationship Management (Developed and ready for launch).</li>
                      <li>ISO 37101 - Management System for Sustainable Development (Developed and ready for launch).</li>
                    </ol>
                  </div>
                </div>
              )}

              {/* TAB 3: ACCREDITATION PROCESS */}
              {activeTab === "process" && (
                <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <Workflow className="size-6 text-blue-600" />
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Accreditation Process</h2>
                      <p className="text-xs text-slate-500">Structured, traceable, 8-step accreditation decision workflow</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        step: "1",
                        title: "Initial Inquiry & Application",
                        desc: "The process begins when a CAB submits an application request through the SAAF website or portal. The CAB creates a profile in SAAF Portal, selects desired schemes, and uploads organizational legal status details.",
                      },
                      {
                        step: "2",
                        title: "Estimation & Confirmation of Accreditation Fee",
                        desc: "SAAF conducts an application review and prepares fee estimation based on scope, man-days required, and witness assessment count. The CAB confirms acceptance in the portal.",
                      },
                      {
                        step: "3",
                        title: "Application Fee & Document Submission",
                        desc: "SAAF issues invoice for application fee. The CAB signs the Accreditation Agreement, pays application fee, and uploads completed checklists and management system documentation.",
                      },
                      {
                        step: "4",
                        title: "Document Review",
                        desc: "SAAF technical assessors conduct document review against ISO standards and scheme rules. Any non-conformities identified are cleared by CAB before office assessment.",
                      },
                      {
                        step: "5",
                        title: "Office Assessment",
                        desc: "SAAF assessment team conducts on-site / remote office assessment to verify operational effectiveness. Assessment findings are logged and corrective action plan is verified.",
                      },
                      {
                        step: "6",
                        title: "Witness Assessments",
                        desc: "SAAF assessors observe CAB audit teams performing audits at client locations to evaluate technical competence, auditor objectivity, and scheme compliance.",
                      },
                      {
                        step: "7",
                        title: "Draft Reports & Confirmation",
                        desc: "Upon closure of all findings, SAAF prepares draft assessment reports for CAB review and factual accuracy confirmation.",
                      },
                      {
                        step: "8",
                        title: "Accreditation Decision",
                        desc: "Finalized reports are submitted to the independent SAAF Accreditation Review Committee (ARC). Upon ARC approval, SAAF issues accreditation certificate and updates public registry.",
                      },
                    ].map((s) => (
                      <div key={s.step} className="flex gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs">
                          {s.step}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm">{s.title}</h3>
                          <p className="mt-1 text-xs text-slate-600">{s.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 text-center">
                    <Link
                      href="/apply"
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-all shadow-sm"
                    >
                      <span>Apply For Accreditation Online</span>
                      <ChevronRight className="size-4" />
                    </Link>
                  </div>
                </div>
              )}

              {/* TAB 4: ACCREDITATION REQUIREMENTS */}
              {activeTab === "requirements" && (
                <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <FileCheck className="size-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-slate-900">Accreditation Requirements</h2>
                  </div>

                  <p>
                    All Conformity Assessment Bodies seeking or maintaining SAAF accreditation must comply with the following mandatory governing documents:
                  </p>

                  <div className="space-y-3">
                    {[
                      { code: "SAAF-GEN-CAB-01", title: "General Accreditation Requirements" },
                      { code: "SAAF-GEN-CAB-02", title: "General rules & conditions for use of mark" },
                      { code: "SAAF-F-043", title: "Accreditation Agreement" },
                    ].map((doc) => (
                      <div key={doc.code} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                        <div className="flex items-center gap-3">
                          <FileCheck className="size-4 text-blue-600" />
                          <div>
                            <span className="font-mono text-xs font-bold text-blue-700">{doc.code}</span>
                            <p className="text-xs font-semibold text-slate-900">{doc.title}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => alert(`Downloading requirement document: ${doc.code}`)}
                          className="inline-flex items-center gap-1 rounded bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-blue-600 hover:text-white transition-colors"
                        >
                          <Download className="size-3" />
                          <span>PDF</span>
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl bg-blue-50/70 p-4 border border-blue-200 text-xs leading-relaxed text-slate-700">
                    <p className="font-bold text-blue-900 text-sm mb-1">Request Application & Documentation Package:</p>
                    <p>
                      To request application for an accreditation scheme, download the above documents from website or email SAAF Secretariat at <strong className="text-blue-700">info@saafaccreditation.org</strong> for:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1 font-medium">
                      <li>Accreditation Application Request Form</li>
                      <li>Specific Scheme Accreditation Requirements</li>
                      <li>Specific Scheme Documentation Checklist</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 5: ACCREDITATION FEE */}
              {activeTab === "fee" && (
                <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <DollarSign className="size-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-slate-900">Accreditation Fee</h2>
                  </div>

                  <p>
                    South Asia Accreditation Foundation (SAAF) is an independent, non-profit organization. We apply a consistent fee structure for all Conformity Assessment Bodies (CABs) seeking accreditation.
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="text-xs font-bold text-blue-700 uppercase">Application Fee</div>
                      <div className="text-lg font-bold text-slate-900 mt-1">USD $5,000</div>
                      <p className="text-xs text-slate-500 mt-1">For first accreditation scheme ($2,000 for each subsequent scheme). Covers document review man-days.</p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="text-xs font-bold text-blue-700 uppercase">Assessment Fee</div>
                      <div className="text-lg font-bold text-slate-900 mt-1">USD $1,500</div>
                      <p className="text-xs text-slate-500 mt-1">Per man-day, based on an eight-hour assessment day.</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-sm mb-2">
                      The total fee is determined by several factors, including:
                    </h3>
                    <ul className="grid sm:grid-cols-2 gap-2 text-xs font-medium text-slate-700">
                      {[
                        "Key locations applied",
                        "Additional locations applied",
                        "Number of sites from which CAB operates",
                        "Technical scopes applied",
                        "Number of countries where CAB operates",
                        "Witnesses required per IAF MD requirements",
                        "Number of schemes applied (Persons certification)",
                        "Number of clusters applied (Inspection Bodies)",
                        "Testing Methods and Sites applied (Testing Labs)",
                        "Number of applied scopes (Product Certification)",
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-2 p-2 rounded bg-slate-50 border border-slate-100">
                          <span className="size-1.5 rounded-full bg-blue-600 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 text-xs text-slate-500">
                    For a detailed fee estimate for your full accreditation cycle, please email <strong className="text-blue-700">info@saafaccreditation.org</strong>.
                  </div>
                </div>
              )}

              {/* TAB 6: USE OF SYMBOL */}
              {activeTab === "symbol" && (
                <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <ImageIcon className="size-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-slate-900">Use Of Accreditation Symbol</h2>
                  </div>

                  <p>
                    Accredited Conformity Assessment Bodies are authorized to display the SAAF Accreditation Symbol on accredited certificates, audit reports, and official stationery under regulations defined in SAAF-DOC-102.
                  </p>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-3 text-xs sm:text-sm">
                    <h3 className="font-bold text-slate-900">Key Mark Rules & Guidelines:</h3>
                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                      <li>Symbol must always be displayed alongside CAB&apos;s own accreditation certificate number.</li>
                      <li>Cannot be used on product packaging or directly on products in a way that implies product certification.</li>
                      <li>Must maintain correct aspect ratio and approved SAAF color specifications.</li>
                      <li>Must be immediately discontinued upon suspension or withdrawal of accreditation.</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 7: RIGHTS & OBLIGATIONS */}
              {activeTab === "rights-obligations" && (
                <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <Scale className="size-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-slate-900">Rights And Obligations Of CABs</h2>
                  </div>

                  <p>
                    The Rights & Obligations of Conformity Assessment Bodies are detailed in the following official SAAF accreditation governing documents:
                  </p>

                  <div className="space-y-2 text-xs sm:text-sm">
                    {[
                      { code: "SAAF-GEN-CAB-01", title: "General Accreditation Requirements" },
                      { code: "SAAF-GEN-CAB-02", title: "General rules & conditions for use of mark" },
                      { code: "SAAF-F-043", title: "Accreditation Agreement" },
                      { code: "SCHEME-REQ", title: "Specific Scheme Accreditation Requirements" },
                    ].map((doc) => (
                      <div key={doc.code} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50">
                        <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                        <div>
                          <span className="font-mono text-xs font-bold text-blue-700">{doc.code}: </span>
                          <span className="font-medium text-slate-900">{doc.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 8: COMPLAINTS, APPEALS AND FEEDBACK */}
              {activeTab === "complaints-appeals" && (
                <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <MessageSquare className="size-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-slate-900">Complaints, Appeals And Feedback</h2>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs space-y-2">
                      <div className="flex items-center gap-2 text-blue-700 font-bold">
                        <Mail className="size-4" />
                        <span>Email Contact</span>
                      </div>
                      <p className="text-slate-600">Written complaints or feedback can be emailed with complete contact details to:</p>
                      <a href="mailto:info@saafaccreditation.org" className="font-mono font-bold text-blue-600 hover:underline block">
                        info@saafaccreditation.org
                      </a>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs space-y-2">
                      <div className="flex items-center gap-2 text-blue-700 font-bold">
                        <MapPin className="size-4" />
                        <span>Mailing Address</span>
                      </div>
                      <p className="text-slate-600">
                        South Asia Accreditation Foundation Secretariat,<br />
                        Official Regional Administrative Office,<br />
                        South Asia Secretariat Network.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base mb-1">Complaints Procedure</h3>
                      <p className="text-xs text-slate-600">
                        SAAF is committed to providing a value-adding accreditation service and maintaining highest standards. If you are a third party with concerns about SAAF activities or a CAB dissatisfied with our service, you may submit a formal complaint.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 text-base mb-1">Appeals Procedure</h3>
                      <p className="text-xs text-slate-600">
                        If an applicant or accredited CAB officially requests SAAF to reconsider any contrary decision made regarding its desired accreditation status, an appeal must be submitted in writing within thirty days of decision along with supporting evidence.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 text-base mb-1">Feedback</h3>
                      <p className="text-xs text-slate-600">
                        SAAF welcomes feedback regarding SAAF activities or accredited CAB customers (satisfaction, complaints, or misuse of SAAF logo/scope).
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200 space-y-3">
                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                      <div>
                        <p className="font-bold text-slate-900 text-xs">Feedback Form (exclusively for CABs)</p>
                        <p className="text-[11px] text-slate-500">Document Code: SAAF-F-069A</p>
                      </div>
                      <button
                        onClick={() => alert("Downloading document: SAAF-F-069A - CAB Feedback Form")}
                        className="inline-flex items-center gap-1 rounded bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
                      >
                        <Download className="size-3" />
                        <span>SAAF-F-069A</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                      <div>
                        <p className="font-bold text-slate-900 text-xs">Procedure for Handling Complaints, Appeals and Disputes</p>
                        <p className="text-[11px] text-slate-500">Document Code: SAAF-PR-06</p>
                      </div>
                      <button
                        onClick={() => alert("Downloading document: SAAF-PR-06 - Handling Complaints and Appeals")}
                        className="inline-flex items-center gap-1 rounded bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
                      >
                        <Download className="size-3" />
                        <span>SAAF-PR-06</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
