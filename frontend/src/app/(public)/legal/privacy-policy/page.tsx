import type { Metadata } from "next";
import { ReferenceContentPage } from "@/components/layout/reference-content-page";

export const metadata: Metadata = { title: "Privacy Policy | UASL" };

export default function Page() {
  return <ReferenceContentPage slug="privacy-policy" />;
}
