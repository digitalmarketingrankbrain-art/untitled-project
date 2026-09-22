import { PortalShell } from "@/components/portal/portal-shell";

export default function CabLayout({ children }: { children: React.ReactNode }) {
  return <PortalShell>{children}</PortalShell>;
}
