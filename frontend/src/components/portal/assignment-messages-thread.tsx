"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Message } from "@/lib/portal/applicant-data";
import { sendAssignmentMessage } from "@/lib/portal/assessor-actions";

function AssignmentMessagesThread({ assignmentId, messages }: { assignmentId: string; messages: Message[] }) {
  const router = useRouter();
  const [body, setBody] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setSending(true);
    const result = await sendAssignmentMessage(assignmentId, body);
    setSending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    setBody("");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        {messages.length === 0 && (
          <p className="font-sans text-sm text-text-muted">No messages yet for this assignment.</p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "max-w-md rounded-lg px-4 py-3",
              m.senderRole === "ASSESSOR" ? "self-end bg-primary text-text-inverse" : "bg-background-portal text-text",
            )}
          >
            <p className="font-sans text-xs opacity-70">{m.senderName} · {m.createdAt}</p>
            <p className="mt-1 font-sans text-sm">{m.body}</p>
          </div>
        ))}
      </div>
      {error && <p className="font-sans text-xs text-error-text">{error}</p>}
      <form onSubmit={handleSend} className="flex gap-2">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={2}
          placeholder="Write a message…"
          className="flex-1 rounded-[6px] border border-border bg-surface px-3 py-2 font-sans text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
        />
        <Button type="submit" variant="primary" disabled={!body.trim()} loading={sending}>
          Send
        </Button>
      </form>
    </div>
  );
}

export { AssignmentMessagesThread };
