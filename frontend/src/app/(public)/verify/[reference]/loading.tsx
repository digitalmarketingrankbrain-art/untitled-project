import { Skeleton } from "@/components/ui/skeleton";

export default function VerifyReferenceLoading() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <Skeleton className="h-4 w-40" />
      <div className="mt-6 rounded-lg border border-border bg-surface p-8">
        <Skeleton className="h-6 w-28" />
        <Skeleton className="mt-4 h-8 w-3/4" />
        <Skeleton className="mt-2 h-4 w-1/2" />
        <div className="mt-6 flex flex-col gap-3 border-t border-border pt-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
}
