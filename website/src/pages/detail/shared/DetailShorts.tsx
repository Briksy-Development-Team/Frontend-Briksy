import { useState } from "react";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";

import short1 from "../../../assets/shorts/short_1.png";
import short2 from "../../../assets/shorts/short_2.png";
import short3 from "../../../assets/shorts/short_3.png";
import short4 from "../../../assets/shorts/short_4.png";

export interface ReelItem {
  id?: string;
  thumbnail: string;
  title: string;
  views?: string;
  videoUrl?: string;
}

export const DEFAULT_SHORTS: ReelItem[] = [
  {
    id: "short-1",
    thumbnail: short1,
    title: "Domine a transição entre o técnico e o decorado",
    views: "2.1m views",
  },
  {
    id: "short-2",
    thumbnail: short2,
    title: "Then there's over 100 feet of breathtaking views",
    views: "2.1m views",
  },
  {
    id: "short-3",
    thumbnail: short3,
    title: "Modern townhouse interior tour & highlights",
    views: "1.9m views",
  },
  {
    id: "short-4",
    thumbnail: short4,
    title: "Batman’s Best Wedding Gift - Luxury home walkthrough",
    views: "2.1m views",
  },
  {
    id: "short-5",
    thumbnail: short1,
    title: "Behind the scenes: Custom architecture & detailing",
    views: "1.7m views",
  },
  {
    id: "short-6",
    thumbnail: short2,
    title: "Swimming pool & outdoor entertainment area design",
    views: "3.4m views",
  },
  {
    id: "short-7",
    thumbnail: short3,
    title: "Sunset view from the master bedroom terrace",
    views: "890k views",
  },
];

export interface DetailShortsProps {
  reels?: ReelItem[] | null;
  title?: string;
  className?: string;
}

export default function DetailShorts({
  reels = DEFAULT_SHORTS,
  title = "Shorts",
  className = "",
}: DetailShortsProps) {
  const [activeReel, setActiveReel] = useState<ReelItem | null>(null);
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  // Requirement: "if no reel avavilable that space will be gone"
  if (!reels || reels.length === 0) {
    return null;
  }

  return (
    <section className={`flex flex-col gap-4 w-full font-helvetica ${className}`} aria-label={title}>
      {/* Header with Title and Scroll navigation buttons */}
      <div className="flex items-center justify-between w-full">
        <h3 className="text-[20px] font-medium leading-[28px] tracking-[-0.005em] text-[#222222]">
          {title}
        </h3>

        {reels.length > 2 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isBeginning}
              onClick={() => swiper?.slidePrev()}
              className="w-8 h-8 rounded-full border border-[#EDE8E4] bg-white flex items-center justify-center text-[#342511] hover:bg-[#F8F4EE] active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shadow-2xs"
              aria-label="Scroll left"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              disabled={isEnd}
              onClick={() => swiper?.slideNext()}
              className="w-8 h-8 rounded-full border border-[#EDE8E4] bg-white flex items-center justify-center text-[#342511] hover:bg-[#F8F4EE] active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shadow-2xs"
              aria-label="Scroll right"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Swiper Scrollable Container (mousewheel, touch-swipe, click & drag) */}
      <div className="w-full">
        <Swiper
          modules={[Mousewheel]}
          spaceBetween={16}
          slidesPerView="auto"
          grabCursor
          mousewheel={{
            forceToAxis: true,
            sensitivity: 1,
            releaseOnEdges: true,
          }}
          onSwiper={(s) => {
            setSwiper(s);
            setIsBeginning(s.isBeginning);
            setIsEnd(s.isEnd);
          }}
          onSlideChange={(s) => {
            setIsBeginning(s.isBeginning);
            setIsEnd(s.isEnd);
          }}
          className="[overscroll-behavior-x:contain] touch-pan-y !pb-2"
        >
          {reels.map((reel, idx) => (
            <SwiperSlide
              key={reel.id || `reel-${idx}`}
              className="!w-[230px] sm:!w-[252px]"
            >
              <div
                onClick={() => setActiveReel(reel)}
                className="w-full flex flex-col gap-2.5 cursor-pointer group select-none"
              >
                {/* Reel thumbnail */}
                <div className="relative w-full h-[345px] sm:h-[378px] rounded-xl overflow-hidden bg-[#EAE5DE] shadow-xs">
                  <img
                    src={reel.thumbnail}
                    alt={reel.title}
                    loading="lazy"
                    draggable={false}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 pointer-events-none"
                  />

                  {/* Play icon overlay */}
                  <div className="absolute inset-0 bg-black/15 group-hover:bg-black/25 transition-colors flex items-center justify-center pointer-events-none">
                    <div className="w-11 h-11 rounded-full bg-white/90 text-primary-brown flex items-center justify-center shadow-md transform transition-transform group-hover:scale-110">
                      <Play size={18} className="ml-0.5 fill-current" />
                    </div>
                  </div>

                  {/* Gradient bottom shadow */}
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                </div>

                {/* Reel info */}
                <div className="flex flex-col gap-1 px-1">
                  <p className="text-[14px] font-medium text-[#342511] line-clamp-2 leading-[20px] group-hover:text-black transition-colors">
                    {reel.title}
                  </p>
                  {reel.views && (
                    <p className="text-[14px] text-[#8B6F54] leading-[20px]">
                      {reel.views}
                    </p>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Reel viewer modal */}
      {activeReel && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveReel(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm rounded-2xl bg-black overflow-hidden shadow-2xl flex flex-col"
          >
            <button
              type="button"
              onClick={() => setActiveReel(null)}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
              aria-label="Close reel"
            >
              <X size={20} />
            </button>

            <div className="w-full aspect-[9/16] bg-neutral-900 relative">
              {activeReel.videoUrl ? (
                <video
                  src={activeReel.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="relative w-full h-full">
                  <img
                    src={activeReel.thumbnail}
                    alt={activeReel.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end p-5 bg-gradient-to-t from-black/90 via-black/30 to-transparent text-white">
                    <p className="font-medium text-base leading-snug">{activeReel.title}</p>
                    {activeReel.views && <p className="text-xs text-white/70 mt-1">{activeReel.views}</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
