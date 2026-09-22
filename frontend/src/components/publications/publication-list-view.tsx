"use client";

import * as React from "react";
import Link from "next/link";
import { Search, FileText, Download, Calendar, ShieldCheck, ChevronRight, AlertCircle } from "lucide-react";

import { type PublicationItem, PUBLICATIONS_DATA } from "@/lib/publications";

interface PublicationListViewProps {
  category: PublicationItem["category"];
  title: string;
  subtitle: string;
  description: string;
}

export function PublicationListView({
  category,
  title,
  subtitle,
  description,
}: PublicationListViewProps) {
  const [search, setSearch] = React.useState("");

  const items = PUBLICATIONS_DATA.filter((item) => item.category === category);

  const filteredItems = items.filter((item) => {
    const q = search.toLowerCase().trim();
    return (
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.code.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    );
  });

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
            <span className="text-slate-500">Publications</span>
            <ChevronRight className="size-3 text-slate-400" />
            <span className="text-blue-600 font-semibold">{subtitle}</span>
          </nav>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/60 px-3 py-1 text-xs font-semibold text-blue-700 mb-2">
                <ShieldCheck className="size-3.5 text-blue-600" />
                <span>Official SAAF Publication</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {title}
              </h1>
              <p className="mt-1 text-sm text-slate-600 max-w-3xl leading-relaxed">
                {description}
              </p>
            </div>

            {/* Quick Filter Count */}
            <div className="shrink-0 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center sm:text-right">
              <div className="text-xs text-slate-500 font-medium">Available Documents</div>
              <div className="text-xl font-bold text-slate-900">{items.length} Files</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Search & Filter Bar */}
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, document code, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div className="text-xs font-medium text-slate-500">
            Showing {filteredItems.length} of {items.length} documents
          </div>
        </div>

        {/* Document Cards / Table */}
        {filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <AlertCircle className="mx-auto size-10 text-slate-400 mb-3" />
            <h3 className="text-base font-semibold text-slate-900">No matching documents found</h3>
            <p className="mt-1 text-xs text-slate-500">
              Try adjusting your search keyword or browse all official publications.
            </p>
            <button
              onClick={() => setSearch("")}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <FileText className="size-5" />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2.5 mb-1">
                        <span className="font-mono text-[11px] font-bold tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {item.code}
                        </span>
                        <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {item.version}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                          <Calendar className="size-3 text-slate-400" />
                          <span>{item.issueDate}</span>
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-600 leading-relaxed max-w-3xl">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 shrink-0 pt-3 border-t border-slate-100 md:pt-0 md:border-0">
                    <div className="text-right text-[11px] font-medium text-slate-500 hidden sm:block">
                      <div>{item.fileType} Format</div>
                      <div className="text-slate-400">{item.fileSize}</div>
                    </div>

                    <a
                      href={item.downloadUrl}
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`Downloading official document: ${item.code} - ${item.title}`);
                      }}
                      className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      <Download className="size-3.5" />
                      <span>Download {item.fileType}</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
