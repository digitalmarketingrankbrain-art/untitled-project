import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { TRAINING_COURSES } from "@/lib/training";

export function generateStaticParams() {
  return TRAINING_COURSES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = TRAINING_COURSES.find((c) => c.slug === slug);
  if (!course) return {};
  return { title: `${course.title} | SAAF`, description: course.description };
}

export default async function TrainingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = TRAINING_COURSES.find((c) => c.slug === slug);
  if (!course) notFound();

  return (
    <PageHeader
      breadcrumbs={[{ label: "Training", href: "/training" }, { label: course.title }]}
      title={course.title}
      meta={`${course.format} · Next date ${course.nextDate}`}
      description={course.description}
    >
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <h2 className="font-sans text-sm font-semibold text-text">Audience</h2>
          <p className="mt-1 font-sans text-sm text-text-muted">{course.audience}</p>
        </div>
        <div>
          <h2 className="font-sans text-sm font-semibold text-text">Prerequisites</h2>
          <p className="mt-1 font-sans text-sm text-text-muted">{course.prerequisites}</p>
        </div>
        <div>
          <h2 className="font-sans text-sm font-semibold text-text">Cost</h2>
          <p className="mt-1 font-sans text-sm text-text-muted">{course.cost}</p>
        </div>
        <div>
          <h2 className="font-sans text-sm font-semibold text-text">What you receive</h2>
          <p className="mt-1 font-sans text-sm text-text-muted">{course.whatYouReceive}</p>
        </div>
      </div>
      <Button variant="primary" className="mt-8">
        Register interest
      </Button>
    </PageHeader>
  );
}
