import { Suspense } from "react";
import { CertifiedOrgSearch } from "@/components/verification/certified-org-search";
export const metadata = {title:"Certified Organization | UASL"};
export default function Page() { return <article className="reference-container reference-content reference-registry"><h1>Certified Organization</h1><Suspense fallback={<p>Loading search...</p>}><CertifiedOrgSearch /></Suspense></article>; }
