import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy | SAAF",
  description: "How we collect, use, and protect personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      breadcrumbLabel="Privacy Policy"
      sections={[
        { heading: "Information We Collect" },
        { heading: "How We Use It" },
        { heading: "Data Retention" },
        { heading: "Your Rights" },
        { heading: "Cookies" },
        { heading: "Contact Us About Privacy" },
      ]}
    />
  );
}
