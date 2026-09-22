"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, ChevronDown, Globe, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { HEADER_NAV } from "@/lib/nav";
import { SaafLogo } from "@/components/ui/saaf-logo";

function Header() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = React.useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const headerRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isCertifiedOrgActive = pathname === "/certifiedorganization";
  const isAccreditedBodyActive = pathname === "/accredited-body";

  return (
    <header ref={headerRef} className="sticky top-0 z-40 w-full shadow-sm">
      {/* UASL Top Announcement / Quick Nav Bar */}
      <div className="bg-slate-100 text-slate-700 text-xs py-1 px-4 sm:px-6 border-b border-slate-200">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1.5 text-[#0b2341] font-bold">
              <Globe className="size-3.5 text-blue-700" />
              United Assessment Services Limited (UASL)
            </span>
            <span className="hidden md:inline text-slate-300">|</span>
            <span className="hidden md:inline text-slate-500 font-medium">
              Registered in England & Wales (No. 08283067)
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] sm:text-xs ml-auto font-medium">
            <Link href="/certifiedorganization" className="hover:text-blue-700 font-semibold transition-colors flex items-center gap-1 text-slate-700">
              <Search className="size-3 text-blue-600" />
              Search Certificate
            </Link>
            <Link href="/careers" className="hover:text-blue-700 transition-colors text-slate-600">
              Careers
            </Link>
            <Link href="/get-in-touch" className="hover:text-blue-700 transition-colors text-slate-600">
              Get in touch
            </Link>
            <Link href="/login" className="flex items-center gap-1 font-semibold text-blue-900 hover:text-blue-700 hover:bg-blue-100/70 transition-colors bg-white px-2 py-0.5 rounded border border-slate-300 shadow-xs">
              <Lock className="size-3 text-blue-700" />
              Portal Login
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="bg-white border-b border-slate-200 text-slate-900">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 py-0.5">
            <SaafLogo variant="horizontal" size="sm" lightMode={false} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            <Link
              href="/"
              className={cn(
                "whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                pathname === "/" ? "bg-blue-50 text-blue-900 font-bold border border-blue-200" : "text-slate-700 hover:bg-slate-100 hover:text-blue-900"
              )}
            >
              Home
            </Link>

            {HEADER_NAV.map((group) => {
              const isGroupActive =
                (group.href && pathname.startsWith(group.href)) ||
                group.links.some((l) => pathname === l.href || pathname.startsWith(l.href));
              const isOpen = openMenu === group.label;

              return (
                <div
                  key={group.label}
                  className="relative group"
                  onMouseEnter={() => setOpenMenu(group.label)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <button
                    aria-expanded={isOpen}
                    onClick={() => setOpenMenu(isOpen ? null : group.label)}
                    className={cn(
                      "flex items-center gap-1 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-semibold transition-colors relative",
                      isGroupActive
                        ? "bg-blue-50 text-blue-900 font-bold border border-blue-200"
                        : "text-slate-700 hover:bg-slate-100 hover:text-blue-900",
                      isOpen && "bg-slate-100 text-blue-900"
                    )}
                  >
                    <span>{group.label}</span>
                    <ChevronDown
                      className={cn(
                        "size-3 transition-transform duration-200 text-slate-500",
                        isOpen && "rotate-180 text-blue-700"
                      )}
                    />
                  </button>

                  {isOpen && (
                    <div className="absolute left-0 top-full pt-1.5 w-72 z-50">
                      <div className="rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl ring-1 ring-slate-900/5 animate-fade-up text-slate-800">
                        {group.links.map((link) => {
                          const isLinkActive = pathname === link.href;
                          return (
                            <Link
                              key={link.href}
                              href={link.href}
                              onClick={() => setOpenMenu(null)}
                              className={cn(
                                "block rounded-lg px-3 py-2 transition-colors",
                                isLinkActive
                                  ? "bg-blue-50 text-blue-900 font-bold border-l-3 border-blue-700 pl-2.5"
                                  : "hover:bg-slate-50 hover:text-blue-900"
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <p className="text-xs font-semibold text-slate-900">
                                  {link.label}
                                </p>
                                {isLinkActive && <span className="size-1.5 rounded-full bg-blue-600" />}
                              </div>
                              {link.description && (
                                <p className="mt-0.5 text-[11px] text-slate-500 font-normal line-clamp-1">
                                  {link.description}
                                </p>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <Link
              href="/certifiedorganization"
              className={cn(
                "whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                isCertifiedOrgActive
                  ? "bg-blue-50 text-blue-900 font-bold border border-blue-200"
                  : "text-slate-700 hover:bg-slate-100 hover:text-blue-900"
              )}
            >
              Certified Organisation
            </Link>

            <Link
              href="/accredited-body"
              className={cn(
                "whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                isAccreditedBodyActive
                  ? "bg-blue-50 text-blue-900 font-bold border border-blue-200"
                  : "text-slate-700 hover:bg-slate-100 hover:text-blue-900"
              )}
            >
              Accredited Body
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/apply"
              className={cn(
                buttonVariants({ variant: "primary", size: "sm" }),
                "h-8.5 whitespace-nowrap px-3.5 text-xs bg-[#0b2341] hover:bg-blue-900 text-white font-bold transition-all shadow-sm border border-[#0b2341]"
              )}
            >
              Apply for Accreditation
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
          >
            <Menu className="size-6" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white text-slate-900 lg:hidden">
          <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6 bg-slate-50">
            <SaafLogo variant="horizontal" size="md" lightMode={false} />
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-200"
            >
              <X className="size-6" strokeWidth={2} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            <Link
              href="/certifiedorganization"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold bg-blue-900 text-white shadow-md"
            >
              <span className="flex items-center gap-2">
                <Search className="size-4" />
                Check Certified Organisation
              </span>
              <span className="rounded bg-amber-500 px-2 py-0.5 text-[10px] text-slate-950 font-bold">VERIFY</span>
            </Link>

            <div className="space-y-4">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="block text-base font-bold text-blue-900"
              >
                Home
              </Link>

              {HEADER_NAV.map((group) => (
                <div key={group.label} className="border-t border-slate-200 pt-3">
                  <p className="mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {group.label}
                  </p>
                  <div className="flex flex-col gap-2 pl-2">
                    {group.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="text-sm text-slate-700 hover:text-blue-900 py-1 font-medium"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              <div className="border-t border-slate-200 pt-3 flex flex-col gap-2">
                <Link
                  href="/certifiedorganization"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-bold text-slate-800 hover:text-blue-900 py-1"
                >
                  Certified Organisation
                </Link>
                <Link
                  href="/accredited-body"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-bold text-slate-800 hover:text-blue-900 py-1"
                >
                  Accredited Body
                </Link>
                <Link
                  href="/careers"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-slate-600 hover:text-blue-900 py-1"
                >
                  Careers
                </Link>
                <Link
                  href="/get-in-touch"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-slate-600 hover:text-blue-900 py-1"
                >
                  Get in touch
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 bg-slate-50">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 rounded-lg bg-white py-2.5 text-sm font-bold text-slate-800 border border-slate-300 shadow-xs"
            >
              <Lock className="size-4 text-blue-700" />
              Portal Login
            </Link>
            <Link
              href="/apply"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center rounded-lg bg-[#0b2341] py-2.5 text-sm font-bold text-white shadow-md hover:bg-blue-900"
            >
              Apply for Accreditation
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export { Header };
