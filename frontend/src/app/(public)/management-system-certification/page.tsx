import type { Metadata } from "next";
import { ReferenceContentPage } from "@/components/layout/reference-content-page";

export const metadata: Metadata = { title: "Management System Certification | UASL" };

export default function Page() {
  return <ReferenceContentPage slug="management-system-certification" />;
}
