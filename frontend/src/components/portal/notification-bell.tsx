"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { getNotificationCopy } from "@/lib/notification-copy";
import { markMyNotificationRead, markAllMyNotificationsRead } from "@/lib/notifications-actions";

export interface NotificationRow {
  id: string;
  type: string;
  sentAt: string | null;
  readAt: string | null;
}

function NotificationBell({
  initialNotifications,
  initialUnreadCount,
}: {
  initialNotifications: NotificationRow[];
  initialUnreadCount: number;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleMarkRead(id: string) {
    await markMyNotificationRead(id);
    router.refresh();
  }

  async function handleMarkAllRead() {
    await markAllMyNotificationsRead();
    router.refresh();
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
        className="relative rounded-[6px] p-2 text-text-muted hover:bg-background hover:text-text"
      >
        <Bell className="size-5" strokeWidth={1.75} />
        {initialUnreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-error-text font-mono text-[10px] text-text-inverse">
            {initialUnreadCount > 9 ? "9+" : initialUnreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border border-border bg-surface shadow-[0_8px_24px_rgba(13,43,32,0.12)]">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="font-sans text-sm font-semibold text-text">Notifications</p>
            {initialUnreadCount > 0 && (
              <button onClick={handleMarkAllRead} className="font-sans text-xs text-secondary hover:underline">
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {initialNotifications.length === 0 ? (
              <p className="px-4 py-6 text-center font-sans text-sm text-text-muted">No notifications yet.</p>
            ) : (
              initialNotifications.map((n) => {
                const copy = getNotificationCopy(n.type);
                const isUnread = !n.readAt;
                return (
                  <button
                    key={n.id}
                    onClick={() => isUnread && handleMarkRead(n.id)}
                    className={cn(
                      "block w-full border-b border-border px-4 py-3 text-left last:border-b-0 hover:bg-background-portal",
                      isUnread && "bg-info-surface",
                    )}
                  >
                    <p className="font-sans text-sm font-medium text-text">{copy.title}</p>
                    {copy.body && <p className="mt-0.5 font-sans text-xs text-text-muted">{copy.body}</p>}
                    {n.sentAt && (
                      <p className="mt-1 font-mono text-[11px] text-text-muted">
                        {new Date(n.sentAt).toISOString().slice(0, 16).replace("T", " ")}
                      </p>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export { NotificationBell };
