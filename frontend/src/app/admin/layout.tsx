import { PortalShell } from "@/components/portal/portal-shell";
import { AdminSidebar } from "@/components/portal/admin-sidebar";

export default function AdminPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalShell>
      <div className="mx-auto flex max-w-7xl items-start">
        <AdminSidebar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </PortalShell>
  );
}
