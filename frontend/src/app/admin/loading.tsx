import { SkeletonHeading, SkeletonCard, SkeletonTable } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <div className="px-6 py-8">
      <SkeletonHeading />
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <div className="mt-6">
        <SkeletonTable />
      </div>
    </div>
  );
}
