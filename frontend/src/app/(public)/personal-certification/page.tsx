import type { Metadata } from "next";
import { ReferenceContentPage } from "@/components/layout/reference-content-page";

export const metadata: Metadata = { title: "Personal Certification | UASL" };

export default function Page() {
  return <ReferenceContentPage slug="personal-certification" />;
}
