"use client";

import { LayoutDashboard, ClipboardList, User, CalendarOff, MessageSquare } from "lucide-react";
import { PortalSidebar } from "./portal-sidebar";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/assessor/dashboard", icon: LayoutDashboard },
  { label: "Assignments", href: "/assessor/assignments", icon: ClipboardList },
  { label: "Competence", href: "/assessor/competence", icon: User },
  { label: "Availability", href: "/assessor/availability", icon: CalendarOff },
  { label: "Messages", href: "/assessor/messages", icon: MessageSquare },
];

function AssessorSidebar() {
  return <PortalSidebar items={NAV_ITEMS} />;
}

export { AssessorSidebar };
