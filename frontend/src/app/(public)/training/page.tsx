import Link from "next/link";
import type { Metadata } from "next";
import { GraduationCap } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { TRAINING_COURSES } from "@/lib/training";

export const metadata: Metadata = {
  title: "Training | SAAF",
  description: "Courses for assessors and client organisations.",
};

export default function TrainingIndexPage() {
  return (
    <>
      <PageHeader breadcrumbs={[{ label: "Training" }]} title="Training" />
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {TRAINING_COURSES.map((course) => (
            <Card key={course.slug} interactive>
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <GraduationCap className="size-5 text-secondary" strokeWidth={1.5} />
                  <StatusBadge tone="info" label={course.format} size="sm" />
                </div>
                <CardTitle>{course.title}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1">
                <p className="font-mono text-xs text-text-muted">Next date: {course.nextDate}</p>
                <Link
                  href={`/training/${course.slug}`}
                  className="font-sans text-sm font-medium text-secondary hover:underline"
                >
                  View course →
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
