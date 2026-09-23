import { auth } from "@/auth";
import { findUserById } from "@/lib/auth/store";
import { AssessorProfileForm } from "@/components/portal/assessor-profile-form";

export default async function AssessorProfilePage() {
  const session = await auth();
  const user = await findUserById(session!.user.id);
  return <div className="max-w-md px-6 py-8">
    <h1 className="font-display text-2xl font-semibold text-text">Profile</h1>
    <AssessorProfileForm name={user?.name ?? ""} email={user?.email ?? ""} />
  </div>;
}
