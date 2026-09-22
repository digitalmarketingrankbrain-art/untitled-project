import { redirect } from "next/navigation";
import { auth } from "@/auth";

const ROLE_HOME: Record<string, string> = {
  APPLICANT: "/cab/applicant",
  ASSESSOR: "/assessor",
  ADMIN: "/admin/dashboard",
};

export default async function PortalIndexPage() {
  const session = await auth();
  redirect(session?.user ? (ROLE_HOME[session.user.role] ?? "/login") : "/login");
}
