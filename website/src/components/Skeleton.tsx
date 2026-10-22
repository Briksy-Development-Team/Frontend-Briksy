export default function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse motion-reduce:animate-none bg-skeleton ${className}`}
    />
  );
}
