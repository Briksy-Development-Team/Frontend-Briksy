import Skeleton from "../Skeleton";

export default function ResultsSkeleton({
  count = 8,
  showHeader = false,
  gridClassName = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
  cardClassName = "h-[28rem] flex flex-col rounded-3xl",
  className = "",
}: {
  count?: number;
  showHeader?: boolean;
  gridClassName?: string;
  cardClassName?: string;
  className?: string;
}) {
  return (
    <section aria-label="Loading results" aria-live="polite" className={`w-full ${className}`}>
      {showHeader && <Skeleton className="h-4 w-32 rounded mb-5" />}

      <div className={gridClassName}>
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={`overflow-hidden bg-white border border-[#EDE8E4] shadow-sm ${cardClassName}`}
          >
            {/* Media area — matching the 60% ratio of the cards */}
            <Skeleton className="h-[60%] w-full shrink-0" />

            {/* Card info — matching the bottom section of Property/Trader/Builder cards */}
            <div className="flex min-h-0 flex-1 flex-col justify-between p-4">
              <div className="space-y-2.5">
                <Skeleton className="h-5 w-4/5 rounded-md" />
                <Skeleton className="h-4 w-3/5 rounded-md" />
                <Skeleton className="h-3.5 w-2/5 rounded-md" />
              </div>

              <div className="pt-3 border-t border-[#EDE8E4]/60 flex items-center justify-between">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-7 w-7 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <span className="sr-only">Loading results...</span>
    </section>
  );
}
