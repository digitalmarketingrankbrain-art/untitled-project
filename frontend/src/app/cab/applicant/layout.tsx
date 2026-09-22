import { ApplicantSidebar } from "@/components/portal/applicant-sidebar";

export default function ApplicantPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-7xl items-start gap-4 px-4 sm:px-6">
      <ApplicantSidebar />
      <main className="min-w-0 flex-1 py-6">{children}</main>
    </div>
  );
}
