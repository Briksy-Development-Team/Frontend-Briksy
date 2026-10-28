import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Play } from "lucide-react";
import ReelViewer from "./ReelViewer";
import { DEFAULT_SHORTS, type ShortItem } from "./types";
import { ShortCardSkeleton } from "../skeletons";
import SwiperScroll from "../swiper/SwiperScroll";

interface Props {
  title?: string;
  subtitle?: string;
  items?: ShortItem[];
  seeAllPath?: string;
  variant?: "web" | "pwa";
  isLoading?: boolean;
}

export default function ShortsSection({
  title = "Shorts",
  subtitle = "Watch 60-second walkthroughs, design breakdowns, and building tips",
  items = DEFAULT_SHORTS,
  seeAllPath = "/blogs",
  variant = "web",
  isLoading,
}: Props) {
  const [open, setOpen] = useState<number | null>(null);
  const [loading, setLoading] = useState(isLoading ?? true);

  useEffect(() => {
    if (isLoading !== undefined) { setLoading(isLoading); return; }
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, [isLoading]);

  const viewer = open !== null && (
    <ReelViewer shorts={items} initialIndex={open} isOpen onClose={() => setOpen(null)} />
  );

  // ── PWA ──────────────────────────────────────────────────────────────────────
  if (variant === "pwa") {
    return (
      <section className="space-y-3.5 pt-2 font-helvetica">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium text-[#342511] tracking-tight">{title}</h2>
          <Link to={seeAllPath} className="text-xs text-[#7C5F42] hover:text-[#342511] font-medium flex items-center gap-1">
            See all <ArrowUpRight size={13} />
          </Link>
        </div>

        {loading ? <ShortCardSkeleton count={4} /> : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-4">
            {items.map((s, i) => (
              <button key={s.id} type="button" onClick={() => setOpen(i)} className="group block text-left w-full cursor-pointer">
                <div className="aspect-[2/3] w-full overflow-hidden rounded-2xl bg-neutral-900 relative">
                  <img src={s.image} alt={s.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                  <div className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 text-white group-hover:bg-red-600 transition-colors">
                    <Play size={10} className="fill-white translate-x-[0.5px]" />
                  </div>
                  <p className="absolute bottom-2 left-2 text-[10px] text-white/80">{s.views}</p>
                </div>
                <h4 className="mt-2 truncate text-sm font-medium text-[#342511]">{s.title}</h4>
              </button>
            ))}
          </div>
        )}

        {viewer}
      </section>
    );
  }

  // ── Web ───────────────────────────────────────────────────────────────────────
  return (
    <section className="w-full font-helvetica py-4">
      <div className="mx-auto w-full max-w-[2000px] px-4 md:px-8 xl:px-14">
        <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-medium tracking-[0.14em] text-yellowgray-50 uppercase">Explore Shorts</span>
            <h2 className="text-[1.875rem] sm:text-[2.25rem] font-medium leading-[1.25] text-primary-brown tracking-tight">{title}</h2>
            {subtitle && <p className="text-[0.875rem] lg:text-[1rem] text-primary-light-brown">{subtitle}</p>}
          </div>
          <Link to={seeAllPath} className="hidden md:inline-flex items-center gap-1.5 text-[15px] font-medium text-[#8B6F54] hover:text-[#342511] shrink-0">
            View All <ArrowUpRight size={18} />
          </Link>
        </div>

        {loading ? (
          <ShortCardSkeleton count={4} gridClassName="grid grid-cols-2 md:grid-cols-4 gap-4" />
        ) : (
          <SwiperScroll slideClassName="!w-[19.6667rem]" spaceBetween={16}>
            {items.slice(0, 4).map((s, i) => (
              <button key={s.id} type="button" onClick={() => setOpen(i)}
                className="group aspect-[2/3] w-[19.6667rem] overflow-hidden rounded-3xl bg-neutral-900 relative shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer">
                <img src={s.image} alt={s.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10 group-hover:from-black/95 transition-all" />

                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center group-hover:bg-red-600 group-hover:scale-110 transition-all shadow-md">
                  <Play size={12} className="fill-white translate-x-[0.5px]" />
                </div>
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-white text-[11px] font-medium">{s.views}</div>

                <div className="absolute inset-x-0 bottom-0 p-3 text-white space-y-1 text-left">
                  <div className="flex items-center gap-1.5 opacity-80">
                    <img src={s.uploader.avatar} alt={s.uploader.name} className="w-4 h-4 rounded-full object-cover border border-white/40" />
                    <span className="text-[11px] truncate text-neutral-200">{s.uploader.name}</span>
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm leading-snug line-clamp-2 group-hover:text-amber-200 transition-colors">{s.title}</h3>
                </div>
              </button>
            ))}
          </SwiperScroll>
        )}

        <div className="mt-4 md:hidden text-center">
          <Link to={seeAllPath} className="inline-flex items-center gap-1 text-sm font-medium text-[#8B6F54] hover:text-[#342511]">
            View All Shorts <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>

      {viewer}
    </section>
  );
}
