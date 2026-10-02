import type { ResultType } from "../../types/search";

export default function ResultsLoadingSkeleton({ resultType }: { resultType: ResultType }) {
  const title = resultType === "trader"
    ? "Popular Professionals"
    : resultType === "builder"
      ? "Popular Builders"
      : resultType === "comercial"
        ? "Commercial Properties"
        : "Popular Properties";

  return (
    <section aria-label="Loading results" aria-live="polite" className="space-y-3">
      <div className="h-7 w-56 animate-pulse rounded bg-[#E8DED2]" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="h-52 animate-pulse bg-[#D9E7E7]" />
            <div className="space-y-3 p-4">
              <div className="h-4 w-4/5 animate-pulse rounded bg-[#E8DED2]" />
              <div className="h-3 w-3/5 animate-pulse rounded bg-[#EEE7DF]" />
              <div className="h-3 w-2/5 animate-pulse rounded bg-[#EEE7DF]" />
            </div>
          </div>
        ))}
      </div>
      <span className="sr-only">Loading {title.toLowerCase()}...</span>
    </section>
  );
}
