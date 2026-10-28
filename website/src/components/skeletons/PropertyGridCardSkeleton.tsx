interface PropertyGridCardSkeletonProps {
  count?: number;
  className?: string;
  gridClassName?: string;
}

export default function PropertyGridCardSkeleton({
  count = 6,
  className = "",
  gridClassName = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
}: PropertyGridCardSkeletonProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className={gridClassName}>
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-[#EDE8E4] bg-white animate-pulse flex flex-col font-helvetica"
          >
            {/* Image Placeholder */}
            <div className="h-48 sm:h-52 w-full bg-[#EAE4DC]" />

            {/* Content */}
            <div className="p-3.5 flex flex-col justify-between flex-1 gap-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-3/5 rounded bg-[#EAE4DC]" />
                  <div className="h-5 w-5 rounded-full bg-[#EDE8E4]" />
                </div>
                <div className="h-3.5 w-1/3 rounded bg-[#EAE4DC]" />
                <div className="flex items-center gap-2 pt-1">
                  <div className="h-3 w-8 rounded bg-[#EDE8E4]" />
                  <div className="h-3 w-8 rounded bg-[#EDE8E4]" />
                  <div className="h-3 w-8 rounded bg-[#EDE8E4]" />
                </div>
              </div>

              <div className="pt-2 border-t border-[#EDE8E4] flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="h-5 w-5 rounded-full bg-[#EAE4DC]" />
                  <div className="h-3 w-20 rounded bg-[#EDE8E4]" />
                </div>
                <div className="h-3 w-3 rounded bg-[#EDE8E4]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
