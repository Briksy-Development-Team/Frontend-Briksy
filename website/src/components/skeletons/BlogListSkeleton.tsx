import Skeleton from "../Skeleton";

export default function BlogListSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="min-h-screen bg-[#F8F4EE] pt-28 pb-20 font-helvetica">
      <div className="mx-auto px-[3%]">
        <Skeleton className="h-5 w-36 rounded-md mb-6" />
        <Skeleton className="h-9 w-60 rounded-xl mb-8" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: count }).map((_, index) => (
            <div
              key={index}
              className="flex h-[28rem] flex-col overflow-hidden rounded-3xl border border-[#ddd8cf] bg-white shadow-sm"
            >
              <Skeleton className="h-[55%] w-full shrink-0" />
              <div className="flex flex-1 flex-col justify-between p-6">
                <div className="space-y-3">
                  <Skeleton className="h-5 w-full rounded" />
                  <Skeleton className="h-5 w-4/5 rounded" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/2 rounded" />
                  <Skeleton className="h-3 w-1/3 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
