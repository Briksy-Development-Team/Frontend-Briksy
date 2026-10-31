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
  const pwa = variant === "pwa";

  useEffect(() => {
    if (isLoading !== undefined) { setLoading(isLoading); return; }
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, [isLoading]);

  return (
    <section className={`font-helvetica ${pwa ? "pt-2" : "w-full py-4"}`}>
      <div className={pwa ? "space-y-3.5" : "mx-auto w-full max-w-[2000px] px-4 md:px-8 xl:px-14"}>
        {/* Header */}
        <div className={`flex justify-between ${pwa ? "items-center" : "mb-6 md:mb-8 flex-col md:flex-row md:items-end gap-4"}`}>
          <div className="flex flex-col gap-1">
            {!pwa && <span className="text-[11px] font-medium tracking-[0.14em] text-yellowgray-50 uppercase">Explore Shorts</span>}
            <h2 className={`font-medium text-primary-brown tracking-tight ${pwa ? "text-xl" : "text-[1.875rem] sm:text-[2.25rem] leading-[1.25]"}`}>{title}</h2>
            {!pwa && subtitle && <p className="text-[0.875rem] lg:text-[1rem] text-primary-light-brown">{subtitle}</p>}
          </div>
          <Link to={seeAllPath} className={`items-center gap-1 font-medium shrink-0 ${pwa ? "flex text-xs text-primary-light-brown hover:text-primary-brown" : "hidden md:inline-flex text-[15px] text-[#8B6F54] hover:text-[#342511]"}`}>
            {pwa ? "See all" : "View All"} <ArrowUpRight size={pwa ? 13 : 18} />
          </Link>
        </div>

        {/* Cards */}
        {loading ? (
          <ShortCardSkeleton count={4} gridClassName={pwa ? undefined : "grid grid-cols-2 md:grid-cols-4 gap-4"} />
        ) : (
          <SwiperScroll slideClassName={pwa ? "!w-[9.5rem]" : "!w-[19.6667rem]"} spaceBetween={pwa ? 12 : 16}>
            {(pwa ? items : items.slice(0, 4)).map((s, i) => (
              <button key={s.id} type="button" onClick={() => setOpen(i)} className="group block w-full text-left cursor-pointer">
                <div className={`aspect-[2/3] w-full overflow-hidden bg-neutral-900 relative ${pwa ? "rounded-2xl" : "rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300"}`}>
                  <img src={s.image} alt={s.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10" />

                  <div className={`absolute rounded-full bg-black/40 text-white flex items-center justify-center group-hover:bg-red-600 transition-all ${pwa ? "top-2 right-2 p-1.5" : "top-3 right-3 w-8 h-8 backdrop-blur-md shadow-md"}`}>
                    <Play size={pwa ? 10 : 12} className="fill-white translate-x-[0.5px]" />
                  </div>
                  <span className={`absolute text-white ${pwa ? "bottom-2 left-2 text-[10px] text-white/80" : "top-3 left-3 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-[11px] font-medium"}`}>{s.views}</span>

                  {!pwa && (
                    <div className="absolute inset-x-0 bottom-0 p-3 text-white space-y-1">
                      <div className="flex items-center gap-1.5 opacity-80">
                        <img src={s.uploader.avatar} alt={s.uploader.name} className="w-4 h-4 rounded-full object-cover border border-white/40" />
                        <span className="text-[11px] truncate text-neutral-200">{s.uploader.name}</span>
                      </div>
                      <h3 className="font-bold text-xs sm:text-sm leading-snug line-clamp-2">{s.title}</h3>
                    </div>
                  )}
                </div>
                {pwa && <h4 className="mt-2 truncate text-sm font-medium text-primary-brown">{s.title}</h4>}
              </button>
            ))}
          </SwiperScroll>
        )}

        {!pwa && (
          <div className="mt-4 md:hidden text-center">
            <Link to={seeAllPath} className="inline-flex items-center gap-1 text-sm font-medium text-[#8B6F54] hover:text-[#342511]">
              View All Shorts <ArrowUpRight size={14} />
            </Link>
          </div>
        )}
      </div>

      {open !== null && <ReelViewer shorts={items} initialIndex={open} isOpen onClose={() => setOpen(null)} />}
    </section>
  );
}