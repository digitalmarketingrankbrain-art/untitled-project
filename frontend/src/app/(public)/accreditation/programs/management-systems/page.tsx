import Link from "next/link";
import { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import SchemeCardImage from "@/components/schemes/scheme-card-image";

export const metadata: Metadata = {
  title: "Management Systems Accreditation | SAAF",
  description: "Explore all Management System Accreditation Schemes offered by SAAF under ISO/IEC 17021-1.",
};

const MANAGEMENT_SCHEMES = [
  {
    slug: "iso9001",
    title: "Quality Management Systems (ISO 9001)",
    desc: "Accreditation for Quality Management Systems Scheme in accordance with ISO 9001.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop",
  },
  {
    slug: "iso14001",
    title: "Environmental Management Systems (ISO 14001)",
    desc: "Accreditation for Environmental Management Systems Scheme in accordance with ISO 14001.",
    image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=600&auto=format&fit=crop",
  },
  {
    slug: "iso45001",
    title: "Occupational Health and Safety Management Systems (ISO 45001)",
    desc: "Accreditation for Occupational Health and Safety Management Systems Scheme in accordance with ISO 45001.",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop",
  },
  {
    slug: "iso50001",
    title: "Energy Management Systems (ISO 50001)",
    desc: "Accreditation for Energy Management Systems Scheme in accordance with ISO 50001.",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&auto=format&fit=crop",
  },
  {
    slug: "iso13485",
    title: "Medical Devices – Quality Management Systems (ISO 13485)",
    desc: "Accreditation for Medical Devices Quality Management Systems Scheme in accordance with ISO 13485.",
    image: "https://images.unsplash.com/photo-1583912267670-657592e5c6fd?w=600&auto=format&fit=crop",
  },
  {
    slug: "iso22000",
    title: "Food Safety Management Systems (ISO 22000)",
    desc: "Accreditation for Food Safety Management Systems Scheme in accordance with ISO 22000.",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&auto=format&fit=crop",
  },
  {
    slug: "iso27001",
    title: "Information Security Management Systems (ISO/IEC 27001)",
    desc: "Accreditation for Information Security Management Systems Scheme in accordance with ISO 27001.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop",
  },
  {
    slug: "iso20000",
    title: "Information Technology – Service Management System (ISO/IEC 20000)",
    desc: "Accreditation for Information Technology Service Management System Scheme in accordance with ISO 20000.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop",
  },
  {
    slug: "iso22301",
    title: "Business Continuity Management Systems (ISO 22301)",
    desc: "Accreditation for Business Continuity Management Systems Scheme in accordance with ISO 22301.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop",
  },
  {
    slug: "iso55001",
    title: "Asset Management System (ISO 55001)",
    desc: "Accreditation for Asset Management Systems Scheme in accordance with ISO 55001.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop",
  },
  {
    slug: "iso27701",
    title: "Privacy Information Management System (ISO/IEC 27701)",
    desc: "Accreditation for Privacy Information Management Systems.",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&auto=format&fit=crop",
  },
  {
    slug: "iso21001",
    title: "Educational Organizations Management Systems (ISO 21001)",
    desc: "Accreditation for Educational Organizations Management Systems.",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&auto=format&fit=crop",
  },
  {
    slug: "iso39001",
    title: "Road Traffic Safety Management Systems (ISO 39001)",
    desc: "Accreditation for Road Traffic Safety Management Systems.",
    image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=600&auto=format&fit=crop",
  },
  {
    slug: "iso28000",
    title: "Security Management Systems for the supply chain (ISO 28000)",
    desc: "Accreditation for Supply Chain Security Management System - ISO 28000.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop",
  },
  {
    slug: "iso37001",
    title: "Anti-Bribery Management Systems (ISO 37001)",
    desc: "Accreditation for Anti-Bribery Management System - ISO 37001.",
    image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop",
  },
  {
    slug: "iso20121",
    title: "Event Sustainability Management Systems (ISO 20121)",
    desc: "Accreditation for Event Sustainability Management Systems - ISO 20121.",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop",
  },
  {
    slug: "iso41001",
    title: "Facility Management – Management Systems (ISO 41001)",
    desc: "Accreditation for Facility Management Management Systems - ISO 41001.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop",
  },
  {
    slug: "iso30000",
    title: "Ship Recycling Management System",
    desc: "Accreditation for Ship Recycling Management System - ISO 30000.",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&auto=format&fit=crop",
  },
  {
    slug: "iso42001",
    title: "Artificial Intelligence Management System",
    desc: "Accreditation for Artificial Intelligence Management Systems in accordance with ISO/IEC 42001.",
    image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop",
  },
  {
    slug: "iso37301",
    title: "Compliance Management Systems (ISO 37301)",
    desc: "Accreditation for Compliance Management Systems.",
    image: "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?w=600&auto=format&fit=crop",
  },
  {
    slug: "iso18788",
    title: "Management system for private security operations (ISO 18788)",
    desc: "Accreditation for Private Security Operations Management System.",
    image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&auto=format&fit=crop",
  },
];

export default function ManagementSystemsPage() {
  return (
    <div className="bg-slate-50/50 min-h-screen pb-16">
      {/* Header Banner */}
      <div className="border-b border-slate-200 bg-white py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <nav className="mb-3 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
            <Link href="/" className="hover:text-slate-800 transition-colors">Home</Link>
            <ChevronRight className="size-3 text-slate-400" />
            <Link href="/accreditation" className="hover:text-slate-800 transition-colors">Accreditation</Link>
            <ChevronRight className="size-3 text-slate-400" />
            <span className="text-blue-600 font-semibold">Management Systems</span>
          </nav>

          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Accreditation Services
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 font-medium">
            Management Systems Accreditation Schemes (ISO/IEC 17021-1)
          </p>
        </div>
      </div>

      {/* 3-Column Grid Matching Reference Image Exactly */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MANAGEMENT_SCHEMES.map((scheme) => (
            <div
              key={scheme.title}
              className="group flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:border-slate-300 hover:shadow-md transition-all"
            >
              <div>
                {/* Header Image Component with Fallback Artwork */}
                <SchemeCardImage
                  slug={scheme.slug}
                  title={scheme.title}
                  image={scheme.image}
                />

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors">
                    {scheme.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed min-h-[3rem]">
                    {scheme.desc}
                  </p>
                </div>
              </div>

              {/* Bottom Action Button */}
              <div className="px-5 pb-5">
                <Link
                  href="/apply"
                  className="inline-flex items-center gap-1.5 rounded bg-[#006699] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#005580] transition-colors"
                >
                  <span>Explore &gt;&gt;</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


