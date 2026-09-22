import { PortalShell } from "@/components/portal/portal-shell";
import { AssessorSidebar } from "@/components/portal/assessor-sidebar";

export default function AssessorLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalShell>
      <div className="mx-auto flex max-w-6xl items-start">
        <AssessorSidebar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </PortalShell>
  );
}
