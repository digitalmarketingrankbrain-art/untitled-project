import { redirect } from "next/navigation";

/**
 * Backwards-compatible admin sign-in URL.
 * The dedicated admin login lives at /admin, but older links used /login/admin.
 */
export default function AdminLoginAliasPage() {
  redirect("/admin");
}
