import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Tabs } from "@/components/ui/tabs";
import { Accordion } from "@/components/ui/accordion";
import { FAQ_AUDIENCES } from "@/lib/faqs";

export const metadata: Metadata = {
  title: "FAQs | SAAF",
  description: "Frequently asked questions, organised by audience.",
};

export default function FaqsPage() {
  return (
    <>
      <PageHeader breadcrumbs={[{ label: "FAQs" }]} title="Frequently Asked Questions" />
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Tabs
          items={FAQ_AUDIENCES.map((audience) => ({
            value: audience.key,
            label: audience.label,
            content: (
              <Accordion
                items={audience.faqs.map((faq) => ({
                  id: faq.id,
                  question: faq.question,
                  answer: faq.answer,
                }))}
              />
            ),
          }))}
        />
      </div>
    </>
  );
}
