import Link from "next/link";
import { auth } from "@/auth";
import { EmptyState } from "@/components/ui/empty-state";
import { getAssignmentsForUser } from "@/lib/portal/assessor-data";
import { getMessagesForApplicationByReference } from "@/lib/portal/applicant-data";

export default async function AssessorMessagesIndexPage() {
  const session = await auth();
  const myAssignments = await getAssignmentsForUser(session!.user.id);
  const threads = (
    await Promise.all(
      myAssignments
        .filter((a) => a.linkedApplicationId)
        .map(async (a) => ({ assignment: a, messages: await getMessagesForApplicationByReference(a.linkedApplicationId!) })),
    )
  ).filter((t) => t.messages.length > 0);

  return (
    <div className="px-6 py-8">
      <h1 className="font-display text-2xl font-semibold text-text">Messages</h1>
      <div className="mt-6 flex flex-col gap-3">
        {threads.length === 0 ? (
          <EmptyState title="No messages yet." />
        ) : (
          threads.map(({ assignment, messages }) => {
            const last = messages[messages.length - 1];
            return (
              <Link
                key={assignment.id}
                href={`/assessor/assignments/${assignment.id}`}
                className="rounded-lg border border-border bg-surface p-4 hover:border-secondary"
              >
                <div className="flex items-center justify-between">
                  <p className="font-sans text-sm font-semibold text-text">{assignment.organisationName}</p>
                  <span className="font-mono text-xs text-text-muted">{last?.createdAt}</span>
                </div>
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
