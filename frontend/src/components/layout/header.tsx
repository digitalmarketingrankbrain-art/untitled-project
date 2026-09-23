"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X, Search, ChevronDown, LogIn } from "lucide-react";
import { HEADER_NAV } from "@/lib/nav";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const close = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) { setOpen(null); setSearchOpen(false); } };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  function closeMenus() { setOpen(null); setMobileOpen(false); setSearchOpen(false); }
  const items = [
    {label:"Home", href:"/"},
    {label:"About", href:"/information-center"},
    {label:"Certified Organization", href:"/certifiedorganization"},
    {label:"Accreditation", href:"/accreditation"},
    {label:"Careers", href:"/careers"},
    {label:"Get in touch", href:"/get-in-touch"},
  ];
  return <header className="reference-header" ref={ref} onKeyDown={e => { if(e.key === "Escape") closeMenus(); }}>
    <a className="reference-skip" href="#main-content">Skip to content</a>
    <div className="reference-topbar" />
    <div className="reference-container reference-header-row">
      <Link href="/" aria-label="UASL home" onClick={closeMenus}><Image className="reference-logo" src="/images/uasl/header.jpg" width={300} height={106} alt="UASL United Assessment Services Limited and IAAB" priority /></Link>
      <button className="reference-menu-toggle" aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen} aria-controls="reference-navigation" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X /> : <Menu />}</button>
      <nav id="reference-navigation" className={`reference-navigation ${mobileOpen ? "is-open" : ""}`} aria-label="Main navigation">
        {items.map(item => {
          const group = HEADER_NAV.find(g => g.label === item.label);
          const active = pathname === item.href || group?.links.some(link => pathname === link.href);
          return <div className={`reference-nav-item ${active ? "is-active" : ""}`} key={item.label} onMouseEnter={() => { if (group && window.matchMedia("(min-width: 901px)").matches) setOpen(item.label); }} onMouseLeave={() => { if (window.matchMedia("(min-width: 901px)").matches) setOpen(null); }} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(null); }}>
            {group ? <button aria-expanded={open === item.label} aria-controls={`submenu-${item.label}`} onClick={e => setOpen(e.detail !== 0 && window.matchMedia("(min-width: 901px)").matches ? item.label : open === item.label ? null : item.label)}>{item.label}<ChevronDown size={12} /></button> : <Link href={item.href} aria-current={active ? "page" : undefined} onClick={closeMenus}>{item.label}</Link>}
            {group && open === item.label && <div className="reference-submenu" id={`submenu-${item.label}`}>{group.links.map(link => <Link href={link.href} key={link.href} onClick={closeMenus}>{link.label}</Link>)}</div>}
          </div>;
        })}
        <button className="reference-search-toggle" aria-label="Search" aria-expanded={searchOpen} onClick={() => setSearchOpen(!searchOpen)}><Search size={17} /></button>
        <Link
          href="/login"
          onClick={closeMenus}
          className="ml-2 inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 transition-colors"
        >
          <LogIn size={14} />
          <span>Login</span>
        </Link>
      </nav>
    </div>
    {searchOpen && <form className="reference-container reference-header-search" onSubmit={e => {e.preventDefault(); closeMenus(); router.push("/certifiedorganization?q=" + encodeURIComponent(query.trim()));}}>
      <label htmlFor="header-search" className="sr-only">Search certificate or organisation</label><input id="header-search" autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Search certificate or organisation" /><button type="submit">Search</button>
    </form>}
  </header>;
}
