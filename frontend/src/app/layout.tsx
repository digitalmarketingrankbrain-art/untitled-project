import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastProvider } from "@/components/ui/toast";
import { AuthSessionProvider } from "@/components/auth/session-provider";
import { SITE_URL } from "@/lib/site-url";
import "./globals.css";

// The one typeface for the whole site (variable font, so every weight is available).
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "South Asia Accreditation Foundation (SAAF) | United Assessment Services Limited (UASL)",
  description:
    "Official website of United Assessment Services Limited (UASL) / South Asia Accreditation Foundation (SAAF) — Independent international accreditation body delivering trust, scheme competence, and verification.",
  keywords: [
    "SAAF",
    "UASL",
    "United Assessment Services Limited",
    "South Asia Accreditation Foundation",
    "Accreditation Body",
    "ISO 17025",
    "ISO 17020",
    "ISO 17021",
    "Verification Portal",
    "Conformity Assessment",
  ],
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Browser extensions can add attributes to the root nodes before React hydrates.
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased selection:bg-blue-600 selection:text-white`}
        suppressHydrationWarning
      >
        <AuthSessionProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
