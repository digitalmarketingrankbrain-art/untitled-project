import Link from "next/link";
import type { Metadata } from "next";
import { FlaskConical } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { PROGRAMS } from "@/lib/programs";

export const metadata: Metadata = {
  title: "Accreditation Programs | SAAF",
  description: "Scopes we accredit and their eligibility criteria.",
};

export default function ProgramsIndexPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Accreditation", href: "/accreditation" }, { label: "Programs" }]}
        title="Accreditation Programs"
        description="Each program is defined by a specific scope and assessed against named criteria — not a general seal of approval."
      />
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROGRAMS.map((program) => (
            <Card key={program.slug} interactive>
              <CardHeader>
                <FlaskConical className="mb-2 size-5 text-secondary" strokeWidth={1.5} />
                <CardTitle>{program.name}</CardTitle>
                <CardDescription>{program.scopeDescription}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Link
                  href={`/accreditation/programs/${program.slug}`}
                  className="font-sans text-sm font-medium text-secondary hover:underline"
                >
                  View program →
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
