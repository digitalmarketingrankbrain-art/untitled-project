import { auth } from "@/auth";
import { AvailabilityManager } from "@/components/portal/availability-manager";
import { getBlackoutsForUser } from "@/lib/portal/assessor-data";

export default async function AvailabilityPage() {
  const session = await auth();
  const blackouts = await getBlackoutsForUser(session!.user.id);

  return (
    <div className="px-6 py-8">
      <h1 className="font-display text-2xl font-semibold text-text">Availability</h1>
      <p className="mt-1 max-w-lg font-sans text-sm text-text-muted">
        Mark periods you&apos;re unavailable. Admin reads this when proposing assignments but can&apos;t edit it.
      </p>
      <div className="mt-6 max-w-2xl">
        <AvailabilityManager blackouts={blackouts} />
      </div>
    </div>
  );
}
