"use client";

import {
  LayoutDashboard,
  FileText,
  Receipt,
  ShieldCheck,
  MessageSquare,
  User,
  Lock,
  ClipboardPlus,
} from "lucide-react";
import { PortalSidebar } from "./portal-sidebar";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/cab/applicant/dashboard", icon: LayoutDashboard },
  { label: "Profile", href: "/cab/applicant/profile", icon: User },
  { label: "Applications", href: "/cab/applicant/applications", icon: FileText },
  { label: "Scope Extension", href: "/cab/applicant/apply/scope-extension", icon: ClipboardPlus },
  { label: "Invoices", href: "/cab/applicant/invoices", icon: Receipt },
  { label: "Accreditation", href: "/cab/applicant/accreditation", icon: ShieldCheck },
  { label: "Messages", href: "/cab/applicant/messages", icon: MessageSquare },
  { label: "Security", href: "/cab/applicant/security", icon: Lock },
];

/**
 * Icon components (lucide-react) can't cross the server/client boundary as
 * props (they're functions, not serializable RSC payloads) — so this nav
 * list is defined here, inside a client component, rather than in the
 * server layout that renders it (Milestone 5 hit the same class of bug with
 * DataTable column render functions; same fix shape applies here).
 */
function ApplicantSidebar() {
  return <PortalSidebar items={NAV_ITEMS} />;
}

export { ApplicantSidebar };
