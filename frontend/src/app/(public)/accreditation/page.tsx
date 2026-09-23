import Link from "next/link";
import { HEADER_NAV } from "@/lib/nav";
export const metadata = {title:"Accreditation | UASL"};
export default function Page() { return <article className="reference-container reference-content"><h1>Accreditation</h1><ul>{HEADER_NAV.find(group=>group.label === "Accreditation")?.links.map(link=><li key={link.href}><Link href={link.href}>{link.label}</Link></li>)}</ul></article>; }
