import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal-page";

export const metadata: Metadata = {
  title: "Terms of Use | SAAF",
  description: "Terms governing use of this website and the SAAF portal.",
};

export default function TermsOfUsePage() {
  return (
    <LegalPage
      title="Terms of Use"
      breadcrumbLabel="Terms of Use"
      sections={[
        { heading: "Acceptable Use" },
        { heading: "Account Terms" },
        { heading: "Accreditation Mark Usage" },
        { heading: "Liability" },
        { heading: "Governing Law" },
      ]}
    />
  );
}
