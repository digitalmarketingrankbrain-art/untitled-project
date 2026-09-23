import type { Metadata } from "next";
import { ReferenceContentPage } from "@/components/layout/reference-content-page";

export const metadata: Metadata = { title: "Benefits of accreditation | UASL" };

export default function Page() {
  return <ReferenceContentPage slug="benefits-of-accreditation" />;
}
