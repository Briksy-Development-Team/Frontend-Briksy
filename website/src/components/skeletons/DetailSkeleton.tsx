import Skeleton from "../Skeleton";
import GallerySkeleton from "./GallerySkeleton";

export default function DetailSkeleton({ gallery = true }: { gallery?: boolean }) {
  return (
    <div className="min-h-screen md:mt-20 font-helvetica flex flex-col md:pb-0">
      <main className="flex-1 max-w-[2000px] w-full mx-auto px-4 sm:px-8 lg:px-20 pb-12 md:py-6">
        {/* Breadcrumb row */}
        <div className="hidden md:flex justify-between items-center mb-6">
          <Skeleton className="h-5 w-64 rounded-md" />
          <div className="flex gap-4">
            <Skeleton className="h-5 w-16 rounded-md" />
            <Skeleton className="h-5 w-24 rounded-md" />
            <Skeleton className="h-5 w-28 rounded-md" />
          </div>
        </div>

        {/* Gallery / Banner */}
        {gallery ? (
          <GallerySkeleton />
        ) : (
          <div className="mb-8 w-full">
            <Skeleton className="h-44 md:h-64 w-full rounded-2xl md:rounded-3xl" />
          </div>
        )}

        {/* 2-Column Main Layout */}
        <div className="flex flex-col lg:flex-row gap-12 items-start relative">
          <div className="flex-1 w-full min-w-0 space-y-8">
            <div className="space-y-3">
              <Skeleton className="h-9 w-3/4 rounded-xl" />
              <Skeleton className="h-5 w-1/3 rounded-lg" />
              <Skeleton className="h-4 w-1/2 rounded-md" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-white border border-[#EDE8E4]">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>

            <div className="space-y-3">
              <Skeleton className="h-6 w-44 rounded-lg" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-11/12 rounded" />
              <Skeleton className="h-4 w-4/5 rounded" />
            </div>

            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>

          <aside className="w-full lg:w-[380px] xl:w-[420px] lg:sticky lg:top-24 shrink-0">
            <div className="rounded-3xl border border-[#EDE8E4] bg-white p-6 space-y-4 shadow-sm">
              <Skeleton className="h-6 w-1/2 rounded" />
              <Skeleton className="h-10 w-3/4 rounded-xl" />
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-11 w-full rounded-full" />
              <Skeleton className="h-11 w-full rounded-full" />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
