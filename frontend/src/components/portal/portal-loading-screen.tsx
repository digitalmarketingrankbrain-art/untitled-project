import { SkeletonHeading, SkeletonTable } from "@/components/ui/skeleton";

export function PortalLoadingScreen() {
  return (
    <div className="px-6 py-8">
      <SkeletonHeading />
      <div className="mt-6">
        <SkeletonTable />
      </div>
    </div>
  );
}
