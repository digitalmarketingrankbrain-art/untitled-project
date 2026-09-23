import type { Metadata } from "next";
import { ReferenceContentPage } from "@/components/layout/reference-content-page";

export const metadata: Metadata = { title: "Information Center | UASL" };

export default function Page() {
  return <ReferenceContentPage slug="information-center" />;
}
