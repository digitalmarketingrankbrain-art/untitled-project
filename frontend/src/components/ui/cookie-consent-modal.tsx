"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Modal } from "./modal";
const sections = ["How we use cookies", "Essential Website Cookies", "Other external services", "Privacy Policy"];
export function CookieConsentModal() {
  const [banner, setBanner] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [preferences, setPreferences] = useState({webfonts:false,maps:false,videos:false});
  const close = useCallback(() => setOpen(false), []);
  useEffect(() => {
    try {
      setBanner(!localStorage.getItem("uasl_cookie_consent"));
      const saved = localStorage.getItem("uasl_cookie_preferences");
      if (saved) setPreferences(JSON.parse(saved));
    } catch { setBanner(true); }
    const reopen = () => setOpen(true);
    window.addEventListener("uasl-cookie-settings",reopen);
    return () => window.removeEventListener("uasl-cookie-settings",reopen);
  }, []);
  function save() {
    try { localStorage.setItem("uasl_cookie_consent","accepted"); localStorage.setItem("uasl_cookie_preferences",JSON.stringify(preferences)); } catch {}
    setBanner(false); setOpen(false);
  }
  return <>
    {banner && <div className="fixed inset-x-0 bottom-0 z-50 flex flex-wrap items-center justify-center gap-4 border-t border-slate-200 bg-white px-5 py-4 text-sm text-slate-700 shadow-md" role="region" aria-label="Cookie notice">
      <p>This website uses cookies for essential site functions.</p>
      <button className="border border-slate-300 bg-white px-5 py-2 text-slate-800" onClick={save}>OK</button>
      <button className="bg-[#12395B] px-5 py-2 text-white" onClick={() => setOpen(true)}>Learn More</button>
    </div>}
    <Modal open={open} onClose={close} title="Cookie and Privacy Settings" className="max-h-[90dvh] max-w-3xl overflow-y-auto rounded-none" footer={<button className="bg-[#12395B] px-5 py-2 text-white" onClick={save}>Save Preferences &amp; Accept</button>}>
      <div className="grid gap-5 sm:grid-cols-[200px_1fr]">
        <div className="flex flex-col gap-1" aria-label="Cookie settings categories">{sections.map((label,i) => <button className={`border-l-2 p-3 text-left ${active === i ? "border-[#12395B] bg-slate-100 text-[#12395B]" : "border-transparent"}`} key={label} aria-pressed={active === i} onClick={() => setActive(i)}>{label}</button>)}</div>
        <div className="space-y-4 py-3">
          <h3 className="font-semibold">{sections[active]}</h3>
          {active === 0 && <p>We use cookies to support site navigation and secure access to your account. Select a category to review your preferences.</p>}
          {active === 1 && <p>These cookies are strictly necessary to provide the website and its features, including access to secure portal areas. They remain enabled.</p>}
          {active === 2 && <><p>External webfonts, maps and video embeds are not loaded on these pages. Your preferences are saved for supported external services.</p>{(["webfonts","maps","videos"] as const).map((key,i) => <label className="flex items-center justify-between gap-4 border-b border-slate-200 py-3" key={key}><span>{["Google Webfonts","Google Maps","Video embeds"][i]}</span><input type="checkbox" checked={preferences[key]} onChange={e => setPreferences({...preferences,[key]:e.target.checked})} /></label>)}</>}
          {active === 3 && <p>You can read about cookies and privacy in our <Link href="/legal/privacy-policy" onClick={close} className="text-blue-800 underline">Privacy Policy</Link>.</p>}
        </div>
      </div>
    </Modal>
  </>;
}

