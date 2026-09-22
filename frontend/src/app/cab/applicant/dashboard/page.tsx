import Link from "next/link";
import {
  AlertCircle,
  FileText,
  Clock,
  FolderOpen,
  MessageSquare,
  Receipt,
  ShieldCheck,
} from "lucide-react";
import { auth } from "@/auth";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { STAGE_LABEL } from "@/lib/portal/applicant-data";
import { getApplicationsForUser, getInvoicesForUser } from "@/lib/portal/applicant-data";
import { getCertificationSummary } from "@/lib/portal/cb-dashboard-data";
import { getNonConformitiesForUser } from "@/lib/portal/nc-data";
import { getAssessmentsForUser } from "@/lib/portal/cb-assessments-data";
import { getProposalForApplication } from "@/lib/portal/assessor-team-data";
import { getNotificationsForUserOrg } from "@/lib/portal/assessment-notification-data";

export default async function ApplicantDashboardPage() {
  const session = await auth();
  const userId = session!.user.id;
  const [apps, userInvoices, certSummary, nonConformities, assessments, assessmentNotifications] = await Promise.all([
    getApplicationsForUser(userId),
    getInvoicesForUser(userId),
    getCertificationSummary(userId),
    getNonConformitiesForUser(userId),
    getAssessmentsForUser(userId),
    getNotificationsForUserOrg(userId),
  ]);
  const openNcs = nonConformities.filter((n) => n.status !== "CLOSED");
  const upcomingAssessments = assessments.filter((a) => a.status === "SCHEDULED" || a.status === "IN_PROGRESS");
  const unacknowledgedNotifications = assessmentNotifications.filter((n) => n.status !== "ACKNOWLEDGED");

  const teamProposals = await Promise.all(
    apps.map(async (a) => ({ app: a, proposal: await getProposalForApplication(a.id, userId) })),
  );
  const teamActionsNeeded = teamProposals.filter(
    ({ proposal }) => proposal && (proposal.status === "DRAFT" || proposal.status === "CHANGES_REQUESTED"),
  );

  const requiredActions = [
    ...teamActionsNeeded.map(({ app, proposal }) => ({
      text:
        proposal!.status === "CHANGES_REQUESTED"
          ? `${app.referenceNumber}: assessor team changes requested`
          : `${app.referenceNumber}: propose an assessment team`,
      href: `/cab/applicant/applications/${app.id}?tab=assessor-team`,
    })),
    ...unacknowledgedNotifications.map((n) => ({
      text: `Assessment notification for ${n.applicationReference} needs your signature`,
      href: `/cab/applicant/profile/assessments`,
    })),
    ...apps
      .filter((a) => a.infoRequested)
      .map((a) => ({
        text: `${a.programName} (${a.referenceNumber}): information requested`,
        href: `/cab/applicant/applications/${a.id}`,
      })),
    ...userInvoices
      .filter((i) => i.status === "ISSUED" || i.status === "OVERDUE")
      .map((i) => ({
        text: `Invoice ${i.invoiceNumber} is due ${i.dueAt}`,
        href: `/cab/applicant/invoices/${i.id}`,
      })),
    ...openNcs.map((n) => ({
      text: `NC ${n.ncNumber} (${n.standardReference}) is still open`,
      href: `/cab/applicant/profile/nc/${n.id}`,
    })),
  ];

  if (apps.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <FileText className="mx-auto size-8 text-text-muted" strokeWidth={1.5} />
        <h1 className="mt-3 font-display text-2xl font-semibold text-text">
          Start your first application
        </h1>
        <p className="mt-2 font-sans text-sm text-text-muted">
          You don&apos;t have any applications yet. Browse our accreditation
          programs to find the right scope and get started.
        </p>
        <Link href="/accreditation/programs" className="mt-6 inline-block">
          <Button variant="primary">Browse Programs</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Welcome Hero Banner */}
      <div className="cab-gradient-hero rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-blue-800/40 relative">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md border border-white/15 text-blue-100">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              Conformity Assessment Body Portal
            </div>
            <h1 className="mt-3 font-display text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome back, {session?.user?.name || "Partner"}
            </h1>
            <p className="mt-1 text-sm text-blue-100 max-w-2xl leading-relaxed">
              Manage your accreditation status, submitted applications, upcoming assessments, and non-conformity resolutions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/cab/applicant/apply/scope-extension"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-blue-900 hover:bg-blue-50 transition-all shadow-md active:scale-95"
            >
              <FileText className="size-4 text-blue-700" /> Apply Scope Extension
            </Link>
            <Link
              href="/cab/applicant/profile?tab=overview"
              className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-white/25 transition-all border border-white/20 backdrop-blur-md"
            >
              View CAB Profile →
            </Link>
          </div>
        </div>
      </div>

      {/* Action Required Alerts */}
      {requiredActions.length > 0 ? (
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Action Items ({requiredActions.length})
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {requiredActions.map((action, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl border border-amber-200/90 bg-amber-50/70 p-4 text-amber-900 shadow-xs transition-all hover:bg-amber-50">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                    <AlertCircle className="size-5" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold">{action.text}</span>
                </div>
                <Link
                  href={action.href}
                  className="shrink-0 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-700 transition-all shadow-xs"
                >
                  Resolve →
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200/80 bg-emerald-50/60 p-4 text-xs sm:text-sm font-medium text-emerald-800">
          <ShieldCheck className="size-5 text-emerald-600" />
          <span>All system requirements are up-to-date. No pending actions required.</span>
        </div>
      )}

      {/* KPI Stat Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card interactive variant="glass">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Applications
            </CardTitle>
            <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
              <FileText className="size-4.5" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-2xl font-bold font-mono text-slate-900">{apps.length}</div>
            <div className="mt-2 space-y-1">
              {apps.slice(0, 2).map((a) => (
                <div key={a.id} className="flex items-center justify-between text-xs text-slate-600">
                  <span className="font-mono font-medium">{a.referenceNumber}</span>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700 font-semibold">{STAGE_LABEL[a.stage]}</span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="pt-3 border-t border-slate-100">
            <Link href="/cab/applicant/applications" className="text-xs font-bold text-blue-700 hover:text-blue-900 hover:underline flex items-center justify-between w-full">
              <span>View all applications</span>
              <span>→</span>
            </Link>
          </CardFooter>
        </Card>

        <Card interactive variant="glass">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Upcoming Deadlines
            </CardTitle>
            <div className="flex size-9 items-center justify-center rounded-xl bg-amber-50 text-amber-700 border border-amber-100">
              <Clock className="size-4.5" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            {userInvoices.filter((i) => i.status === "ISSUED").length === 0 ? (
              <p className="text-xs text-slate-500 py-3 font-medium">No pending invoice deadlines.</p>
            ) : (
              <div className="space-y-1">
                {userInvoices
                  .filter((i) => i.status === "ISSUED")
                  .map((i) => (
                    <div key={i.id} className="flex items-center justify-between text-xs">
                      <span className="font-mono text-slate-700">{i.invoiceNumber}</span>
                      <span className="font-mono text-amber-700 font-semibold">Due {i.dueAt}</span>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-3 border-t border-slate-100">
            <Link href="/cab/applicant/invoices" className="text-xs font-bold text-amber-700 hover:text-amber-900 hover:underline flex items-center justify-between w-full">
              <span>View financial ledger</span>
              <span>→</span>
            </Link>
          </CardFooter>
        </Card>

        <Card interactive variant="glass">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Document Vault
            </CardTitle>
            <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100">
              <FolderOpen className="size-4.5" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-2xl font-bold font-mono text-slate-900">
              {apps.flatMap((a) => a.documents).length}
            </div>
            <p className="mt-1 text-xs text-slate-500 font-medium">
              {apps.flatMap((a) => a.documents).filter((d) => d.status === "NEEDS_REVISION").length > 0 ? (
                <span className="text-rose-600 font-semibold">
                  {apps.flatMap((a) => a.documents).filter((d) => d.status === "NEEDS_REVISION").length} file(s) require revision
                </span>
              ) : (
                "All uploaded documents verified"
              )}
            </p>
          </CardContent>
          <CardFooter className="pt-3 border-t border-slate-100">
            <Link href="/cab/applicant/profile?tab=documents" className="text-xs font-bold text-indigo-700 hover:text-indigo-900 hover:underline flex items-center justify-between w-full">
              <span>Open Document Library</span>
              <span>→</span>
            </Link>
          </CardFooter>
        </Card>

        <Card interactive variant="glass">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Case Messages
            </CardTitle>
            <div className="flex size-9 items-center justify-center rounded-xl bg-purple-50 text-purple-700 border border-purple-100">
              <MessageSquare className="size-4.5" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Direct secure messaging threads tied to active accreditation applications.
            </p>
          </CardContent>
          <CardFooter className="pt-3 border-t border-slate-100">
            <Link href="/cab/applicant/messages" className="text-xs font-bold text-purple-700 hover:text-purple-900 hover:underline flex items-center justify-between w-full">
              <span>View message inbox</span>
              <span>→</span>
            </Link>
          </CardFooter>
        </Card>

        <Card interactive variant="glass">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Assessments
            </CardTitle>
            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
              <ShieldCheck className="size-4.5" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-2xl font-bold font-mono text-slate-900">
              {upcomingAssessments.length}
            </div>
            <p className="mt-1 text-xs text-slate-500 font-medium">
              {upcomingAssessments.length === 0 ? "No active audit scheduled." : `${upcomingAssessments.length} scheduled or in progress`}
            </p>
          </CardContent>
          <CardFooter className="pt-3 border-t border-slate-100">
            <Link href="/cab/applicant/profile?tab=assessments" className="text-xs font-bold text-emerald-700 hover:text-emerald-900 hover:underline flex items-center justify-between w-full">
              <span>Assessment schedules</span>
              <span>→</span>
            </Link>
          </CardFooter>
        </Card>

        <Card interactive variant="glass">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Payments & Invoices
            </CardTitle>
            <div className="flex size-9 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-100">
              <Receipt className="size-4.5" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-2xl font-bold font-mono text-slate-900">
              ${userInvoices.filter((i) => i.status === "ISSUED").reduce((s, i) => s + i.amount, 0).toLocaleString()}
            </div>
            <p className="mt-1 text-xs text-slate-500 font-medium">
              {userInvoices.filter((i) => i.status === "ISSUED").reduce((s, i) => s + i.amount, 0) > 0
                ? "Pending outstanding balance"
                : "All invoices settled"}
            </p>
          </CardContent>
          <CardFooter className="pt-3 border-t border-slate-100">
            <Link href="/cab/applicant/invoices" className="text-xs font-bold text-cyan-700 hover:text-cyan-900 hover:underline flex items-center justify-between w-full">
              <span>View invoices</span>
              <span>→</span>
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/* Certification Breakdown Section */}
      {certSummary.total > 0 && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900">Certification Portfolio</h2>
              <p className="text-xs text-slate-500">Summary of active, suspended, and expiring certificates across all scopes.</p>
            </div>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-200/60">
              Total Scope Count: {certSummary.total}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {[
              { label: "Total", value: certSummary.total, tone: "text-slate-900 bg-slate-50 border-slate-200" },
              { label: "Active", value: certSummary.active, tone: "text-emerald-700 bg-emerald-50/70 border-emerald-200" },
              { label: "Suspended", value: certSummary.suspended, tone: "text-amber-700 bg-amber-50/70 border-amber-200" },
              { label: "Withdrawn", value: certSummary.withdrawn, tone: "text-rose-700 bg-rose-50/70 border-rose-200" },
              { label: "Expired", value: certSummary.expired, tone: "text-slate-600 bg-slate-100 border-slate-200" },
            ].map((s) => (
              <div key={s.label} className={`rounded-xl border ${s.tone} p-3.5 text-center transition-all hover:scale-105`}>
                <p className="font-mono text-2xl font-bold">{s.value}</p>
                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <div className="border-b border-slate-200 bg-slate-50/80 px-4 py-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Certificate Breakdown by Program</h3>
              </div>
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/40 font-semibold text-slate-500">
                    <th className="px-4 py-2.5 text-left">Program Standard</th>
                    <th className="px-4 py-2.5 text-right">Active</th>
                    <th className="px-4 py-2.5 text-right">Suspended</th>
                    <th className="px-4 py-2.5 text-right">Withdrawn</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {certSummary.byProgram.map((p) => (
                    <tr key={p.programName} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-2.5 font-medium text-slate-900">{p.programName}</td>
                      <td className="px-4 py-2.5 text-right font-mono font-semibold text-emerald-700">{p.active}</td>
                      <td className="px-4 py-2.5 text-right font-mono font-semibold text-amber-700">{p.suspended}</td>
                      <td className="px-4 py-2.5 text-right font-mono font-semibold text-rose-700">{p.withdrawn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200">
              <div className="border-b border-slate-200 bg-slate-50/80 px-4 py-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Expiring Certificates (Next 6 Months)</h3>
              </div>
              {certSummary.expiringSoon.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 font-medium">
                  No certificates scheduled for expiration within 6 months.
                </div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {certSummary.expiringSoon.map((c) => (
                    <li key={c.accreditationNumber} className="flex items-center justify-between px-4 py-3 hover:bg-slate-50/60 transition-colors">
                      <div>
                        <p className="text-xs font-bold text-slate-900">{c.programName}</p>
                        <p className="text-[11px] font-mono text-slate-500">{c.accreditationNumber}</p>
                      </div>
                      <span className="rounded-md bg-amber-50 px-2.5 py-1 font-mono text-xs font-bold text-amber-700 border border-amber-200">
                        Expires {c.expiryDate}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
