"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, ChevronDown, Phone, Mail, Globe, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { HEADER_NAV, TOP_BAR_LINKS } from "@/lib/nav";
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
  const isApplyActive = pathname === "/apply";

  return (
    <header ref={headerRef} className="sticky top-0 z-40 w-full shadow-md">
      {/* UASL Top Announcement / Quick Nav Bar */}
      <div className="bg-slate-950 text-slate-300 text-xs py-2 px-4 sm:px-6 border-b border-slate-800">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <Globe className="size-3.5" />
              United Assessment Services Limited (UASL)
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-slate-400">
              Registered in England & Wales (No. 08283067)
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] sm:text-xs ml-auto">
            <Link href="/certifiedorganization" className="hover:text-amber-400 font-semibold transition-colors flex items-center gap-1">
              <Search className="size-3" />
              Search Certificate
            </Link>
            <Link href="/careers" className="hover:text-amber-400 transition-colors">
              Careers
            </Link>
            <Link href="/get-in-touch" className="hover:text-amber-400 transition-colors">
              Get in touch
            </Link>
            <Link href="/login" className="flex items-center gap-1 font-semibold text-amber-400 hover:text-amber-300 transition-colors bg-slate-900 px-2 py-0.5 rounded border border-amber-400/30">
              <Lock className="size-3" />
              Portal Login
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="bg-[#0b2341] border-b border-blue-900/60 text-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 py-1">
            <SaafLogo variant="horizontal" size="md" lightMode={true} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            <Link
              href="/"
              className={cn(
                "whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold transition-colors",
                pathname === "/" ? "bg-blue-900/90 text-amber-400 font-bold" : "text-slate-100 hover:bg-blue-900/60 hover:text-amber-300"
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
                      "flex items-center gap-1 whitespace-nowrap rounded-md px-3.5 py-2 text-sm font-semibold transition-colors relative",
                      isGroupActive
                        ? "bg-blue-900/90 text-amber-400 font-bold"
                        : "text-slate-100 hover:bg-blue-900/60 hover:text-amber-300",
                      isOpen && "bg-blue-900 text-amber-400"
                    )}
                  >
                    <span>{group.label}</span>
                    <ChevronDown
                      className={cn(
                        "size-3.5 transition-transform duration-200",
                        isOpen && "rotate-180 text-amber-400"
                      )}
                    />
                  </button>

                  {isOpen && (
                    <div className="absolute left-0 top-full pt-2 w-80 z-50">
                      <div className="rounded-xl border border-slate-700 bg-[#0f2942] p-2 shadow-2xl ring-1 ring-black/20 animate-fade-up text-slate-100">
                        {group.links.map((link) => {
                          const isLinkActive = pathname === link.href;
                          return (
                            <Link
                              key={link.href}
                              href={link.href}
                              onClick={() => setOpenMenu(null)}
                              className={cn(
                                "block rounded-lg px-3.5 py-2.5 transition-colors",
                                isLinkActive
                                  ? "bg-blue-900/90 text-amber-300 font-bold border-l-2 border-amber-400 pl-3"
                                  : "hover:bg-blue-950/80 hover:text-amber-300"
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold text-white">
                                  {link.label}
                                </p>
                                {isLinkActive && <span className="size-1.5 rounded-full bg-amber-400" />}
                              </div>
                              {link.description && (
                                <p className="mt-0.5 text-xs text-slate-300 font-normal line-clamp-2">
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
                "whitespace-nowrap rounded-md px-3.5 py-2 text-sm font-semibold transition-colors",
                isCertifiedOrgActive
                  ? "bg-blue-900/90 text-amber-400 font-bold"
                  : "text-slate-100 hover:bg-blue-900/60 hover:text-amber-300"
              )}
            >
              Certified Organisation
            </Link>

            <Link
              href="/accredited-body"
              className={cn(
                "whitespace-nowrap rounded-md px-3.5 py-2 text-sm font-semibold transition-colors",
                isAccreditedBodyActive
                  ? "bg-blue-900/90 text-amber-400 font-bold"
                  : "text-slate-100 hover:bg-blue-900/60 hover:text-amber-300"
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
                "h-10 whitespace-nowrap px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all shadow-md hover:shadow-amber-500/20 border border-amber-400"
              )}
            >
              Apply for Accreditation
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="rounded-lg p-2 text-slate-100 hover:bg-blue-900 lg:hidden"
          >
            <Menu className="size-6" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#0b2341] text-white lg:hidden">
          <div className="flex h-16 items-center justify-between border-b border-blue-900 px-6">
            <SaafLogo variant="horizontal" size="md" lightMode={true} />
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="rounded-lg p-2 text-slate-300 hover:bg-blue-900"
            >
              <X className="size-6" strokeWidth={2} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            <Link
              href="/certifiedorganization"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold bg-amber-500 text-slate-950 shadow-md"
            >
              <span className="flex items-center gap-2">
                <Search className="size-4" />
                Check Certified Organisation
              </span>
              <span className="rounded bg-slate-950 px-2 py-0.5 text-[10px] text-amber-400 font-bold">VERIFY</span>
            </Link>

            <div className="space-y-4">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="block text-base font-bold text-amber-400"
              >
                Home
              </Link>

              {HEADER_NAV.map((group) => (
                <div key={group.label} className="border-t border-blue-900/60 pt-3">
                  <p className="mb-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                    {group.label}
                  </p>
                  <div className="flex flex-col gap-2 pl-2">
                    {group.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="text-sm text-slate-200 hover:text-amber-300 py-1"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              <div className="border-t border-blue-900/60 pt-3 flex flex-col gap-2">
                <Link
                  href="/certifiedorganization"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-bold text-slate-100 hover:text-amber-300 py-1"
                >
                  Certified Organisation
                </Link>
                <Link
                  href="/accredited-body"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-bold text-slate-100 hover:text-amber-300 py-1"
                >
                  Accredited Body
                </Link>
                <Link
                  href="/careers"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-slate-300 hover:text-amber-300 py-1"
                >
                  Careers
                </Link>
                <Link
                  href="/get-in-touch"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-slate-300 hover:text-amber-300 py-1"
                >
                  Get in touch
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-blue-900 px-6 py-4 bg-[#081726]">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-950 py-2.5 text-sm font-bold text-white border border-blue-800"
            >
              <Lock className="size-4 text-amber-400" />
              Portal Login
            </Link>
            <Link
              href="/apply"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center rounded-lg bg-amber-500 py-2.5 text-sm font-bold text-slate-950 shadow-md"
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
