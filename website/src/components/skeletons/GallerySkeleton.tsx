import Skeleton from "../Skeleton";

export default function GallerySkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`mb-10 w-full ${className}`}>
      <div className="flex gap-2 h-[300px] md:h-[300px] xl:h-[480px] -mx-[5%] md:mx-0 md:rounded-2xl overflow-hidden md:overflow-visible">
        {/* Main hero box */}
        <Skeleton className="flex-1 min-w-0 h-full rounded-none md:rounded-xl" />

        {/* 2x2 grid of tiles on desktop */}
        <div className="hidden md:grid grid-cols-2 gap-2 content-start w-[300px] lg:w-[500px] xl:w-[488px]">
          <Skeleton className="w-[150px] lg:w-[250px] xl:w-[240px] h-[145px] xl:h-[236px] rounded-xl" />
          <Skeleton className="w-[150px] lg:w-[250px] xl:w-[240px] h-[145px] xl:h-[236px] rounded-xl" />
          <Skeleton className="w-[150px] lg:w-[250px] xl:w-[240px] h-[145px] xl:h-[236px] rounded-xl" />
          <Skeleton className="w-[150px] lg:w-[250px] xl:w-[240px] h-[145px] xl:h-[236px] rounded-xl" />
        </div>
      </div>
    </div>
  );
}
