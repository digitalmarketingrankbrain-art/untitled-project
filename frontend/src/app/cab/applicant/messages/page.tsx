import Link from "next/link";
import { auth } from "@/auth";
import { EmptyState } from "@/components/ui/empty-state";
import { getApplicationsForUser, getMessagesForApplication } from "@/lib/portal/applicant-data";

/**
 * Case-scoped by design — Phase 8: messages are always contextual to a
 * specific application, never a general free-form inbox to "admin" at
 * large. This page is an index into each application's own thread.
 */
export default async function MessagesIndexPage() {
  const session = await auth();
  const apps = await getApplicationsForUser(session!.user.id);
  const threads = (
    await Promise.all(apps.map(async (a) => ({ application: a, messages: await getMessagesForApplication(a.id) })))
  ).filter((t) => t.messages.length > 0);

  return (
    <div className="px-6 py-8">
      <h1 className="font-display text-2xl font-semibold text-text">Messages</h1>
      <div className="mt-6 flex flex-col gap-3">
        {threads.length === 0 ? (
          <EmptyState title="No messages yet." description="Messages appear here once there's activity on one of your applications." />
        ) : (
          threads.map(({ application, messages }) => {
            const last = messages[messages.length - 1];
            return (
              <Link
                key={application.id}
                href={`/cab/applicant/applications/${application.id}?tab=messages`}
                className="rounded-lg border border-border bg-surface p-4 hover:border-secondary"
              >
                <div className="flex items-center justify-between">
                  <p className="font-sans text-sm font-semibold text-text">{application.programName}</p>
                  <span className="font-mono text-xs text-text-muted">{last?.createdAt}</span>
                </div>
                <p className="mt-1 font-sans text-xs text-text-muted">{application.referenceNumber}</p>
                <p className="mt-2 line-clamp-1 font-sans text-sm text-text-muted">
                  {last?.senderName}: {last?.body}
                </p>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
