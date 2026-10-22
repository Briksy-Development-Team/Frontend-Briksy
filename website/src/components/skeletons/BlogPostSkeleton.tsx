import Skeleton from "../Skeleton";

export default function BlogPostSkeleton() {
  return (
    <div className="min-h-screen pt-24 pb-20 font-helvetica max-w-4xl mx-auto px-4 sm:px-6">
      <Skeleton className="h-5 w-32 rounded-md mb-6" />

      <Skeleton className="h-10 md:h-12 w-4/5 rounded-xl mb-4" />

      <div className="flex items-center gap-3 mb-8">
        <Skeleton className="h-11 w-11 rounded-full shrink-0" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-4 w-36 rounded" />
          <Skeleton className="h-3 w-24 rounded" />
        </div>
      </div>

      <Skeleton className="h-64 sm:h-80 md:h-96 w-full rounded-3xl mb-8" />

      <div className="space-y-4">
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-11/12 rounded" />
        <Skeleton className="h-4 w-4/5 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-5/6 rounded" />
        <Skeleton className="h-4 w-3/4 rounded" />
      </div>
    </div>
  );
}
