import { getAllRequiredForms, getAllProgramsForPicker } from "@/lib/portal/required-forms-data";
import { RequiredFormsPanel } from "@/components/portal/required-forms-panel";

export default async function AdminRequiredFormsPage() {
  const [forms, programs] = await Promise.all([getAllRequiredForms(), getAllProgramsForPicker()]);

  return (
    <div className="px-6 py-8">
      <h1 className="font-display text-2xl font-semibold text-text">Required Forms &amp; Documents</h1>
      <p className="mt-1 font-sans text-sm text-text-muted">
        Configure which documents a CB must submit per scheme, when they&apos;re due, and at which stage — no code changes needed to add a new one.
      </p>
      <div className="mt-6">
        <RequiredFormsPanel forms={forms} programs={programs} />
      </div>
    </div>
  );
}
