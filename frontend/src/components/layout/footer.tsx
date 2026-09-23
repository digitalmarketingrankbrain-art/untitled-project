"use client";
import Image from "next/image";
import Link from "next/link";
import { ChevronUp } from "lucide-react";
const columns = [
  { title: "About", links: [["Information Center","information-center"],["Use of Logo","use-of-logo"],["Feedback","feedback"],["Members","members"]] },
  { title: "", links: [["Certified Organization","certifiedorganization"],["Careers","careers"]] },
  { title: "Accreditation", links: [["What is Accreditation","what-is-accreditation"],["How to become accreditated","how-to-become-accreditated"],["Benefits of accreditation","benefits-of-accreditation"],["Management System Certification","management-system-certification"]] },
  { title: "", links: [["Product Certification","product-certification"],["Personal Certification","personal-certification"],["Inspection","inspection"],["Rating","rating"],["Fees & Structure","fee-structure"],["Accredited Body","accredited-body"]] },
];
export function Footer() {
  return <footer className="reference-footer">
    <div className="reference-container reference-footer-grid">
      <Link href="/" aria-label="UASL home"><Image src="/images/uasl/footer.jpeg" width={100} height={170} alt="United Assessment Services Limited" /></Link>
      {columns.map((column,index) => <div key={index}>{column.title && <h2>{column.title}</h2>}<ul>{column.links.map(([label,href]) => <li key={href}><Link href={"/"+href}>{label}</Link></li>)}</ul></div>)}
    </div>
    <div className="reference-footer-bottom">
      <p>Copyright © 2018 UASL <span>|</span> <Link href="/legal/terms-of-use">Terms of Use</Link> <span>|</span> <Link href="/legal/cookie-policy">Cookie Policy</Link> <span>|</span> <Link href="/legal/privacy-policy">Privacy Policy</Link> <span>|</span> <Link href="/legal/disclaimer">Disclaimer</Link></p>
      <p>UASL is a company registered in England and Wales (No. 08283067).</p>
      <button onClick={() => window.dispatchEvent(new Event("uasl-cookie-settings"))} className="underline">Cookie settings</button>
    </div>
    <button className="reference-back-top" aria-label="Scroll to top" onClick={() => window.scrollTo({top:0,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth"})}><ChevronUp size={20} /></button>
  </footer>;
}
