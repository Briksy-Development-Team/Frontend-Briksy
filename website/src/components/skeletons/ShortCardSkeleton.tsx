interface ShortCardSkeletonProps {
  count?: number;
  className?: string;
  gridClassName?: string;
}

export default function ShortCardSkeleton({
  count = 1,
  className = "",
  gridClassName = "grid grid-cols-2 gap-x-3 gap-y-4",
}: ShortCardSkeletonProps) {
  if (count === 1) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="aspect-[2/3] w-full rounded-2xl bg-[#EAE4DC]" />
        <div className="mt-2 h-4 w-4/5 rounded bg-[#EAE4DC]" />
        <div className="mt-1.5 h-3 w-1/3 rounded bg-[#EDE8E4]" />
      </div>
    );
  }

  return (
    <div className={gridClassName}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`animate-pulse ${className}`}>
          <div className="aspect-[2/3] w-full rounded-3xl bg-[#EAE4DC]" />
          <div className="mt-2 h-4 w-4/5 rounded bg-[#EAE4DC]" />
          <div className="mt-1.5 h-3 w-1/3 rounded bg-[#EDE8E4]" />
        </div>
      ))}
    </div>
  );
}
