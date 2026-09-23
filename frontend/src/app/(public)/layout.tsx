import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CookieConsentModal } from "@/components/ui/cookie-consent-modal";
import type { Metadata } from "next";
import "./reference.css";

export const metadata: Metadata = {
  title: "UASL | United Assessment Services Limited",
  description: "United Assessment Services Limited: independent assessment of conformity assessment bodies, certification and inspection services.",
};

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="reference-site flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
      <CookieConsentModal />
    </div>
  );
}
