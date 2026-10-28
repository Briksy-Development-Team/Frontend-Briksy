interface BuilderListCardSkeletonProps {
  count?: number;
  className?: string;
}

export default function BuilderListCardSkeleton({
  count = 1,
  className = "",
}: BuilderListCardSkeletonProps) {
  return (
    <div className={`space-y-3 w-full ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col justify-between rounded-2xl border border-[#EDE8E4] bg-white p-2.5 sm:p-3 animate-pulse font-helvetica"
        >
          {/* Top Section */}
          <div className="flex items-start gap-3">
            <div className="h-[60px] w-[60px] shrink-0 rounded-full bg-[#EAE4DC]" />
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <div className="h-4 w-3/5 rounded bg-[#EAE4DC]" />
                <div className="h-6 w-6 rounded-full bg-[#EDE8E4] shrink-0" />
              </div>
              <div className="h-3 w-2/5 rounded bg-[#EDE8E4]" />
              <div className="h-3 w-1/2 rounded bg-[#EDE8E4]" />
              <div className="flex items-center gap-1.5 pt-1">
                <div className="h-4 w-14 rounded-full bg-[#EAE4DC]" />
                <div className="h-4 w-16 rounded-full bg-[#EAE4DC]" />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#EDE8E4] my-2.5 w-full" />

          {/* Bottom Row */}
          <div className="flex items-center justify-between">
            <div className="h-3 w-24 rounded bg-[#EDE8E4]" />
            <div className="h-3 w-16 rounded bg-[#EDE8E4]" />
          </div>
        </div>
      ))}
    </div>
  );
}
