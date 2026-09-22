import Link from "next/link";
import { auth } from "@/auth";
import { LogoutButton } from "@/components/auth/logout-button";
import { StatusBadge } from "@/components/ui/status-badge";
import { NotificationBell } from "@/components/portal/notification-bell";
import { getMyNotifications } from "@/lib/notifications-actions";
import { BackendUnavailableError } from "@/lib/rpc-client";
import { SaafLogo } from "@/components/ui/saaf-logo";

const PORTAL_LABEL: Record<string, string> = {
  APPLICANT: "CAB Portal",
  ASSESSOR: "Assessor Portal",
  ADMIN: "Admin Portal",
};

export async function PortalShell({ children }: { children: React.ReactNode }) {
  const session = await auth();
  let notifications: Awaited<ReturnType<typeof getMyNotifications>>["notifications"] = [];
  let unreadCount = 0;
  let serviceIssue = false;
  if (session?.user) {
    try {
      ({ notifications, unreadCount } = await getMyNotifications());
    } catch (err) {
      if (!(err instanceof BackendUnavailableError)) throw err;
      serviceIssue = true;
    }
  }

  const userInitial = session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/70 antialiased selection:bg-blue-600 selection:text-white">
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3 group transition-transform duration-150 hover:scale-[1.01]">
            <SaafLogo variant="emblem" size="sm" className="sm:hidden" />
            <SaafLogo variant="horizontal" size="sm" className="hidden sm:inline-flex" />
            {session?.user && (
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-blue-50/80 px-3 py-0.5 text-[11px] font-bold text-blue-700 uppercase tracking-wider border border-blue-200/80 shadow-2xs">
                <span className="size-1.5 rounded-full bg-blue-600 animate-pulse" />
                {PORTAL_LABEL[session.user.role] ?? "Portal"}
              </span>
            )}
          </Link>

          {session?.user && (
            <div className="flex items-center gap-3">
              <NotificationBell initialNotifications={notifications} initialUnreadCount={unreadCount} />

              <div className="h-4 w-px bg-slate-200/80" />

              <div className="flex items-center gap-2.5 pl-1 group cursor-default">
                <div className="flex size-8.5 items-center justify-center rounded-full bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 text-xs font-bold text-white shadow-xs ring-2 ring-white">
                  {userInitial}
                </div>
                <div className="hidden md:flex md:flex-col">
                  <span className="text-xs font-semibold text-slate-800 leading-tight group-hover:text-blue-700 transition-colors">{session.user.name}</span>
                  <span className="text-[10px] font-medium text-slate-500 capitalize">{session.user.role.toLowerCase()}</span>
                </div>
              </div>

              <StatusBadge tone="neutral" label={session.user.role} size="sm" className="hidden lg:inline-flex" />
              <LogoutButton />
            </div>
          )}
        </div>
      </header>
      {serviceIssue && (
        <div role="alert" className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-sm text-amber-900">
          We&apos;re having a database connection issue right now. Some information may be unavailable — please try again shortly.
        </div>
      )}
      <div className="flex-1">{children}</div>
    </div>
  );
}
