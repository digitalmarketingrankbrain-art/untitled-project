import type { Metadata } from "next";
import { ReferenceContentPage } from "@/components/layout/reference-content-page";

export const metadata: Metadata = { title: "What is Accreditation | UASL" };

export default function Page() {
  return <ReferenceContentPage slug="what-is-accreditation" />;
}
