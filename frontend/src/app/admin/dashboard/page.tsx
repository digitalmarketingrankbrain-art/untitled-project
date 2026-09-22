import Link from "next/link";
import {
  ArrowRight,
  Inbox,
  ClipboardCheck,
  FileCheck,
  AlertTriangle,
  Users,
  FileClock,
  ShieldAlert,
  Receipt,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { auth } from "@/auth";
import { StatusBadge, VERIFICATION_STATUS } from "@/components/ui/status-badge";
import { getAllApplications, getAllInvoices, STAGE_LABEL } from "@/lib/portal/applicant-data";
import { getAllAssignments } from "@/lib/portal/assessor-data";
import { getAllProposalsForAdmin } from "@/lib/portal/assessor-team-data";
import { getAllNonConformitiesForAdmin } from "@/lib/portal/nc-data";
import { listAccreditationRecords } from "@/lib/portal/accreditation-record-data";
import { listApplicationRequests } from "@/lib/portal/application-requests-data";
import { getUserOrgName } from "@/lib/portal/admin-data";
import { getAuditLog } from "@/lib/portal/audit-log";
import { getBackendHealth } from "@/lib/backend-client";
import type { VerificationStatus } from "@/lib/verification-records";

type Tone = "warning" | "error" | "info";

interface QueueItem {
  key: string;
  icon: LucideIcon;
  title: string;
  description: string;
  count: number;
  tone: Tone;
  /** Where the whole queue is worked. Omitted when there is no page for it yet. */
  href?: string;
  cta?: string;
  /** The first few items, each linking straight to its own page. */
  preview?: { href: string; primary: string; secondary: string }[];
}

const TONE_CLASSES: Record<Tone, { pill: string; tile: string }> = {
  warning: { pill: "bg-warning-surface text-warning-text", tile: "bg-warning-surface text-warning-text" },
  error: { pill: "bg-error-surface text-error-text", tile: "bg-error-surface text-error-text" },
  info: { pill: "bg-info-surface text-info-text", tile: "bg-info-surface text-info-text" },
};

const LINK_FOCUS = "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1";

const REGISTER_ORDER: VerificationStatus[] = ["ACTIVE", "SUSPENDED", "WITHDRAWN", "CANCELLED", "EXPIRED"];

const DAY_MS = 24 * 60 * 60 * 1000;

function greeting(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

/** "application_request.approved" -> "Application request approved" */
function describeAction(action: string): string {
  const text = action.replace(/[._]/g, " ").trim();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function daysUntil(isoDate: string, now: number): number {
  return Math.ceil((new Date(isoDate).getTime() - now) / DAY_MS);
}

export default async function AdminDashboardPage() {
  const nowDate = new Date();
  const now = nowDate.getTime();
  const today = nowDate.toISOString().slice(0, 10);
  const renewalCutoff = new Date(nowDate);
  renewalCutoff.setMonth(renewalCutoff.getMonth() + 6);
  const renewalCutoffDate = renewalCutoff.toISOString().slice(0, 10);

  const [session, applications, invoices, allAssignments, teamProposals, nonConformities, records, pendingRequests, auditLog, backendHealth] =
    await Promise.all([
      auth(),
      getAllApplications(),
      getAllInvoices(),
      getAllAssignments(),
      getAllProposalsForAdmin(),
      getAllNonConformitiesForAdmin(),
      listAccreditationRecords(),
      listApplicationRequests("PENDING"),
      getAuditLog(),
      getBackendHealth(),
    ]);

  const awaitingAction = applications
    .filter((a) => a.stage !== "ACCREDITED" && a.stage !== "DECLINED" && a.stage !== "DRAFT")
    .sort((a, b) => a.updatedAt.localeCompare(b.updatedAt));
  const overdueAssessments = allAssignments.filter(
    (a) => (a.status === "IN_PROGRESS" || a.status === "ACCEPTED") && a.dueDate < today,
  );
  const decisionsPending = allAssignments.filter((a) => a.status === "REPORT_SUBMITTED");
  const reportsAwaitingReview = allAssignments.filter(
    (a) => a.reportStatus === "SUBMITTED" || a.reportStatus === "UNDER_REVIEW",
  );
  const ncsAwaitingReview = nonConformities.filter(
    (n) => n.status === "RESPONSE_SUBMITTED" || n.status === "UNDER_REVIEW",
  );
  const pendingTeamProposals = teamProposals.filter((p) => p.status === "SUBMITTED");
  const overdueInvoices = invoices.filter((i) => i.status === "ISSUED" && i.dueAt < today);

  const applicationPreview = awaitingAction.slice(0, 3);
  const applicationOrgNames = await Promise.all(applicationPreview.map((a) => getUserOrgName(a.applicantUserId)));

  const renewals = records
    .filter((r) => r.status === "ACTIVE" && r.expiryDate && r.expiryDate <= renewalCutoffDate)
    .sort((a, b) => (a.expiryDate ?? "").localeCompare(b.expiryDate ?? ""));

  const registerCounts = REGISTER_ORDER.map((status) => ({
    status,
    count: records.filter((r) => r.status === status).length,
  }));

  const recentActivity = [...auditLog].sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, 6);

  // Ordered by how soon an admin should act: new intake first, then decisions, then follow-ups.
  const queue: QueueItem[] = [
    {
      key: "requests",
      icon: Inbox,
      title: "Application requests",
      description: "Organisations asking to become a certification body. Approve to create their account, or reject with a reason.",
      count: pendingRequests.length,
      tone: "warning",
      href: "/admin/application-requests",
      cta: "Review requests",
      preview: pendingRequests.slice(0, 3).map((r) => ({
        href: `/admin/application-requests/${r.id}`,
        primary: r.companyName,
        secondary: `${r.contactName} · ${r.createdAt.slice(0, 10)}`,
      })),
    },
    {
      key: "decisions",
      icon: ClipboardCheck,
      title: "Decisions pending",
      description: "Assessment reports are in and waiting for a recorded accreditation decision.",
      count: decisionsPending.length,
      tone: "warning",
      href: "/admin/assessments",
      cta: "Open assessments",
    },
    {
      key: "reports",
      icon: FileCheck,
      title: "Assessment reports to review",
      description: "Reports submitted by assessors that need your review.",
      count: reportsAwaitingReview.length,
      tone: "info",
      href: "/admin/assessments",
      cta: "Review reports",
    },
    {
      key: "ncs",
      icon: AlertTriangle,
      title: "Non-conformities to review",
      description: "Responses from certification bodies awaiting your review.",
      count: ncsAwaitingReview.length,
      tone: "info",
      href: "/admin/non-conformities",
      cta: "Review non-conformities",
    },
    {
      key: "proposals",
      icon: Users,
      title: "Assessor team proposals",
      description: "Proposed assessor teams waiting for approval.",
      count: pendingTeamProposals.length,
      tone: "info",
      href: "/admin/assessor-teams",
      cta: "Review proposals",
    },
    {
      key: "applications",
      icon: FileClock,
      title: "Applications in progress",
      description: "Open accreditation applications, oldest activity first.",
      count: awaitingAction.length,
      tone: "info",
      href: "/admin/applications",
      cta: "Open applications",
      preview: applicationPreview.map((a, i) => ({
        href: `/admin/applications/${a.id}`,
        primary: applicationOrgNames[i] ? `${applicationOrgNames[i]} · ${a.programName}` : a.programName,
        secondary: `${a.referenceNumber} · ${STAGE_LABEL[a.stage]}`,
      })),
    },
    {
      key: "overdue-assessments",
      icon: ShieldAlert,
      title: "Assessments overdue",
      description: "Past the due date and not yet reported.",
      count: overdueAssessments.length,
      tone: "error",
      href: "/admin/assessments",
      cta: "Open assessments",
      preview: overdueAssessments.slice(0, 3).map((a) => ({
        href: `/admin/assessments/${a.id}`,
        primary: `${a.organisationName} · ${a.programName}`,
        secondary: `Due ${a.dueDate}`,
      })),
    },
    {
      key: "overdue-payments",
      icon: Receipt,
      title: "Payments overdue",
      description: "Issued invoices past their due date. Follow up with the organisation.",
      count: overdueInvoices.length,
      tone: "error",
    },
  ];

  const active = queue.filter((q) => q.count > 0);
  const clear = queue.filter((q) => q.count === 0);
  const firstName = session?.user?.name?.split(" ")[0];
  const dateLabel = nowDate.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const totalOverdue = overdueAssessments.length + overdueInvoices.length;

  return (
    <div className="px-6 py-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-r from-white via-slate-50/50 to-blue-50/30 p-6 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-slate-900 tracking-tight">
              {greeting(nowDate.getHours())}
              {firstName ? `, ${firstName}` : ""}
            </h1>
            <span className="inline-flex items-center rounded-full bg-blue-100/60 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
              Admin
            </span>
          </div>
          <p className="mt-1 font-sans text-sm text-slate-500">
            {dateLabel} ·{" "}
            {active.length === 0
              ? "You're all caught up."
              : `${active.length} ${active.length === 1 ? "area needs" : "areas need"} your immediate action.`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs" title={backendHealth.ok ? undefined : backendHealth.error}>
            <StatusBadge
              tone={backendHealth.ok ? "success" : "error"}
              label={backendHealth.ok ? "Backend Online" : "Backend Offline"}
              size="sm"
            />
            {backendHealth.ok && <span className="font-mono text-xs text-slate-500">{backendHealth.latencyMs} ms</span>}
          </div>
        </div>
      </div>

      {/* Top Quick Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/admin/application-requests"
          className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs hover:shadow-md hover:border-amber-200 transition-all duration-200 hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Application Requests</span>
            <span className="flex size-9 items-center justify-center rounded-xl bg-amber-50 text-amber-700 transition-transform group-hover:scale-110">
              <Inbox className="size-4.5" strokeWidth={2} />
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="font-mono text-3xl font-bold text-slate-900">{pendingRequests.length}</span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 group-hover:translate-x-0.5 transition-transform">
              Review <ArrowRight className="size-3" />
            </span>
          </div>
        </Link>

        <Link
          href="/admin/assessments"
          className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs hover:shadow-md hover:border-blue-200 transition-all duration-200 hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Decisions Needed</span>
            <span className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700 transition-transform group-hover:scale-110">
              <ClipboardCheck className="size-4.5" strokeWidth={2} />
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="font-mono text-3xl font-bold text-slate-900">{decisionsPending.length}</span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 group-hover:translate-x-0.5 transition-transform">
              Open <ArrowRight className="size-3" />
            </span>
          </div>
        </Link>

        <Link
          href="/admin/applications"
          className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs hover:shadow-md hover:border-indigo-200 transition-all duration-200 hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">In Progress</span>
            <span className="flex size-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 transition-transform group-hover:scale-110">
              <FileClock className="size-4.5" strokeWidth={2} />
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="font-mono text-3xl font-bold text-slate-900">{awaitingAction.length}</span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-700 group-hover:translate-x-0.5 transition-transform">
              View <ArrowRight className="size-3" />
            </span>
          </div>
        </Link>

        <Link
          href="/admin/assessments"
          className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs hover:shadow-md hover:border-red-200 transition-all duration-200 hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Overdue Items</span>
            <span className="flex size-9 items-center justify-center rounded-xl bg-red-50 text-red-700 transition-transform group-hover:scale-110">
              <ShieldAlert className="size-4.5" strokeWidth={2} />
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="font-mono text-3xl font-bold text-slate-900">{totalOverdue}</span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700 group-hover:translate-x-0.5 transition-transform">
              Action <ArrowRight className="size-3" />
            </span>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 xl:grid-cols-[minmax(0,1fr)_22rem]">
        {/* Work queue */}
        <section aria-labelledby="queue-heading" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 id="queue-heading" className="font-sans text-base font-bold text-slate-900 tracking-tight">
              Action Required Queue
            </h2>
            <span className="text-xs font-semibold text-slate-500 font-mono">
              {active.length} active {active.length === 1 ? "task" : "tasks"}
            </span>
          </div>

          {active.length === 0 ? (
            <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="size-5 shrink-0" strokeWidth={2} aria-hidden />
              </div>
              <div>
                <p className="font-sans text-sm font-semibold text-slate-900">All clear!</p>
                <p className="font-sans text-xs text-slate-500">Nothing is waiting on your review right now.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              {active.map((item) => {
                const Icon = item.icon;
                const tone = TONE_CLASSES[item.tone];
                return (
                  <div
                    key={item.key}
                    className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs hover:shadow-md hover:border-slate-300/90 transition-all duration-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex items-start gap-3.5 min-w-0">
                        <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${tone.tile} transition-transform group-hover:scale-105`}>
                          <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                        </span>

                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-sans text-sm font-bold text-slate-900">{item.title}</h3>
                            <span className={`rounded-full px-2.5 py-0.5 font-mono text-xs font-bold ${tone.pill}`}>{item.count}</span>
                          </div>
                          <p className="font-sans text-xs text-slate-500 leading-relaxed">{item.description}</p>

                          {item.preview && item.preview.length > 0 && (
                            <div className="pt-2">
                              <ul className="flex flex-col gap-1.5 border-t border-slate-100 pt-2.5">
                                {item.preview.map((p) => (
                                  <li key={p.href} className="min-w-0">
                                    <Link
                                      href={p.href}
                                      className={`group/link flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-0.5 rounded-lg px-2.5 py-1.5 transition-colors hover:bg-slate-50 ${LINK_FOCUS}`}
                                    >
                                      <span className="break-words font-sans text-xs font-semibold text-slate-800 group-hover/link:text-blue-700">
                                        {p.primary}
                                      </span>
                                      <span className="truncate font-mono text-[11px] text-slate-400">{p.secondary}</span>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>

                      {item.href && (
                        <Link
                          href={item.href}
                          className={`inline-flex items-center gap-1.5 shrink-0 self-start rounded-xl bg-slate-50 px-3.5 py-2 font-sans text-xs font-semibold text-blue-700 hover:bg-blue-50 hover:text-blue-800 transition-colors ${LINK_FOCUS}`}
                        >
                          {item.cta}
                          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" strokeWidth={2} aria-hidden />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {clear.length > 0 && active.length > 0 && (
            <p className="flex items-center gap-2 font-sans text-xs text-slate-400 px-1">
              <CheckCircle2 className="size-3.5 shrink-0 text-emerald-600" strokeWidth={2} aria-hidden />
              <span>All clear: {clear.map((c) => c.title.toLowerCase()).join(", ")}.</span>
            </p>
          )}
        </section>

        {/* Register, renewals, activity */}
        <aside className="space-y-5">
          {/* Accreditation register */}
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-4" aria-labelledby="register-heading">
            <div className="flex items-center justify-between">
              <h2 id="register-heading" className="font-sans text-sm font-bold text-slate-900">
                Accreditation Register
              </h2>
              <Link href="/admin/accreditation-records" className={`font-sans text-xs font-semibold text-blue-700 hover:underline ${LINK_FOCUS}`}>
                View all
              </Link>
            </div>
            {records.length === 0 ? (
              <p className="font-sans text-xs text-slate-500">No accreditation records yet. They appear once an application is accredited.</p>
            ) : (
              <ul className="flex flex-col gap-2.5">
                {registerCounts.map(({ status, count }) => (
                  <li key={status} className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                    <StatusBadge tone={VERIFICATION_STATUS[status].tone} label={VERIFICATION_STATUS[status].label} size="sm" />
                    <span className={`font-mono text-xs ${count === 0 ? "text-slate-400" : "font-bold text-slate-800"}`}>{count}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Renewals */}
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-4" aria-labelledby="renewals-heading">
            <h2 id="renewals-heading" className="font-sans text-sm font-bold text-slate-900">
              Renewals (Next 6 Months)
            </h2>
            {renewals.length === 0 ? (
              <p className="font-sans text-xs text-slate-500">No accreditations expire in this window.</p>
            ) : (
              <ul className="flex flex-col gap-2.5">
                {renewals.map((r) => {
                  const days = daysUntil(r.expiryDate!, now);
                  return (
                    <li key={r.reference}>
                      <Link href={`/admin/accreditation-records/${r.reference}`} className={`group block p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors ${LINK_FOCUS}`}>
                        <span className="block truncate font-sans text-xs font-semibold text-slate-800 group-hover:text-blue-700">{r.organisationName}</span>
                        <div className="mt-1 flex items-center justify-between font-mono text-[11px] text-slate-400">
                          <span>{r.expiryDate}</span>
                          <span className={days <= 30 ? "text-amber-700 font-bold" : ""}>
                            {days <= 0 ? "expired" : `in ${days} ${days === 1 ? "day" : "days"}`}
                          </span>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* Activity */}
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-4" aria-labelledby="activity-heading">
            <div className="flex items-center justify-between">
              <h2 id="activity-heading" className="font-sans text-sm font-bold text-slate-900">
                Recent Audit Trail
              </h2>
              <Link href="/admin/audit-logs" className={`font-sans text-xs font-semibold text-blue-700 hover:underline ${LINK_FOCUS}`}>
                Audit log
              </Link>
            </div>
            {recentActivity.length === 0 ? (
              <p className="font-sans text-xs text-slate-500">No activity recorded yet.</p>
            ) : (
              <ul className="flex flex-col gap-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 pl-4">
                {recentActivity.map((e) => (
                  <li key={e.id} className="relative space-y-0.5">
                    <span className="absolute -left-[1.35rem] top-1.5 size-2 rounded-full bg-blue-600 ring-4 ring-white" />
                    <p className="font-sans text-xs font-semibold text-slate-800">{describeAction(e.action)}</p>
                    <p className="font-mono text-[11px] text-slate-400">
                      {e.actorName} · {e.timestamp.slice(0, 16).replace("T", " ")}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
