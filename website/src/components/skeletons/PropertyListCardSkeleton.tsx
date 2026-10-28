interface PropertyListCardSkeletonProps {
  count?: number;
  className?: string;
}

export default function PropertyListCardSkeleton({
  count = 1,
  className = "",
}: PropertyListCardSkeletonProps) {
  return (
    <div className={`space-y-3 w-full ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex items-stretch gap-2.5 sm:gap-3 rounded-2xl border border-[#EDE8E4] bg-white p-2 animate-pulse font-helvetica"
        >
          {/* Left Photo Thumbnail */}
          <div className="w-[130px] sm:w-[137px] h-[95px] shrink-0 rounded-lg bg-[#EAE4DC]" />

          {/* Right Info Column */}
          <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <div className="h-4 w-3/5 rounded bg-[#EAE4DC]" />
                <div className="h-6 w-6 rounded-full bg-[#EDE8E4] shrink-0" />
              </div>
              <div className="h-3.5 w-1/3 rounded bg-[#EAE4DC]" />
              <div className="flex items-center gap-2 pt-0.5">
                <div className="h-3 w-7 rounded bg-[#EDE8E4]" />
                <div className="h-3 w-7 rounded bg-[#EDE8E4]" />
                <div className="h-3 w-7 rounded bg-[#EDE8E4]" />
                <div className="h-3 w-9 rounded bg-[#EDE8E4]" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 pt-1.5">
              <div className="border-t border-[#EDE8E4] w-full" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="h-5 w-5 rounded-full bg-[#EAE4DC]" />
                  <div className="h-3 w-20 rounded bg-[#EDE8E4]" />
                </div>
                <div className="h-3 w-3 rounded bg-[#EDE8E4]" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
