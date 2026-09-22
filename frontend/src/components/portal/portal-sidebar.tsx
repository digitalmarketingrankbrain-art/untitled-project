"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SidebarItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
}

export interface SidebarSection {
  title?: string;
  items: SidebarItem[];
}

interface PortalSidebarProps {
  items?: SidebarItem[];
  sections?: SidebarSection[];
}

function PortalSidebar({ items, sections }: PortalSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab");

  const effectiveSections: SidebarSection[] = sections
    ? sections
    : items
    ? [{ title: "Navigation Menu", items }]
    : [];

  return (
    <nav className="sticky top-20 w-64 shrink-0 py-6 pr-5 hidden md:block">
      <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-3.5 shadow-xs backdrop-blur-sm space-y-4">
        {effectiveSections.map((section, idx) => (
          <div key={section.title ?? idx} className={cn(idx > 0 && "pt-3 border-t border-slate-100")}>
            {section.title && (
              <div className="px-3 py-1.5 mb-1 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {section.title}
                </span>
              </div>
            )}
            <ul className="flex flex-col gap-1">
              {section.items.map((item) => {
                const [itemPath, itemQuery] = item.href.split("?");
                const pathMatches = pathname === itemPath || (pathname?.startsWith(itemPath + "/") && itemPath !== "/cab/applicant");
                const itemTab = itemQuery ? new URLSearchParams(itemQuery).get("tab") : null;
                const active = itemTab
                  ? pathMatches && activeTab === itemTab
                  : pathMatches && (!activeTab || activeTab === "overview");

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex items-center justify-between rounded-xl px-3 py-2.5 font-sans text-xs sm:text-sm font-medium transition-all duration-200 relative",
                        active
                          ? "bg-gradient-to-r from-blue-700 to-indigo-700 text-white shadow-md shadow-blue-900/15 font-semibold"
                          : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 hover:translate-x-0.5",
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <item.icon
                          className={cn(
                            "size-4 shrink-0 transition-transform duration-200 group-hover:scale-110",
                            active ? "text-white" : "text-slate-400 group-hover:text-blue-700",
                          )}
                          strokeWidth={2}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge !== undefined && (
                        <span
                          className={cn(
                            "ml-2 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-tight font-mono",
                            active
                              ? "bg-white/20 text-white"
                              : "bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-700",
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}

export { PortalSidebar };
